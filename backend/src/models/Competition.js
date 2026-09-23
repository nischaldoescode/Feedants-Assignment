// competition document
import mongoose from 'mongoose';

const rewardSchema = new mongoose.Schema(
  {
    rank: { type: Number, required: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    icon: { type: String, required: true }
  },
  { _id: false }
);

const winnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    position: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true }
  },
  { _id: false }
);

const tabSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    body: { type: String, required: true }
  },
  { _id: false }
);

const trustItemSchema = new mongoose.Schema(
  {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true }
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['draft', 'published', 'cancelled'],
      default: 'draft',
      index: true
    },
    tags: [{ type: String, required: true }],
    format: { type: String, required: true },
    certificateAwarded: { type: Boolean, default: false },
    prizePool: { type: Number, required: true, min: 0 },
    entryFee: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR' },
    totalSpots: { type: Number, required: true, min: 1 },
    bookedSpots: { type: Number, default: 0, min: 0 },
    registeredUserIds: {
      type: [String],
      default: [],
      select: false
    },
    judge: {
      name: { type: String, required: true },
      title: { type: String, required: true },
      experience: { type: String, required: true },
      photoUrl: { type: String, required: true },
      introVideoUrl: { type: String, required: true }
    },
    timeline: {
      registrationOpensAt: { type: Date, required: true },
      registrationClosesAt: { type: Date, required: true },
      submissionStartsAt: { type: Date, required: true },
      submissionEndsAt: { type: Date, required: true },
      resultAt: { type: Date, required: true }
    },
    tabs: [tabSchema],
    rewards: [rewardSchema],
    previousWinners: [winnerSchema],
    referral: {
      code: { type: String, required: true },
      url: { type: String, required: true },
      rewardPerSignup: { type: Number, required: true, min: 0 },
      discountText: { type: String, required: true }
    },
    supportVideo: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      videoUrl: { type: String, required: true }
    },
    trustItems: [trustItemSchema],
    testimonialSummary: {
      title: { type: String, required: true },
      subtitle: { type: String, required: true }
    },
    disclaimer: { type: String, required: true }
  },
  { timestamps: true }
);

competitionSchema.index({ status: 1, 'timeline.registrationClosesAt': 1 });

// date order needs the whole nested timeline
competitionSchema.pre('validate', function validateTimeline(next) {
  const timeline = this.timeline;
  if (!timeline) {
    next();
    return;
  }

  if (
    !timeline.registrationOpensAt ||
    !timeline.registrationClosesAt ||
    !timeline.submissionStartsAt ||
    !timeline.submissionEndsAt ||
    !timeline.resultAt
  ) {
    next();
    return;
  }

  const isValidOrder = (
    timeline.registrationOpensAt < timeline.registrationClosesAt &&
    timeline.submissionStartsAt < timeline.submissionEndsAt &&
    timeline.submissionEndsAt <= timeline.resultAt
  );

  if (!isValidOrder) {
    this.invalidate('timeline', 'Competition dates are not in a valid order.');
  }

  next();
});

export const Competition = mongoose.model('Competition', competitionSchema);
