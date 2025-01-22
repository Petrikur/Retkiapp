import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
  placeId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Review = models.Review || model("Review", reviewSchema);

export default Review;
