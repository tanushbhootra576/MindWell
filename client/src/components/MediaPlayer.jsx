import React, { useState } from 'react';
import SpotifyPlayer from './SpotifyPlayer';

const MediaPlayer = ({ url, type, title }) => {
    const [spotifyModalOpen, setSpotifyModalOpen] = useState(false);

    if (!url) return null;

    const getEmbedUrl = (url, mediaType) => {
        if (mediaType === 'video' && url.includes('youtube.com')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        }
        if (mediaType === 'music' && url.includes('spotify.com')) {
            // Extract track ID and convert to embed URL
            const trackId = url.split('/track/')[1]?.split('?')[0];
            if (trackId) {
                return `https://open.spotify.com/embed/track/${trackId}`;
            }
        }
        return url;
    };

    if (type === 'music' && url.includes('spotify.com')) {
        return (
            <>
                <SpotifyPlayer
                    isOpen={spotifyModalOpen}
                    onClose={() => setSpotifyModalOpen(false)}
                    url={url}
                    title={title}
                />
                <div className="card" style={{ padding: '15px', marginBottom: '20px' }}>
                    <div style={{ marginBottom: '15px' }}>
                        <h4 style={{ margin: 0 }}>{title}</h4>
                    </div>
                    <button
                        onClick={() => setSpotifyModalOpen(true)}
                        className="btn btn-primary"
                        style={{ display: 'block', width: '100%', textAlign: 'center' }}
                    >
                        [Music] Play in Player
                    </button>
                </div>
            </>
        );
    }

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '20px' }}>
            {type === 'video' ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                    <iframe
                        src={getEmbedUrl(url, 'video')}
                        title={title}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            ) : (
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h4>{title}</h4>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        [Music] Open in Spotify
                    </a>
                </div>
            )}
        </div>
    );
};

export default MediaPlayer;
