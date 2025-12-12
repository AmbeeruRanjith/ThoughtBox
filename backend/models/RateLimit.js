const mongoose = require("mongoose");

const rateLimitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String, // "like" or "comment"
      required: true,
    },

    lastActionTime: {
      type: Date,
      default: Date.now,
    },

    count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RateLimit", rateLimitSchema);
