// models/User.js

import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  email: { type: String },
  name: { type: String },
  profilePicture: { type: String },
  role: { type: String }, // 'educator' or 'student'
  supports: [String],     // e.g., ['visual', 'adhd']
  motorPreference: { type: String, enum: ['braille', 'sip', 'eye'], default: null }, // ✨ NEW FIELD
  isOnboarded: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);
