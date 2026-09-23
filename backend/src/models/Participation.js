// participation document
import mongoose from 'mongoose';

const participationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true
    },
    userId: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ['registered', 'submitted', 'cancelled'],
      default: 'registered',
      index: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'paid',
      index: true
    },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    referralCode: { type: String, trim: true },
    paymentProvider: { type: String, default: 'mock' },
    paymentReference: { type: String, required: true },
    registeredAt: { type: Date, default: Date.now },
    cancelledAt: { type: Date },
    submittedAt: { type: Date }
  },
  { timestamps: true }
);

participationSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Participation = mongoose.model('Participation', participationSchema);
