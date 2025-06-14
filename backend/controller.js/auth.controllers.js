import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email: email.toLowerCase(), password: hashedPassword });
    await newUser.save();

    const token = generateToken(newUser._id);

    return res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.log("Signin error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const setRole = async (req, res) => {
  const { userId, role, year } = req.body;

  try {
    const update = role === 'student' ? { role, year } : { role };
    const user = await User.findByIdAndUpdate(userId, update, { new: true });

    return res.status(200).json({ message: 'Role set', user });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};
