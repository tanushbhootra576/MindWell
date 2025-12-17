const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');

// POST /api/rewards/add
// body: { coins: Number, reason?: String }
router.post('/add', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { coins, reason } = req.body;
        console.log('/api/rewards/add - uid:', uid, 'coins:', coins, 'reason:', reason);
        if (!coins || typeof coins !== 'number' || coins <= 0) return res.status(400).json({ success: false, message: 'invalid coins' });

        const User = require('../models/User');
        const History = require('../models/History');
        // If this is a daily challenge reward, enforce a daily cap (25 coins)
        let award = coins;
        if (reason === 'daily_challenge') {
            const start = new Date();
            start.setHours(0,0,0,0);
            const end = new Date(start);
            end.setDate(end.getDate() + 1);

            // Sum coins already awarded today for this reason
            const agg = await History.aggregate([
                { $match: { userId: uid, type: 'reward', 'data.reason': 'daily_challenge', timestamp: { $gte: start, $lt: end } } },
                { $group: { _id: null, total: { $sum: '$data.coins' } } }
            ]);
            const totalToday = (agg[0] && agg[0].total) || 0;
            console.log('/api/rewards/add - daily_challenge totalToday:', totalToday);
            const DAILY_CAP = 25;
            const remaining = Math.max(0, DAILY_CAP - totalToday);
            if (remaining <= 0) {
                console.log('/api/rewards/add - daily cap reached for user', uid);
                const userDoc = await User.findOne({ firebaseUid: uid });
                return res.status(400).json({ success: false, message: 'daily cap reached', coins: userDoc ? userDoc.coins : 0 });
            }
            if (award > remaining) {
                console.log('/api/rewards/add - capping award from', award, 'to', remaining);
                award = remaining;
            }
        }

        const updated = await User.findOneAndUpdate(
            { firebaseUid: uid },
            { $inc: { coins: award } },
            { new: true }
        );

        // Log into history using awarded coins (may be less than requested)
        await History.create({ userId: uid, type: 'reward', data: { coins: award, reason } });

        console.log('/api/rewards/add - updated coins:', updated && updated.coins, 'awarded:', award);
        return res.json({ success: true, coins: updated.coins, awarded: award });
    } catch (err) {
        console.error('/api/rewards/add - error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
