import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
  login: String,
  email: { type: String, unique: true },
  zipCode: String,
  country: String,
  street: String,
});

// Compile model from schema
export const UserModel = mongoose.model("User", UserSchema);

module.exports = { UserModel };
