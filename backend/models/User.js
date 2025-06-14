import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  year: {
    type: Number,
    required: false,
  },
  role: {
    type: String,
    enum: ["student", "teacher"],
    required: false,
  },
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;
