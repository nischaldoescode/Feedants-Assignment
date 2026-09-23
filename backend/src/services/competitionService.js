// competition service
import mongoose from 'mongoose';
import { z } from 'zod';
import { Competition } from '../models/Competition.js';
import { Participation } from '../models/Participation.js';
import { Submission } from '../models/Submission.js';
import { ApiError } from '../utils/ApiError.js';
import {
  canCancelRegistration,
  getLifecycle,
  getPrimaryAction,
  getSpotSnapshot
} from '../domain/competitionRules.js';

const registerSchema = z.object({
  language: z.enum(['en', 'hi']).default('en'),
  referralCode: z.string().trim().max(40).optional()
});

export const submissionInputSchema = z.object({
  title: z.string().trim().min(3).max(90),
  videoUrl: z
    .string()
    .trim()
    .max(500)
    .url()
    .refine((value) => {
      const url = new URL(value);

      // submissions must be browser reachable links
      return ['http:', 'https:'].includes(url.protocol) && url.hostname.includes('.');
    }, 'Video link must be a valid http or https URL.'),
  notes: z.string().trim().max(600).optional().default('')
});

const activeParticipation = { $in: ['registered', 'submitted'] };

// read one competition with viewer state
export async function getCompetitionDetail({ key, userId, now = new Date() }) {
  const competition = await findCompetitionByKey(key);

  if (!competition) {
    throw new ApiError(404, 'competition_not_found', 'Competition was not found.');
  }

  // viewer data changes the cta and badges
  const participation = userId
    ? await Participation.findOne({
        competitionId: competition._id,
        userId,
        status: activeParticipation
      }).lean()
    : null;

  const submission = participation
    ? await Submission.findOne({ competitionId: competition._id, userId }).lean()
    : null;

  return serializeCompetition({ competition, participation, submission, userId, now });
}

// reserve one spot without overselling
export async function registerForCompetition({ key, userId, input, now = new Date() }) {
  requireUser(userId);
  const payload = registerSchema.parse(input ?? {});
  const competition = await findCompetitionByKey(key);

  if (!competition) {
    throw new ApiError(404, 'competition_not_found', 'Competition was not found.');
  }

  const existing = await Participation.findOne({
    competitionId: competition._id,
    userId,
    status: activeParticipation
  }).lean();

  if (existing) {
    return getCompetitionDetail({ key: competition._id, userId, now });
  }

  // reject before touching counters
  const lifecycle = getLifecycle(competition, now);
  const spots = getSpotSnapshot(competition.totalSpots, competition.bookedSpots);

  if (!lifecycle.registration.isOpen) {
    throw new ApiError(409, 'registration_closed', 'Registration is not open right now.');
  }

  if (spots.isFull) {
    throw new ApiError(409, 'competition_full', 'All competition spots are already booked.');
  }

  // one mongo write protects the last seat
  const updatedCompetition = await Competition.findOneAndUpdate(
    buildSeatReservationFilter({ competitionId: competition._id, userId, now }),
    buildSeatReservationUpdate(userId),
    { new: true }
  );

  if (!updatedCompetition) {
    return explainRegistrationMiss({ competitionId: competition._id, key, userId, now });
  }

  try {
    // write the human registration record after the seat is held
    await Participation.findOneAndUpdate(
      { competitionId: competition._id, userId },
      {
        $set: {
          status: 'registered',
          paymentStatus: 'paid',
          language: payload.language,
          referralCode: payload.referralCode,
          paymentProvider: 'mock',
          paymentReference: `mock_${competition._id}_${userId}`,
          registeredAt: now,
          cancelledAt: null,
          submittedAt: null
        }
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (error) {
    // never leave a stuck reserved spot
    await releaseReservedSeat(competition._id, userId);
    throw error;
  }

  return getCompetitionDetail({ key: updatedCompetition._id, userId, now });
}

// cancel only while the business rules allow it
export async function cancelRegistration({ key, userId, now = new Date() }) {
  requireUser(userId);
  const competition = await findCompetitionByKey(key);

  if (!competition) {
    throw new ApiError(404, 'competition_not_found', 'Competition was not found.');
  }

  const participation = await Participation.findOne({
    competitionId: competition._id,
    userId,
    status: activeParticipation
  }).lean();

  const submission = await Submission.findOne({ competitionId: competition._id, userId }).lean();
  const lifecycle = getLifecycle(competition, now);
  const cancellation = canCancelRegistration({ lifecycle, participation, submission });

  if (!cancellation.allowed) {
    throw new ApiError(409, 'cannot_cancel_registration', cancellation.reason);
  }

  // release the seat and user marker together
  const updated = await Competition.findOneAndUpdate(
    {
      _id: competition._id,
      registeredUserIds: userId,
      bookedSpots: { $gt: 0 }
    },
    {
      $pull: { registeredUserIds: userId },
      $inc: { bookedSpots: -1 }
    },
    { new: true }
  );

  if (!updated) {
    throw new ApiError(409, 'registration_not_active', 'No active registration was found.');
  }

  await Participation.updateOne(
    { competitionId: competition._id, userId },
    {
      $set: {
        status: 'cancelled',
        paymentStatus: 'refunded',
        cancelledAt: now
      }
    }
  );

  return getCompetitionDetail({ key: competition._id, userId, now });
}

// create or replace the viewer submission
export async function submitEntry({ key, userId, input, now = new Date() }) {
  requireUser(userId);
  const payload = submissionInputSchema.parse(input ?? {});
  const competition = await findCompetitionByKey(key);

  if (!competition) {
    throw new ApiError(404, 'competition_not_found', 'Competition was not found.');
  }

  const lifecycle = getLifecycle(competition, now);

  if (!lifecycle.submission.isOpen) {
    throw new ApiError(409, 'submission_closed', 'Submission window is not open right now.');
  }

  const participation = await Participation.findOne({
    competitionId: competition._id,
    userId,
    status: activeParticipation
  });

  if (!participation) {
    throw new ApiError(403, 'registration_required', 'Register before uploading a submission.');
  }

  if (participation.paymentStatus !== 'paid') {
    throw new ApiError(402, 'payment_required', 'Only paid registrations can submit entries.');
  }

  // a later upload replaces the earlier one
  await Submission.findOneAndUpdate(
    { competitionId: competition._id, userId },
    {
      $set: {
        title: payload.title,
        videoUrl: payload.videoUrl,
        notes: payload.notes,
        status: 'uploaded',
        submittedAt: now
      }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  participation.status = 'submitted';
  participation.submittedAt = now;
  await participation.save();

  return getCompetitionDetail({ key: competition._id, userId, now });
}

// explain why the atomic seat write missed
async function explainRegistrationMiss({ competitionId, key, userId, now }) {
  const fresh = await Competition.findById(competitionId).lean();
  const participation = await Participation.findOne({
    competitionId,
    userId,
    status: activeParticipation
  }).lean();

  if (participation) {
    return getCompetitionDetail({ key, userId, now });
  }

  if (!fresh) {
    throw new ApiError(404, 'competition_not_found', 'Competition was not found.');
  }

  const lifecycle = getLifecycle(fresh, now);
  const spots = getSpotSnapshot(fresh.totalSpots, fresh.bookedSpots);

  if (!lifecycle.registration.isOpen) {
    throw new ApiError(409, 'registration_closed', 'Registration is not open right now.');
  }

  if (spots.isFull) {
    throw new ApiError(409, 'competition_full', 'All competition spots are already booked.');
  }

  throw new ApiError(409, 'registration_conflict', 'Registration could not be completed. Please retry.');
}

// undo a seat hold if the second write fails
async function releaseReservedSeat(competitionId, userId) {
  await Competition.updateOne(
    { _id: competitionId, registeredUserIds: userId, bookedSpots: { $gt: 0 } },
    {
      $pull: { registeredUserIds: userId },
      $inc: { bookedSpots: -1 }
    }
  );
}

// this is the concurrency gate for booking
export function buildSeatReservationFilter({ competitionId, userId, now }) {
  return {
    _id: competitionId,
    status: 'published',
    'timeline.registrationOpensAt': { $lte: now },
    'timeline.registrationClosesAt': { $gte: now },
    registeredUserIds: { $ne: userId },
    $expr: { $lt: ['$bookedSpots', '$totalSpots'] }
  };
}

// keep counter and user marker in one write
export function buildSeatReservationUpdate(userId) {
  return {
    $inc: { bookedSpots: 1 },
    $addToSet: { registeredUserIds: userId }
  };
}

// accept slug or mongo id
async function findCompetitionByKey(key) {
  const query = mongoose.Types.ObjectId.isValid(key) ? { _id: key } : { slug: key };
  return Competition.findOne(query).lean();
}

// shape db documents for the app
function serializeCompetition({ competition, participation, submission, userId, now }) {
  const lifecycle = getLifecycle(competition, now);
  const spots = getSpotSnapshot(competition.totalSpots, competition.bookedSpots);
  const primaryAction = getPrimaryAction({ lifecycle, spots, participation, submission });
  const cancellation = canCancelRegistration({ lifecycle, participation, submission });

  return {
    serverNow: now.toISOString(),
    competition: {
      id: String(competition._id),
      slug: competition.slug,
      title: competition.title,
      status: competition.status,
      tags: competition.tags,
      format: competition.format,
      certificateAwarded: competition.certificateAwarded,
      prizePool: money(competition.prizePool, competition.currency),
      entryFee: money(competition.entryFee, competition.currency),
      spots,
      judge: competition.judge,
      timeline: toTimelineResponse(competition.timeline),
      lifecycle: toLifecycleResponse(lifecycle),
      tabs: competition.tabs,
      rewards: competition.rewards.map((reward) => ({
        ...reward,
        prize: money(reward.amount, competition.currency)
      })),
      previousWinners: competition.previousWinners,
      referral: competition.referral,
      supportVideo: competition.supportVideo,
      trustItems: competition.trustItems,
      testimonialSummary: competition.testimonialSummary,
      disclaimer: competition.disclaimer
    },
    viewer: {
      userId,
      isRegistered: Boolean(participation),
      canCancelRegistration: cancellation.allowed,
      cancellationReason: cancellation.reason,
      participation: participation
        ? {
            status: participation.status,
            paymentStatus: participation.paymentStatus,
            registeredAt: participation.registeredAt,
            submittedAt: participation.submittedAt
          }
        : null,
      submission: submission
        ? {
            title: submission.title,
            videoUrl: submission.videoUrl,
            notes: submission.notes,
            status: submission.status,
            submittedAt: submission.submittedAt
          }
        : null,
      primaryAction
    }
  };
}

// send dates under stable names
function toTimelineResponse(timeline) {
  return {
    registrationOpensAt: timeline.registrationOpensAt,
    registrationClosesAt: timeline.registrationClosesAt,
    submissionStartsAt: timeline.submissionStartsAt,
    submissionEndsAt: timeline.submissionEndsAt,
    resultAt: timeline.resultAt
  };
}

// hide extra internal fields
function toLifecycleResponse(lifecycle) {
  return {
    phase: lifecycle.phase,
    registration: lifecycle.registration,
    submission: lifecycle.submission,
    results: lifecycle.results,
    nextMilestoneAt: lifecycle.nextMilestoneAt
  };
}

// format money once on the server
function money(amount, currency) {
  return {
    amount,
    currency,
    formatted: new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0
    }).format(amount)
  };
}

// write routes need an actor
function requireUser(userId) {
  if (!userId) {
    throw new ApiError(401, 'user_required', 'Send x-user-id to perform this action.');
  }
}
