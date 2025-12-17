import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import toast from 'react-hot-toast';

const ThoughtSorter = () => {
    const [score, setScore] = useState(0);
    const [currentWord, setCurrentWord] = useState(null);
    const [gameOver, setGameOver] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);

    const words = [
        { text: "I am enough", type: "helpful" },
        { text: "I can't do this", type: "unhelpful" },
        { text: "Mistakes help me learn", type: "helpful" },
        { text: "Everyone judges me", type: "unhelpful" },
        { text: "I am worthy", type: "helpful" },
        { text: "It's hopeless", type: "unhelpful" },
        { text: "One step at a time", type: "helpful" },
        { text: "I'm a failure", type: "unhelpful" },
        { text: "I choose peace", type: "helpful" },
        { text: "Why bother?", type: "unhelpful" }
    ];

    useEffect(() => {
        let timer;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            endGame();
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameOver(false);
        setIsPlaying(true);
        nextWord();
    };

    const endGame = () => {
        setIsPlaying(false);
        setGameOver(true);
        setCurrentWord(null);
        toast.success(`Game Over! Score: ${score}`);
    };

    const nextWord = () => {
        const random = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(random);
    };

    const handleChoice = (type) => {
        if (!currentWord) return;

        if (type === currentWord.type) {
            setScore(prev => prev + 10);
            toast.success("Correct!", { duration: 500, icon: '[Star]' });
        } else {
            setScore(prev => Math.max(0, prev - 5));
            toast.error("Oops!", { duration: 500 });
        }
        nextWord();
    };

    return (
        <Layout>
            <div className="container fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px' }}>Thought Sorter</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    Categorize thoughts as "Helpful" or "Unhelpful".
                </p>

                <div className="card" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>

                    {!isPlaying && !gameOver && (
                        <button className="btn btn-primary" onClick={startGame} style={{ fontSize: '1.5rem', padding: '15px 40px' }}>
                            Start Game
                        </button>
                    )}

                    {isPlaying && (
                        <>
                            <div style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                [Timer] {timeLeft}s
                            </div>
                            <div style={{ position: 'absolute', top: '20px', left: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                                [Trophy] {score}
                            </div>

                            <div style={{
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                marginBottom: '40px',
                                padding: '20px',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '12px',
                                width: '80%'
                            }}>
                                {currentWord?.text}
                            </div>

                            <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
                                <button
                                    className="btn"
                                    onClick={() => handleChoice('helpful')}
                                    style={{ background: '#4CAF50', color: 'white', flex: 1, maxWidth: '150px' }}
                                >
                                    Helpful
                                </button>
                                <button
                                    className="btn"
                                    onClick={() => handleChoice('unhelpful')}
                                    style={{ background: '#F44336', color: 'white', flex: 1, maxWidth: '150px' }}
                                >
                                    Unhelpful
                                </button>
                            </div>
                        </>
                    )}

                    {gameOver && (
                        <div>
                            <h3>Great Job!</h3>
                            <p style={{ fontSize: '1.5rem', margin: '20px 0' }}>Final Score: {score}</p>
                            <button className="btn btn-primary" onClick={startGame}>Play Again</button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ThoughtSorter;
