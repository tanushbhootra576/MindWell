const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const History = require('../models/History');
const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// @route   GET /api/analytics
// @desc    Get analytics and insights based on mood entries
router.get('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { range = 'week' } = req.query;

        // Fetch user document to get streaks
        const user = await User.findOne({ firebaseUid: uid });

        // Calculate date range
        let startDate = new Date();
        if (range === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (range === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else {
            startDate = new Date('2020-01-01'); // All time
        }

        // Fetch entries for the date range
        const entries = await Entry.find({
            user: user._id,
            createdAt: { $gte: startDate }
        }).sort({ createdAt: -1 });

        // Fetch activity history
        const activities = await History.find({
            userId: uid,
            timestamp: { $gte: startDate }
        });

        // Calculate metrics
        const moodScores = entries.map(e => {
            const moodMap = { 'Very Happy': 5, 'Happy': 4, 'Neutral': 3, 'Sad': 2, 'Very Sad': 1 };
            return moodMap[e.mood] || 3;
        });

        const averageMood = moodScores.length > 0
            ? (moodScores.reduce((a, b) => a + b, 0) / moodScores.length).toFixed(1)
            : 0;

        // Mood distribution
        const moodDistribution = {};
        entries.forEach(entry => {
            moodDistribution[entry.mood] = (moodDistribution[entry.mood] || 0) + 1;
        });

        // Activity breakdown
        const activityBreakdown = {};
        activities.forEach(activity => {
            activityBreakdown[activity.type] = (activityBreakdown[activity.type] || 0) + 1;
        });

        // Mood trend (last 7 days or less based on range)
        const moodTrend = [];
        const days = range === 'week' ? 7 : range === 'month' ? 30 : 90;

        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const dayEntries = entries.filter(e =>
                e.createdAt.toISOString().split('T')[0] === dateStr
            );

            const dayScore = dayEntries.length > 0
                ? dayEntries.map(e => {
                    const moodMap = { 'Very Happy': 5, 'Happy': 4, 'Neutral': 3, 'Sad': 2, 'Very Sad': 1 };
                    return moodMap[e.mood] || 3;
                }).reduce((a, b) => a + b, 0) / dayEntries.length
                : null;

            if (dayScore !== null) {
                moodTrend.push({
                    date: dateStr.slice(5),
                    score: dayScore
                });
            }
        }

        // Generate insights
        const insights = generateInsights(entries, moodDistribution, averageMood, activityBreakdown);

        // Get streaks from user document (which we properly maintain)
        const currentStreak = user?.streaks?.current || 0;
        const longestStreak = user?.streaks?.longest || 0;

        res.json({
            averageMood,
            currentStreak,
            longestStreak,
            checkins: entries.length,
            moodDistribution,
            activityBreakdown,
            moodTrend: moodTrend.slice(-7), // Last 7 days for display
            insights
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).send('Server Error');
    }
});

const generateInsights = (entries, moodDistribution, averageMood, activityBreakdown) => {
    const insights = [];

    // Mood-based insights
    const moods = Object.keys(moodDistribution);
    if (moods.length > 0) {
        const mostCommon = Object.entries(moodDistribution).sort((a, b) => b[1] - a[1])[0];
        insights.push(`Your most common mood is ${mostCommon[0]} (${mostCommon[1]} times)`);
    }

    // Average mood insight
    if (averageMood >= 4) {
        insights.push('You\'re in a great mental state! Keep maintaining these positive habits.');
    } else if (averageMood >= 3) {
        insights.push('Your mood is stable. Continue with mindfulness and self-care practices.');
    } else {
        insights.push('Consider increasing meditation and relaxation activities to improve your mood.');
    }

    // Activity insights
    if (Object.keys(activityBreakdown).length > 0) {
        const mostActiveType = Object.entries(activityBreakdown).sort((a, b) => b[1] - a[1])[0];
        insights.push(`You've been most active with ${mostActiveType[0]} (${mostActiveType[1]} times)`);
    }

    // Check-in frequency
    if (entries.length >= 7) {
        insights.push('Excellent consistency! You\'re checking in regularly.');
    } else if (entries.length >= 3) {
        insights.push('Good effort! Try to check in more frequently for better insights.');
    }

    return insights.length > 0 ? insights : ['Start tracking your mood to get personalized insights!'];
};

module.exports = router;
