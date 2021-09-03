const mongoose = require("mongoose");

const feedbackSchema = mongoose.Schema(
  {
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
    collection: "feedback",
  }
);

module.exports = mongoose.model("Feedback", feedbackSchema);
