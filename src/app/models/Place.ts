import { Schema, model, models } from "mongoose";

const placeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: [String],
    required: true,
  },
  position: { type: [Number], required: true },
  image: { type: String },
  averageRating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  city: { type: String },
  country: { type: String },
  zip: { type: String },
  address: { type: String },
});

const Place = models.Place || model("Place", placeSchema);

export default Place;
