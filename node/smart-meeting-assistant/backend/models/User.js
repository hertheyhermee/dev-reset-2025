import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include in queries by default
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "enterprise"],
        default: "free",
      },
      stripeCustomerId: {
        type: String,
        default: null,
      },
      stripeSubscriptionId: {
        type: String,
        default: null,
      },
      meetingsProcessed: {
        type: Number,
        default: 0,
      },
      maxMeetings: {
        type: Number,
        default: 5, // Free tier limit
      },
      maxFileSize: {
        type: Number,
        default: 25 * 1024 * 1024, // 25MB for free tier
      },
      resetDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      features: {
        advancedAnalytics: { type: Boolean, default: false },
        teamCollaboration: { type: Boolean, default: false },
        apiAccess: { type: Boolean, default: false },
        customBranding: { type: Boolean, default: false },
      },
    },
    preferences: {
      language: {
        type: String,
        default: "en",
      },
      timezone: {
        type: String,
        default: "UTC",
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Index for performance
userSchema.index({ email: 1 });
userSchema.index({ "subscription.stripeCustomerId": 1 });

// Method to check subscription limits
userSchema.methods.canProcessMeeting = function () {
  const now = new Date();

  // Reset monthly counter if needed
  if (this.subscription.resetDate <= now) {
    this.subscription.meetingsProcessed = 0;
    this.subscription.resetDate = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );
    this.save();
  }

  return this.subscription.meetingsProcessed < this.subscription.maxMeetings;
};

// Method to get plan limits
userSchema.methods.getPlanLimits = function () {
  const plans = {
    free: {
      maxMeetings: 5,
      maxFileSize: 25 * 1024 * 1024, // 25MB
      maxDuration: 60, // minutes
      features: [],
    },
    pro: {
      maxMeetings: 50,
      maxFileSize: 100 * 1024 * 1024, // 100MB
      maxDuration: 180, // 3 hours
      features: ["advancedAnalytics", "teamCollaboration"],
    },
    enterprise: {
      maxMeetings: -1, // unlimited
      maxFileSize: 500 * 1024 * 1024, // 500MB
      maxDuration: -1, // unlimited
      features: [
        "advancedAnalytics",
        "teamCollaboration",
        "apiAccess",
        "customBranding",
      ],
    },
  };

  return plans[this.subscription.plan] || plans.free;
};

const User = mongoose.model("User", userSchema);

export default User;
