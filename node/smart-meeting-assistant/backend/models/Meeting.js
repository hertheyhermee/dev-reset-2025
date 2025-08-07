import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      default: null,
    },
    s3Url: {
      type: String,
      required: true,
    },
    s3Key: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["uploading", "processing", "completed", "failed"],
      default: "uploading",
    },
    processingProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    transcript: {
      type: String,
      default: null,
    },
    analysis: {
      summary: {
        type: String,
        default: null,
      },
      actionItems: [
        {
          item: String,
          assignee: String,
          deadline: Date,
          priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
          },
        },
      ],
      keyDecisions: [
        {
          decision: String,
          impact: String,
          stakeholders: [String],
        },
      ],
      participants: [
        {
          name: String,
          speakingTime: Number, // percentage
          sentiment: {
            type: String,
            enum: ["positive", "neutral", "negative"],
            default: "neutral",
          },
        },
      ],
      topics: [
        {
          topic: String,
          timeDiscussed: Number, // minutes
          importance: {
            type: Number,
            min: 1,
            max: 5,
            default: 3,
          },
        },
      ],
      sentiment: {
        overall: {
          type: String,
          enum: ["positive", "neutral", "negative"],
          default: "neutral",
        },
        score: {
          type: Number,
          min: -1,
          max: 1,
          default: 0,
        },
      },
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isShared: {
      type: Boolean,
      default: false,
    },
    sharedWith: [
      {
        email: String,
        permissions: {
          type: String,
          enum: ["view", "comment", "edit"],
          default: "view",
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    error: {
      message: String,
      code: String,
      timestamp: Date,
    },
    processingCost: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
meetingSchema.index({ userId: 1, createdAt: -1 });
meetingSchema.index({ status: 1 });
meetingSchema.index({ tags: 1 });

// Method to calculate processing cost
meetingSchema.methods.calculateCost = function () {
  if (!this.duration) return 0;

  const durationMinutes = this.duration / 60;
  const whisperCost = durationMinutes * 0.006; // $0.006 per minute
  const gptTokens = Math.ceil(this.transcript?.length / 4) || 0; // rough estimate
  const gptCost = (gptTokens / 1000) * 0.02; // $0.02 per 1K tokens

  return parseFloat((whisperCost + gptCost).toFixed(4));
};

const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;
