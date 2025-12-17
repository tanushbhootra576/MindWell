const express = require('express');
const router = express.Router();
const { getYouTubeRecommendations } = require('../services/youtube');
const { getSpotifyRecommendations } = require('../services/spotify');

// @route   GET /api/recommendations
// @desc    Get recommendations based on mood
router.get('/', async (req, res) => {
    const { mood, language } = req.query;

    if (!mood) {
        return res.status(400).json({ message: 'Mood is required' });
    }

    try {
        // Disable caching for this endpoint
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');

        const lang = language || 'en';

        const [videos, music] = await Promise.all([
            getYouTubeRecommendations(mood, lang),
            getSpotifyRecommendations(mood, lang)
        ]);

        res.json([...videos, ...music]);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
