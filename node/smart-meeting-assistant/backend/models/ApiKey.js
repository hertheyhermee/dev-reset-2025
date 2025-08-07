import mongoose from "mongoose";
import crypto from "crypto";

const apiKeySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    key: {
      type: String,
      required: true,
      unique: true,
    },
    hashedKey: {
      type: String,
      required: true,
    },
    permissions: [
      {
        type: String,
        enum: [
          "meetings:create",
          "meetings:read",
          "meetings:delete",
          "users:read",
        ],
      },
    ],
    usageLimit: {
      requests: {
        type: Number,
        default: 1000, // per month
      },
      used: {
        type: Number,
        default: 0,
      },
      resetDate: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    },
    lastUsed: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Generate API key
apiKeySchema.statics.generateKey = function () {
  return "mk_" + crypto.randomBytes(32).toString("hex");
};

// Hash API key
apiKeySchema.methods.hashKey = function (key) {
  return crypto.createHash("sha256").update(key).digest("hex");
};

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;
