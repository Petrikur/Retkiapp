import { Schema, model, models } from "mongoose";

// Define the Place Schema with an array of categories
const placeSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: [String], // Array of strings for multiple categories
    required: true, // At least one category must be selected
  },
  position: { type: [Number], required: true }, // Array of numbers [latitude, longitude]
  image: { type: String }, // URL or file path, adjust as needed
});

// Create the Place model if it doesn't already exist
const Place = models.Place || model("Place", placeSchema);

export default Place;
