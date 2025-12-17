const axios = require('axios');
const qs = require('querystring');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const AUTH_URL = 'https://accounts.spotify.com/api/token';
const SEARCH_URL = 'https://api.spotify.com/v1/search';

let accessToken = null;
let tokenExpiration = 0;

const getAccessToken = async () => {
    if (accessToken && Date.now() < tokenExpiration) {
        return accessToken;
    }

    try {
        const response = await axios.post(
            AUTH_URL,
            qs.stringify({ grant_type: 'client_credentials' }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                },
            }
        );

        accessToken = response.data.access_token;
        tokenExpiration = Date.now() + response.data.expires_in * 1000;
        return accessToken;
    } catch (error) {
        console.error('Error getting Spotify access token:', error.response?.data || error.message);
        throw error;
    }
};

const getSpotifyRecommendations = async (mood, language = 'en') => {
    try {
        const token = await getAccessToken();
        const langTerm = language === 'hi' ? 'hindi' : '';
        const query = `${mood} chill ${langTerm}`;

        // Add random offset to get different results each time
        const offset = Math.floor(Math.random() * 30);

        const response = await axios.get(SEARCH_URL, {
            headers: { Authorization: `Bearer ${token}` },
            params: {
                q: query,
                type: 'track',
                limit: 5,
                offset: offset
            },
        });

        return response.data.tracks.items.map(item => ({
            type: 'music',
            title: item.name,
            artist: item.artists.map(a => a.name).join(', '),
            thumbnail: item.album.images[0]?.url,
            url: item.external_urls.spotify,
            id: item.id
        }));
    } catch (error) {
        console.error('Error fetching Spotify recommendations:', error.response?.data || error.message);
        return [];
    }
};

module.exports = { getSpotifyRecommendations };
