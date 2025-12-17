const express = require('express');
const router = express.Router();
const User = require('../models/User');
const emailService = require('../services/email');

const verifyToken = require('../middleware/auth');

// @route   POST /api/auth/login
// @desc    Register or Login user (Upsert)
router.post('/login', async (req, res) => {
    try {
        const { uid, email, name, photoURL } = req.body;
        console.log('/api/auth/login - payload:', { uid, email, name });

        if (!uid || !email) {
            return res.status(400).json({ message: 'Missing uid or email' });
        }

        // Atomic Upsert
        const user = await User.findOneAndUpdate(
            { firebaseUid: uid },
            {
                $set: {
                    email,
                    name: name || 'User',
                    photoURL: photoURL || '',
                    updatedAt: new Date()
                },
                $setOnInsert: {
                    createdAt: new Date(),
                    coins: 0,
                    'streaks.current': 0,
                    'streaks.longest': 0,
                    badges: [],
                    'onboarding.completed': false
                }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        console.log('/api/auth/login - upserted user id:', user && user._id);

        // Log login history
        const History = require('../models/History');
        await History.create({
            userId: uid,
            type: 'login',
            data: { method: 'google' }
        });

        // Attempt to acquire a sending lock and send welcome email only once
        try {
            if (!user.welcomeEmailSent) {
                // Acquire lock: set welcomeEmailSending=true only if not already sending/sent
                const locked = await User.findOneAndUpdate(
                    { _id: user._id, welcomeEmailSent: { $ne: true }, welcomeEmailSending: { $ne: true } },
                    { $set: { welcomeEmailSending: true } },
                    { new: true }
                );

                if (locked) {
                    // We have the lock — send the email
                    const sent = await emailService.sendWelcomeEmail(user.email, user.name || 'User');
                    if (sent) {
                        await User.updateOne({ _id: user._id }, { $set: { welcomeEmailSent: true, welcomeEmailSentAt: new Date() }, $unset: { welcomeEmailSending: "" } });
                        console.log('Welcome email sent and marked for user:', user._id);
                    } else {
                        // Sending failed — clear the sending flag so it can be retried later
                        await User.updateOne({ _id: user._id }, { $unset: { welcomeEmailSending: "" } });
                        console.error('Failed to send welcome email to', user.email);
                    }
                }
            }
        } catch (e) {
            console.error('Error during welcome email flow:', e);
            try { await User.updateOne({ _id: user._id }, { $unset: { welcomeEmailSending: "" } }); } catch (x) { /* ignore */ }
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        console.log('/api/auth/profile PUT - uid:', uid, 'body:', Object.keys(req.body));
        const {
            ageRange, sleepPattern, stressLevel, preferences, onboardingCompleted,
            name, bio, age, language, gender, location, occupation,
            goals, healthInterests, mentalHealthFocus, reminderSettings, contentPreferences, accessibility
        } = req.body;

        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update basic profile fields
        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (age) user.age = age;
        if (language) user.language = language;
        if (gender) user.gender = gender;
        if (location) user.location = location;
        if (occupation) user.occupation = occupation;

        // Update new features
        if (goals) user.goals = goals;
        if (healthInterests) user.healthInterests = healthInterests;
        if (mentalHealthFocus) user.mentalHealthFocus = mentalHealthFocus;
        if (reminderSettings) user.reminderSettings = { ...user.reminderSettings, ...reminderSettings };
        if (contentPreferences) user.contentPreferences = contentPreferences;
        if (accessibility) user.accessibility = { ...user.accessibility, ...accessibility };

        // Update onboarding fields
        if (ageRange) user.onboarding.ageRange = ageRange;
        if (sleepPattern) user.onboarding.sleepPattern = sleepPattern;
        if (stressLevel) user.onboarding.stressLevel = stressLevel;
        if (preferences) user.onboarding.preferences = preferences;
        if (onboardingCompleted !== undefined) user.onboarding.completed = onboardingCompleted;

        await user.save();
        console.log('/api/auth/profile PUT - saved user:', user._id);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auth/profile
// @desc    Get current user profile
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        console.log('/api/auth/profile GET - uid:', uid);

        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/auth/profile
// @desc    Delete user profile and all related data
router.delete('/profile', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;

        // Delete all related user data FIRST (before deleting user)
        const History = require('../models/History');
        const Entry = require('../models/Entry');
        const Task = require('../models/Task');
        const GameSession = require('../models/GameSession');
        const FocusSession = require('../models/FocusSession');

        console.log('/api/auth/profile DELETE - deleting all related data for uid:', uid);

        await Promise.all([
            History.deleteMany({ userId: uid }),
            Entry.deleteMany({ user: user._id }),
            Task.deleteMany({ userId: uid }),
            GameSession.deleteMany({ userId: uid }),
            FocusSession.deleteMany({ userId: uid })
        ]);

        // Now delete the user from MongoDB
        const user = await User.findOneAndDelete({ firebaseUid: uid });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'Profile and all related data deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: 'Error deleting profile' });
    }
});
module.exports = router;