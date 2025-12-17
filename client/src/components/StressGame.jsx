import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const StressGame = () => {
    const [bubbles, setBubbles] = useState([]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const { currentUser, refreshCurrentUser } = useAuth();

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            const bubbleMaker = setInterval(addBubble, 800);
            return () => {
                clearInterval(timer);
                clearInterval(bubbleMaker);
            };
        } else if (timeLeft === 0) {
            endGame();
        }
    }, [isPlaying, timeLeft]);

    const addBubble = () => {
        const id = Date.now();
        const size = Math.random() * 40 + 40; // 40-80px
        const left = Math.random() * 80 + 10; // 10-90%
        const color = ['#2A9D8F', '#E9C46A', '#E76F51', '#264653'][Math.floor(Math.random() * 4)];

        setBubbles(prev => [...prev, { id, size, left, color }]);
        console.log('StressGame - addBubble id', id);

        // Remove bubble after 3 seconds if not popped
        setTimeout(() => {
            setBubbles(prev => prev.filter(b => b.id !== id));
        }, 3000);
    };

    const popBubble = (id) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setScore(prev => prev + 1);
        console.log('StressGame - popBubble id', id, 'newScore approx');
        // Play sound effect here if desired
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setBubbles([]);
        setIsPlaying(true);
        console.log('StressGame - startGame');
    };

    const endGame = async () => {
        setIsPlaying(false);
        // Award coins based on score (e.g., 1 coin per 5 points)
        const coinsEarned = Math.floor(score / 5);
        console.log('StressGame - endGame score:', score, 'coinsEarned:', coinsEarned);
        if (coinsEarned > 0) {
            try {
                const user = currentUser;
                if (user) {
                    const token = await user.getIdToken();
                    const res = await axios.post('http://localhost:5000/api/rewards/add', { coins: coinsEarned, reason: 'game' }, { headers: { Authorization: `Bearer ${token}` } });
                    console.log('StressGame - reward response', res.data);
                    if (typeof refreshCurrentUser === 'function') await refreshCurrentUser();
                }
                alert(`Game Over! You popped ${score} bubbles and earned ${coinsEarned} coins!`);
            } catch (error) {
                console.error("Error saving score", error);
            }
        } else {
            alert(`Game Over! You popped ${score} bubbles.`);
        }
    };

    return (
        <div className="card" style={{ position: 'relative', overflow: 'hidden', minHeight: '400px', textAlign: 'center', background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }}>
            <h3 style={{ marginBottom: '10px' }}>Stress Relief: Bubble Popper</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Pop bubbles to relieve stress and earn coins!</p>

            {!isPlaying ? (
                <div style={{ padding: '40px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🫧</div>
                    <button onClick={startGame} className="btn btn-primary" style={{ fontSize: '1.2rem', padding: '15px 40px' }}>
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 20px', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        <span>Score: {score}</span>
                        <span style={{ color: timeLeft < 10 ? 'var(--error)' : 'inherit' }}>Time: {timeLeft}s</span>
                    </div>

                    <div style={{ position: 'relative', height: '300px', marginTop: '20px' }}>
                        {bubbles.map(bubble => (
                            <div
                                key={bubble.id}
                                onClick={() => popBubble(bubble.id)}
                                style={{
                                    position: 'absolute',
                                    left: `${bubble.left}%`,
                                    bottom: '-50px', // Start below
                                    width: `${bubble.size}px`,
                                    height: `${bubble.size}px`,
                                    borderRadius: '50%',
                                    background: bubble.color,
                                    opacity: 0.7,
                                    cursor: 'pointer',
                                    animation: `floatUp 3s linear forwards`,
                                    boxShadow: 'inset -5px -5px 10px rgba(0,0,0,0.1), 0 5px 15px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    userSelect: 'none'
                                }}
                            >
                            </div>
                        ))}
                    </div>
                    <style>{`
                        @keyframes floatUp {
                            0% { transform: translateY(0) scale(1); opacity: 0; }
                            10% { opacity: 0.8; }
                            100% { transform: translateY(-350px) scale(1.1); opacity: 0; }
                        }
                    `}</style>
                </>
            )}
        </div>
    );
};

export default StressGame;
