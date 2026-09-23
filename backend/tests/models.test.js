// model tests

import test from 'node:test';
import assert from 'node:assert/strict';
import { Competition } from '../src/models/Competition.js';
import { Participation } from '../src/models/Participation.js';
import { Submission } from '../src/models/Submission.js';

function validCompetition(overrides = {}) {
  return {
    slug: 'feedants-classical-dance',
    title: 'Feedants Classical Dance',
    status: 'published',
    tags: ['Dance', 'Multi-Win'],
    format: 'Multi-Win',
    certificateAwarded: true,
    prizePool: 1500,
    entryFee: 99,
    totalSpots: 20,
    bookedSpots: 1,
    judge: {
      name: 'Manju Dubey',
      title: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      photoUrl: 'https://example.com/judge.jpg',
      introVideoUrl: 'https://example.com/intro.mp4'
    },
    timeline: {
      registrationOpensAt: new Date('2026-08-01T03:30:00.000Z'),
      registrationClosesAt: new Date('2026-08-10T18:20:00.000Z'),
      submissionStartsAt: new Date('2026-08-06T22:30:00.000Z'),
      submissionEndsAt: new Date('2026-08-30T18:25:00.000Z'),
      resultAt: new Date('2026-09-01T18:20:00.000Z')
    },
    tabs: [
      { key: 'about', label: 'About Competition', body: 'About text.' }
    ],
    rewards: [
      { rank: 1, title: '1st Winner', amount: 550, icon: 'trophy' }
    ],
    previousWinners: [
      {
        name: 'Riya Shah',
        position: '1st Winner',
        thumbnailUrl: 'https://example.com/thumb.jpg',
        videoUrl: 'https://example.com/video.mp4'
      }
    ],
    referral: {
      code: 'referral123',
      url: 'https://feedants.com/r/referral123',
      rewardPerSignup: 10,
      discountText: 'Refer & Earn more discount'
    },
    supportVideo: {
      title: 'How will you receive prize money?',
      subtitle: 'Watch video to know more',
      videoUrl: 'https://example.com/prize.mp4'
    },
    trustItems: [
      { icon: 'shield', label: 'Refund policy', value: 'Refunds before submissions begin' }
    ],
    testimonialSummary: {
      title: 'Hear From Our Users',
      subtitle: 'See what participants say about Feedants'
    },
    disclaimer: 'Only paid participants will be considered.',
    ...overrides
  };
}

test('competition model accepts the seeded shape', async () => {
  const doc = new Competition(validCompetition());

  await assert.doesNotReject(() => doc.validate());
});

test('competition model rejects bad date order', async () => {
  const doc = new Competition(validCompetition({
    timeline: {
      registrationOpensAt: new Date('2026-08-10T18:20:00.000Z'),
      registrationClosesAt: new Date('2026-08-01T03:30:00.000Z'),
      submissionStartsAt: new Date('2026-08-06T22:30:00.000Z'),
      submissionEndsAt: new Date('2026-08-30T18:25:00.000Z'),
      resultAt: new Date('2026-09-01T18:20:00.000Z')
    }
  }));

  await assert.rejects(() => doc.validate(), /Competition dates are not in a valid order/);
});

test('participation model rejects unknown statuses', async () => {
  const doc = new Participation({
    competitionId: '507f1f77bcf86cd799439011',
    userId: 'demo-user-1',
    status: 'watching',
    paymentStatus: 'paid',
    paymentReference: 'mock_payment'
  });

  await assert.rejects(() => doc.validate(), /`watching` is not a valid enum value/);
});

test('submission model requires a valid url', async () => {
  const doc = new Submission({
    competitionId: '507f1f77bcf86cd799439011',
    userId: 'demo-user-1',
    title: 'Kathak entry',
    videoUrl: ''
  });

  await assert.rejects(() => doc.validate(), /Path `videoUrl` is required/);
});
