const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide rating"],
    },

    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxlength: 100,
    },

    comment: {
      type: String,
      required: [true, "Please provide review text"],
    },

    user: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },

    product: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Product",
    },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
