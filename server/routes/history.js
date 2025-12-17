const express = require('express');
const router = express.Router();
const History = require('../models/History');
const verifyToken = require('../middleware/auth');

// @route   GET /api/history
// @desc    Get unified user history
router.get('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        console.log('/api/history GET - uid:', uid);
        const history = await History.find({ userId: uid })
            .sort({ timestamp: -1 })
            .limit(100);
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/history
// @desc    Log generic action (game, video, etc.)
router.post('/', verifyToken, async (req, res) => {
    try {
        const { uid } = req.user;
        const { type, data } = req.body;

        console.log('/api/history POST - uid:', uid, 'type:', type);

        const newLog = await History.create({
            userId: uid,
            type,
            data
        });

        // Optional: Award coins for certain actions (e.g. game completion)
        if (type === 'game' || type === 'video') {
            const User = require('../models/User');
            const result = await User.findOneAndUpdate(
                { firebaseUid: uid },
                { $inc: { coins: 5 } } // 5 coins for activities
            );
            console.log('/api/history POST - awarded 5 coins, user id:', result && result._id);
        }

        res.json(newLog);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
