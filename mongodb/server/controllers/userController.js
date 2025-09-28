// C:\Users\Disha\Climate-Smart-Agriculture-Platform\mongodb\server\controllers\userController.js
const bcrypt = require('bcrypt');
const User = require('../models/User');

const { validationResult } = require('express-validator');
exports.signup = async (req, res) => {
    // Handle express-validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const { username, password, email, notificationFrequency, preferredUnits } = req.body;

    try {
        if (!username || !password || !email) {
            return res.status(400).json({ message: 'Username, email, and password are required.' });
        }

        // Check for existing user with same email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        // Optional: Check for existing username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({ message: 'Username already taken.' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            preferences: { notificationFrequency, preferredUnits }
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Signup failed:', error);
        res.status(500).json({ message: 'Signup failed', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ message: 'Login failed' });
    }
};


// GET user data
exports.getUserData = async (req, res) => {
    try {
        const user = await User.findById(req.params.id); // Get user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            username: user.username,
            email: user.email,
            notificationFrequency: user.preferences.notificationFrequency,
            preferredUnits: user.preferences.preferredUnits,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
};

// PUT update user preferences
exports.updateUserPreferences = async (req, res) => {
    const { notificationFrequency, preferredUnits } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                preferences: { notificationFrequency, preferredUnits },
            },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Preferences updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating preferences' });
    }
};

// PUT update user data
exports.updateUserData = async (req, res) => {
    const { username, email, notificationFrequency, preferredUnits } = req.body;

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            {
                username,
                email,
                preferences: { notificationFrequency, preferredUnits },
            },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user data' });
    }
};

exports.changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if old password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Hash the new password and update it
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Error changing password' });
    }
};
