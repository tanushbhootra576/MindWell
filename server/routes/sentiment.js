const express = require('express');
const router = express.Router();
const sentiment = require('../services/sentimentService');

// Trigger training from stored interactions (Entry/History)
router.post('/train', async (req, res) => {
    try {
        console.log('/api/sentiment/train - triggered');
        const result = await sentiment.trainFromData({ save: true, minExamples: 5 });
        console.log('/api/sentiment/train - result:', result);
        return res.json(result);
    } catch (err) {
        console.error('Train error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

// Predict sentiment for given text
router.post('/predict', (req, res) => {
    try {
        const { text } = req.body;
        console.log('/api/sentiment/predict - text length:', text ? text.length : 0);
        if (!text) return res.status(400).json({ error: 'text is required' });
        const out = sentiment.predict(text);
        console.log('/api/sentiment/predict - out:', out.label);
        return res.json({ success: true, text, ...out });
    } catch (err) {
        console.error('Predict error', err);
        return res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
