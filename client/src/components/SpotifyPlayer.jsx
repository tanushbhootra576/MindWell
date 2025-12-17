import React from 'react';

const SpotifyPlayer = ({ isOpen, onClose, url, title }) => {
    if (!isOpen || !url) return null;

    const embedUrl = url.includes('embed') ? url : url.replace('/track/', '/embed/track/');

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="card fade-in" style={{
                width: '500px',
                maxWidth: '95%',
                maxHeight: '90vh',
                overflow: 'auto',
                position: 'relative',
                background: 'var(--bg-card)',
                border: 'var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px'
            }}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-main)',
                        zIndex: 10
                    }}
                >
                    ✕
                </button>

                {/* Title */}
                <h2 style={{ marginTop: 0, marginBottom: '20px', paddingRight: '30px' }}>
                    [Music] Now Playing
                </h2>

                {/* Spotify Embed */}
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 15px 0', fontSize: '1.2rem' }}>{title}</h3>
                    <iframe
                        src={embedUrl}
                        width="100%"
                        height="380"
                        frameBorder="0"
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                        loading="lazy"
                        title={title}
                        style={{ borderRadius: '8px' }}
                    ></iframe>
                </div>

                {/* Fallback Link */}
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ display: 'block', textAlign: 'center', marginBottom: '10px' }}
                >
                    Open in Spotify App
                </a>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="btn btn-secondary"
                    style={{ display: 'block', width: '100%', textAlign: 'center' }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default SpotifyPlayer;
