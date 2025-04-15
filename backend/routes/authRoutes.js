import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should be at least 6 characters long' });
        }

        if (username.length < 3) {
            return res.status(400).json({ message: 'Username should be at least 3 characters long' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error During Signup', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
