import { Schema, model, models } from "mongoose";

const User = new Schema({
  firebaseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  role: { type: String, default: "user" },
});

const Place = models.Place || model("User", User);

export default Place;
