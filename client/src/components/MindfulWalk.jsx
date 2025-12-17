import React, { useState, useEffect } from 'react';
import { FaPlay, FaPause, FaRedoAlt } from 'react-icons/fa';

const MindfulWalk = () => {
    const [minutes, setMinutes] = useState(15);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [totalTime] = useState(15 * 60);

    useEffect(() => {
        let interval = null;
        if (isActive && (minutes > 0 || seconds > 0)) {
            interval = setInterval(() => {
                if (seconds === 0) {
                    if (minutes === 0) {
                        setIsActive(false);
                    } else {
                        setMinutes(minutes - 1);
                        setSeconds(59);
                    }
                } else {
                    setSeconds(seconds - 1);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive, minutes, seconds]);

    const reset = () => {
        setIsActive(false);
        setMinutes(15);
        setSeconds(0);
    };

    const progress = ((totalTime - (minutes * 60 + seconds)) / totalTime) * 100;

    return (
        <div style={styles.container}>
            <h2>Mindful Walk</h2>
            <p style={styles.description}>Take a peaceful 15-minute walking meditation journey with calming background music.</p>

            <div style={styles.timerDisplay}>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                </div>
                <div style={styles.timeText}>
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </div>
            </div>

            <div style={styles.controls}>
                <button
                    onClick={() => setIsActive(!isActive)}
                    style={{ ...styles.btn, ...styles.playBtn }}
                >
                    {isActive ? <FaPause /> : <FaPlay />}
                    {isActive ? 'Pause' : 'Start'}
                </button>
                <button
                    onClick={reset}
                    style={{ ...styles.btn, ...styles.resetBtn }}
                >
                    <FaRedoAlt /> Reset
                </button>
            </div>

            <div style={styles.tips}>
                <h4>Tips for Mindful Walking:</h4>
                <ul>
                    <li>Walk at a natural, comfortable pace</li>
                    <li>Focus on your breath and footsteps</li>
                    <li>Notice sensations around you</li>
                    <li>Let thoughts pass without judgment</li>
                </ul>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto',
        textAlign: 'center',
    },
    description: {
        color: 'var(--text-muted)',
        marginBottom: '30px',
    },
    timerDisplay: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '2px solid var(--border)',
        borderRadius: '16px',
        padding: '40px 20px',
        marginBottom: '30px',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '4px',
        marginBottom: '20px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
        transition: 'width 0.3s ease',
    },
    timeText: {
        fontSize: '4rem',
        fontWeight: 'bold',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        fontFamily: 'monospace',
    },
    controls: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'center',
        marginBottom: '30px',
    },
    btn: {
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
    },
    playBtn: {
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
    },
    resetBtn: {
        background: 'rgba(99, 102, 241, 0.1)',
        color: 'var(--primary)',
        border: '1px solid var(--border)',
    },
    tips: {
        textAlign: 'left',
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
    },
};

export default MindfulWalk;
