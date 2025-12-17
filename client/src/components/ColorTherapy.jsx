import React, { useState, useCallback } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const colors = [
    { name: 'Calm Blue', hex: '#0ea5e9', emotion: 'peaceful' },
    { name: 'Forest Green', hex: '#10b981', emotion: 'grounded' },
    { name: 'Lavender', hex: '#a78bfa', emotion: 'serene' },
    { name: 'Ocean', hex: '#06b6d4', emotion: 'tranquil' },
    { name: 'Sage', hex: '#6ee7b7', emotion: 'balance' },
    { name: 'Sky', hex: '#38bdf8', emotion: 'hope' },
];

const ColorTherapy = () => {
    const [score, setScore] = useState(0);
    const [targetColor, setTargetColor] = useState(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return randomColor;
    });
    const [selectedColor, setSelectedColor] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [round, setRound] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    const generateRound = useCallback(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setTargetColor(randomColor);
        setSelectedColor(null);
        setFeedback('');
    }, []);

    // No useEffect needed - targetColor is initialized in state

    const playSound = (type) => {
        if (isMuted) return;
        // Simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (type === 'correct') {
            oscillator.frequency.value = 800;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        } else {
            oscillator.frequency.value = 400;
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
        if (color.hex === targetColor.hex) {
            setScore(score + 1);
            setFeedback(`Correct! ${color.name} is ${color.emotion}. [Celebration]`);
            playSound('correct');
            setTimeout(() => {
                setRound(round + 1);
                generateRound();
            }, 1500);
        } else {
            setFeedback(`Not quite. Keep trying!`);
            playSound('incorrect');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Color Therapy</h2>
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    style={styles.muteBtn}
                >
                    {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
            </div>
            <p style={styles.description}>Match the emotion with the right color. A soothing color-matching experience.</p>

            <div style={styles.stats}>
                <div>Score: {score}</div>
                <div>Round: {round}</div>
            </div>

            {targetColor && (
                <div style={styles.gameArea}>
                    <div style={styles.prompt}>
                        <p>Find the color that feels:</p>
                        <div style={styles.targetEmotion}>{targetColor.emotion}</div>
                    </div>

                    <div style={styles.colorGrid}>
                        {colors.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => handleColorSelect(color)}
                                style={{
                                    ...styles.colorButton,
                                    background: color.hex,
                                    border: selectedColor?.hex === color.hex ? '4px solid white' : '3px solid transparent',
                                    opacity: selectedColor && selectedColor.hex !== color.hex ? 0.6 : 1,
                                    transform: selectedColor?.hex === color.hex ? 'scale(1.05)' : 'scale(1)',
                                }}
                                title={color.name}
                            />
                        ))}
                    </div>

                    {feedback && (
                        <div style={{
                            ...styles.feedback,
                            color: feedback.includes('Correct') ? '#10b981' : '#f59e0b'
                        }}>
                            {feedback}
                        </div>
                    )}
                </div>
            )}

            <div style={styles.benefits}>
                <h4>Benefits of Color Therapy:</h4>
                <ul>
                    <li>Reduces stress and anxiety</li>
                    <li>Improves mood and emotional balance</li>
                    <li>Enhances mindfulness and focus</li>
                    <li>Promotes relaxation and calm</li>
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
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    muteBtn: {
        background: 'rgba(99, 102, 241, 0.2)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        color: 'var(--primary)',
    },
    description: {
        color: 'var(--text-muted)',
        marginBottom: '20px',
        textAlign: 'center',
    },
    stats: {
        display: 'flex',
        justifyContent: 'space-around',
        marginBottom: '30px',
        padding: '16px',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '8px',
    },
    gameArea: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '30px 20px',
        marginBottom: '20px',
    },
    prompt: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    targetEmotion: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'var(--primary)',
        textTransform: 'capitalize',
        marginTop: '8px',
    },
    colorGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '16px',
        marginBottom: '20px',
    },
    colorButton: {
        aspectRatio: '1',
        border: '3px solid transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
    feedback: {
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '600',
        marginTop: '12px',
    },
    benefits: {
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
    },
};

export default ColorTherapy;
