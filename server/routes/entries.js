const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const User = require('../models/User');
const History = require('../models/History');

const verifyToken = require('../middleware/auth');

// @route   POST /api/entries
// @desc    Create a new journal/mood entry
router.post('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        let { mood, journalText } = req.body;
        if (!mood) {
            console.log('/api/entries POST - missing mood, defaulting to Neutral');
            mood = 'Neutral';
        }

        console.log('/api/entries POST - uid:', uid, 'mood:', mood, 'journalText length:', journalText ? journalText.length : 0);

        const user = await User.findOne({ firebaseUid: uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 1. Create Entry
        const sentimentScore = journalText ? (journalText.length > 10 ? 0.8 : 0.5) : 0.5;

        const newEntry = new Entry({
            user: user._id,
            mood,
            journalText,
            sentimentScore,
            recommendations: [],
        });
        const entry = await newEntry.save();

        // 2. Calculate Streak & Check-in Date
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let lastCheckIn = user.streaks?.lastCheckInDate ? new Date(user.streaks.lastCheckInDate) : null;
        if (lastCheckIn) lastCheckIn.setHours(0, 0, 0, 0);

        // Streak calculation:
        // - If last check-in was yesterday: increment current streak
        // - If last check-in was today: don't increment (already counted)
        // - If last check-in was before yesterday: reset to 1
        let newCurrentStreak = user.streaks?.current || 0;
        let newLongestStreak = user.streaks?.longest || 0;

        if (!lastCheckIn || lastCheckIn.getTime() < today.getTime()) {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastCheckIn && lastCheckIn.getTime() === yesterday.getTime()) {
                // Last check-in was yesterday, increment streak
                newCurrentStreak = (newCurrentStreak || 0) + 1;
            } else {
                // Last check-in was before yesterday or never, reset to 1
                newCurrentStreak = 1;
            }

            // Update longest streak if current exceeded it
            if (newCurrentStreak > (newLongestStreak || 0)) {
                newLongestStreak = newCurrentStreak;
            }
        }

        // 3. Atomic Update: Coins + Streak + LastCheckIn
        let coinsToAdd = 0;
        // Only award coins if last check-in was before today (i.e., not today)
        if (!lastCheckIn || lastCheckIn.getTime() < today.getTime()) {
            coinsToAdd = 5;
        }
        console.log('/api/entries POST - coinsToAdd:', coinsToAdd, 'newCurrentStreak:', newCurrentStreak, 'newLongestStreak:', newLongestStreak);
        const updatedUser = await User.findOneAndUpdate(
            { firebaseUid: uid },
            {
                $inc: { coins: coinsToAdd },
                $set: {
                    'streaks.lastCheckInDate': new Date(),
                    'streaks.current': newCurrentStreak,
                    'streaks.longest': newLongestStreak
                }
            },
            { new: true }
        );

        console.log('/api/entries POST - updatedUser coins:', updatedUser && updatedUser.coins);

        // 4. Log to Unified History
        await History.create({
            userId: uid,
            type: 'checkin',
            data: { mood, sentimentScore }
        });

        res.json({ entry, coins: updatedUser.coins });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/entries
// @desc    Get all entries for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const user = await User.findOne({ firebaseUid: uid });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const entries = await Entry.find({ user: user._id }).sort({ createdAt: -1 });
        res.json(entries);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
