import React, { useState, useEffect, useMemo } from 'react';
import { FaPlay, FaPause, FaRedoAlt, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const SleepStories = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentStory, setCurrentStory] = useState(0);
    const [progress, setProgress] = useState(0);

    const stories = useMemo(() => [
        {
            title: 'The Peaceful Forest',
            duration: 180,
            description: 'A soothing journey through an ancient, quiet forest filled with gentle sounds of nature.',
            narrator: 'Calm voice'
        },
        {
            title: 'Ocean Waves',
            duration: 200,
            description: 'Fall asleep to the rhythmic sounds of gentle ocean waves on a quiet beach.',
            narrator: 'Peaceful narrator'
        },
        {
            title: 'Mountain Sanctuary',
            duration: 220,
            description: 'A meditative story about finding peace in a serene mountain meadow.',
            narrator: 'Soothing voice'
        },
        {
            title: 'Starlit Dreams',
            duration: 240,
            description: 'Drift off to a magical journey through a starlit night sky.',
            narrator: 'Gentle narrator'
        },
        {
            title: 'Garden of Calm',
            duration: 190,
            description: 'Explore a beautiful, peaceful garden where every flower hums a lullaby.',
            narrator: 'Relaxing voice'
        },
    ], []);

    useEffect(() => {
        let interval;
        if (isPlaying && progress < stories[currentStory].duration) {
            interval = setInterval(() => {
                setProgress(p => {
                    const nextProgress = p + 1;
                    if (nextProgress >= stories[currentStory].duration) {
                        setIsPlaying(false);
                    }
                    return nextProgress;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, progress, currentStory, stories]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    };

    const progressPercent = (progress / stories[currentStory].duration) * 100;

    const handleStorySelect = (idx) => {
        setCurrentStory(idx);
        setProgress(0);
        setIsPlaying(false);
    };

    return (
        <div style={styles.container}>
            <h2>Sleep Stories</h2>
            <p style={styles.description}>Relax with calming bedtime stories designed to help you sleep peacefully.</p>

            <div style={styles.playerCard}>
                <div style={styles.nowPlaying}>
                    <h3>{stories[currentStory].title}</h3>
                    <p style={styles.narrator}>{stories[currentStory].narrator}</p>
                </div>

                <div style={styles.playerControls}>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        style={{ ...styles.controlBtn, ...styles.playBtn }}
                    >
                        {isPlaying ? <FaPause /> : <FaPlay />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button
                        onClick={() => {
                            setProgress(0);
                            setIsPlaying(false);
                        }}
                        style={{ ...styles.controlBtn, ...styles.resetBtn }}
                    >
                        <FaRedoAlt /> Reset
                    </button>
                    <button
                        onClick={() => setIsMuted(!isMuted)}
                        style={{ ...styles.controlBtn, ...styles.muteBtn }}
                    >
                        {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    </button>
                </div>

                <div style={styles.progressSection}>
                    <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: `${progressPercent}%` }}></div>
                    </div>
                    <div style={styles.timeInfo}>
                        <span>{formatTime(progress)}</span>
                        <span>/</span>
                        <span>{formatTime(stories[currentStory].duration)}</span>
                    </div>
                </div>
            </div>

            <div style={styles.storiesSection}>
                <h4>Select a Story</h4>
                <div style={styles.storiesGrid}>
                    {stories.map((story, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleStorySelect(idx)}
                            style={{
                                ...styles.storyCard,
                                border: currentStory === idx ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: currentStory === idx ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.05)',
                            }}
                        >
                            <h4>{story.title}</h4>
                            <p style={styles.storyDesc}>{story.description}</p>
                            <span style={styles.duration}>{formatTime(story.duration)}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div style={styles.tips}>
                <h4>[Moon] Tips for Better Sleep:</h4>
                <ul>
                    <li>Find a comfortable position and relax your body</li>
                    <li>Keep the room cool and dark</li>
                    <li>Focus on the narrator's voice</li>
                    <li>Let worries drift away as you listen</li>
                    <li>Don't rush to fall asleep - let it happen naturally</li>
                </ul>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '700px',
        margin: '0 auto',
    },
    description: {
        color: 'var(--text-muted)',
        marginBottom: '30px',
        textAlign: 'center',
    },
    playerCard: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '2px solid var(--border)',
        borderRadius: '16px',
        padding: '30px 20px',
        marginBottom: '30px',
    },
    nowPlaying: {
        textAlign: 'center',
        marginBottom: '20px',
    },
    narrator: {
        color: 'var(--text-muted)',
        fontSize: '0.9rem',
        marginTop: '4px',
    },
    playerControls: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '20px',
    },
    controlBtn: {
        padding: '12px 16px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.3s ease',
    },
    playBtn: {
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
    },
    resetBtn: {
        background: 'rgba(99, 102, 241, 0.2)',
        color: 'var(--primary)',
        border: '1px solid var(--border)',
    },
    muteBtn: {
        background: 'rgba(99, 102, 241, 0.2)',
        color: 'var(--primary)',
        border: '1px solid var(--border)',
    },
    progressSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    progressBar: {
        width: '100%',
        height: '6px',
        background: 'rgba(99, 102, 241, 0.3)',
        borderRadius: '3px',
        overflow: 'hidden',
        cursor: 'pointer',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
        transition: 'width 0.3s ease',
    },
    timeInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
    },
    storiesSection: {
        marginBottom: '30px',
    },
    storiesGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px',
        marginTop: '12px',
    },
    storyCard: {
        padding: '16px',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        background: 'rgba(99, 102, 241, 0.05)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'left',
    },
    storyDesc: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '8px',
        lineHeight: '1.4',
    },
    duration: {
        fontSize: '0.75rem',
        color: 'var(--primary)',
        fontWeight: '600',
    },
    tips: {
        background: 'rgba(139, 92, 246, 0.1)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
    },
};

export default SleepStories;
