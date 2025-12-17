const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

const getYouTubeRecommendations = async (mood, language = 'en') => {
    try {
        const langTerm = language === 'hi' ? 'hindi' : '';
        const query = `${mood} mood relaxation music meditation ${langTerm}`;

        const response = await axios.get(BASE_URL, {
            params: {
                part: 'snippet',
                maxResults: 15, // Fetch more to shuffle
                q: query,
                type: 'video',
                key: YOUTUBE_API_KEY,
                relevanceLanguage: language === 'hi' ? 'hi' : 'en',
                order: 'relevance'
            },
        });

        const items = response.data.items || [];
        // Shuffle items
        for (let i = items.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [items[i], items[j]] = [items[j], items[i]];
        }

        return items.slice(0, 5).map(item => ({
            type: 'video',
            title: item.snippet.title,
            description: item.snippet.description,
            thumbnail: item.snippet.thumbnails.medium.url,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            id: item.id.videoId
        }));
    } catch (error) {
        console.error('Error fetching YouTube recommendations:', error.response?.data || error.message);
        return [];
    }
};

module.exports = { getYouTubeRecommendations };
