import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  firebaseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String, default: "" },
  role: { type: String, default: "user" },
});

const User = models.User || model("User", userSchema);

export default User;
