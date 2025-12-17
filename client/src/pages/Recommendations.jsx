import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import MediaPlayer from '../components/MediaPlayer';
import SpotifyPlayer from '../components/SpotifyPlayer';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// Create axios instance with no-cache settings
const axiosInstance = axios.create({
    headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    }
});

// Add timestamp to every request to prevent caching
axiosInstance.interceptors.request.use((config) => {
    config.params = config.params || {};
    config.params.t = new Date().getTime();
    return config;
});

const Recommendations = () => {
    const { currentUser } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mood, setMood] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [spotifyModalOpen, setSpotifyModalOpen] = useState(false);
    const [spotifyTrack, setSpotifyTrack] = useState(null);

    useEffect(() => {
        // Initial fetch based on some default or user's last mood if available
    }, []);

    const fetchBooks = async (selectedMood) => {
        try {
            const terms = {
                'Happy': 'happiness+psychology',
                'Calm': 'meditation+mindfulness',
                'Anxious': 'anxiety+relief',
                'Sad': 'hope+inspiration',
                'Stressed': 'stress+management'
            };
            const query = terms[selectedMood] || 'mental+health';
            const timestamp = new Date().getTime();
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=5&t=${timestamp}`);
            const data = await res.json();
            if (data.items) {
                setBooks(data.items);
            }
        } catch (error) {
            console.error("Error fetching books", error);
        }
    };

    const fetchRecommendations = async (selectedMood) => {
        setLoading(true);
        setMood(selectedMood);
        setRecommendations([]); // Clear previous recommendations immediately
        setSelectedMedia(null);
        setBooks([]); // Clear previous books
        fetchBooks(selectedMood);
        try {
            const res = await axiosInstance.get(`http://localhost:5000/api/recommendations?mood=${selectedMood}`);
            setRecommendations(res.data);
        } catch (error) {
            console.error("Error fetching recommendations", error);
        }
        setLoading(false);
    };

    const handlePlay = (rec) => {
        if (rec.type === 'music') {
            // For music, open Spotify popup
            setSpotifyTrack(rec);
            setSpotifyModalOpen(true);
        } else {
            // For videos, show in main player
            setSelectedMedia(rec);
        }
        // Log to history
        // axios.post('/api/history', { type: rec.type, data: { title: rec.title, url: rec.url } });
    };

    const moods = ['Happy', 'Calm', 'Anxious', 'Sad', 'Stressed'];

    return (
        <Layout>
            {/* Spotify Player Modal */}
            <SpotifyPlayer
                isOpen={spotifyModalOpen}
                onClose={() => setSpotifyModalOpen(false)}
                url={spotifyTrack?.url}
                title={spotifyTrack?.title}
            />

            <div className="header">
                <h2>Recommended for You</h2>
            </div>

            <div className="card" style={{ marginBottom: '30px' }}>
                <h3>What are you in the mood for?</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                    {moods.map(m => (
                        <button
                            key={m}
                            onClick={() => fetchRecommendations(m)}
                            className={`btn ${mood === m ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            {selectedMedia && (
                <div className="fade-in">
                    <h3>Now Playing</h3>
                    <MediaPlayer url={selectedMedia.url} type={selectedMedia.type} title={selectedMedia.title} />
                </div>
            )}

            <div className="card">
                <h3>Curated Content</h3>
                {loading ? (
                    <p>Finding the best content for you...</p>
                ) : recommendations.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Select a mood to see movies and music.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {recommendations.map((rec, index) => (
                            <div key={index} style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: 'var(--radius-sm)', display: 'flex', gap: '15px', alignItems: 'flex-start', border: '1px solid var(--border)' }}>
                                {rec.thumbnail && (
                                    <img src={rec.thumbnail} alt={rec.title} style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '4px' }} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: '600' }}>
                                        {rec.type}
                                    </div>
                                    <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '1.1rem' }}>{rec.title}</div>
                                    {rec.artist && <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{rec.artist}</div>}

                                    <button
                                        onClick={() => handlePlay(rec)}
                                        className="btn btn-primary"
                                        style={{ marginTop: '10px', fontSize: '0.8rem' }}
                                    >
                                        {rec.type === 'video' ? '▶ Play Video' : '♫ Listen Now'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {books.length > 0 && (
                <div className="card" style={{ marginTop: '30px' }}>
                    <h3>Recommended Reads</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
                        {books.map((book) => (
                            <div key={book.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '150px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                                    {book.volumeInfo.imageLinks?.thumbnail ? (
                                        <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} style={{ height: '100%', objectFit: 'contain' }} />
                                    ) : (
                                        <div style={{ width: '100px', height: '100%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>No Cover</div>
                                    )}
                                </div>
                                <h4 style={{ fontSize: '1rem', marginBottom: '5px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.volumeInfo.title}</h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                    {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                                </p>
                                <a
                                    href={book.volumeInfo.previewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary"
                                    style={{ marginTop: 'auto', textAlign: 'center', fontSize: '0.8rem' }}
                                >
                                    Preview Book
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Recommendations;
