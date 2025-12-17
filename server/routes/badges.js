const express = require('express');
const router = express.Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// @route   POST /api/badges/check-and-award
// @desc    Check user streaks/achievements and award badges
// @access  Private
router.post('/check-and-award', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        let badgesAwarded = [];
        const existingBadgeIds = user.badges?.map(b => b.id) || [];

        // Define badge criteria
        const badgeCriteria = [
            {
                id: 'first-step',
                name: 'First Step',
                description: 'Complete your first check-in',
                icon: '[Footprint]',
                check: () => true // Award immediately if not already awarded
            },
            {
                id: 'week-warrior',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                icon: '[Fire]',
                check: () => (user.streaks?.current || 0) >= 7
            },
            {
                id: 'month-master',
                name: 'Month Master',
                description: 'Maintain a 30-day streak',
                icon: '[Crown]',
                check: () => (user.streaks?.current || 0) >= 30
            },
            {
                id: 'century',
                name: 'Century Club',
                description: 'Reach a 100-day streak',
                icon: '[Perfect]',
                check: () => (user.streaks?.current || 0) >= 100
            },
            {
                id: 'peak-performance',
                name: 'Peak Performance',
                description: 'Achieve your longest streak',
                icon: '[Mountain]',
                check: () => (user.streaks?.longest || 0) >= 30
            },
            {
                id: 'golden-achievement',
                name: 'Golden Achievement',
                description: 'Reach 100 coins',
                icon: '[Trophy]',
                check: () => (user.coins || 0) >= 100
            },
            {
                id: 'wellness-champion',
                name: 'Wellness Champion',
                description: 'Reach 500 coins',
                icon: '[Gold Medal]',
                check: () => (user.coins || 0) >= 500
            }
        ];

        // Check each badge criteria
        for (const badge of badgeCriteria) {
            if (!existingBadgeIds.includes(badge.id) && badge.check()) {
                // Award badge
                const newBadge = {
                    id: badge.id,
                    name: badge.name,
                    dateEarned: new Date(),
                    icon: badge.icon
                };

                user.badges.push(newBadge);
                badgesAwarded.push(newBadge);
            }
        }

        // Save user if badges were awarded
        if (badgesAwarded.length > 0) {
            await user.save();
            console.log(`/api/badges/check-and-award - Awarded ${badgesAwarded.length} badges to user ${uid}`);
        }

        res.json({
            success: true,
            badgesAwarded,
            totalBadges: user.badges?.length || 0
        });
    } catch (error) {
        console.error('/api/badges/check-and-award error:', error);
        res.status(500).json({ message: 'Error checking badges', error: error.message });
    }
});

// @route   GET /api/badges/available
// @desc    Get all available badges and user's earned badges
// @access  Private
router.get('/available', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const user = await User.findOne({ firebaseUid: uid });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const allBadges = [
            {
                id: 'first-step',
                name: 'First Step',
                description: 'Complete your first check-in',
                icon: '[Footprint]',
                earned: user.badges?.some(b => b.id === 'first-step') || false
            },
            {
                id: 'week-warrior',
                name: 'Week Warrior',
                description: 'Maintain a 7-day streak',
                icon: '[Fire]',
                earned: user.badges?.some(b => b.id === 'week-warrior') || false
            },
            {
                id: 'month-master',
                name: 'Month Master',
                description: 'Maintain a 30-day streak',
                icon: '[Crown]',
                earned: user.badges?.some(b => b.id === 'month-master') || false
            },
            {
                id: 'century',
                name: 'Century Club',
                description: 'Reach a 100-day streak',
                icon: '[Perfect]',
                earned: user.badges?.some(b => b.id === 'century') || false
            },
            {
                id: 'peak-performance',
                name: 'Peak Performance',
                description: 'Achieve your longest streak',
                icon: '⛰️',
                earned: user.badges?.some(b => b.id === 'peak-performance') || false
            },
            {
                id: 'golden-achievement',
                name: 'Golden Achievement',
                description: 'Reach 100 coins',
                icon: '[Trophy]',
                earned: user.badges?.some(b => b.id === 'golden-achievement') || false
            },
            {
                id: 'wellness-champion',
                name: 'Wellness Champion',
                description: 'Reach 500 coins',
                icon: '[Gold Medal]',
                earned: user.badges?.some(b => b.id === 'wellness-champion') || false
            }
        ];

        res.json({
            allBadges,
            earnedCount: user.badges?.length || 0
        });
    } catch (error) {
        console.error('/api/badges/available error:', error);
        res.status(500).json({ message: 'Error fetching badges', error: error.message });
    }
});

module.exports = router;
