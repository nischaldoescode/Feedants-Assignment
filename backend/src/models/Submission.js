// submission document
import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Competition',
      required: true,
      index: true
    },
    userId: { type: String, required: true, trim: true, index: true },
    title: { type: String, required: true, trim: true, maxlength: 90 },
    videoUrl: { type: String, required: true, trim: true },
    notes: { type: String, trim: true, maxlength: 600 },
    status: {
      type: String,
      enum: ['uploaded', 'under_review', 'accepted', 'rejected'],
      default: 'uploaded'
    },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

submissionSchema.index({ competitionId: 1, userId: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
