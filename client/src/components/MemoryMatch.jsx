import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const MemoryMatch = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [disabled, setDisabled] = useState(false);

    const emojis = ['[Dog]', '[Cat]', '[Mouse]', '[Hamster]', '[Rabbit]', '[Fox]', '[Bear]', '[Panda]'];

    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        const deck = [...emojis, ...emojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji }));
        setCards(deck);
        setFlipped([]);
        setSolved([]);
    };

    const handleClick = (id) => {
        if (disabled || flipped.includes(id) || solved.includes(id)) return;

        if (flipped.length === 0) {
            setFlipped([id]);
        } else {
            setFlipped([flipped[0], id]);
            setDisabled(true);
            checkForMatch(id);
        }
    };

    const checkForMatch = (secondId) => {
        const firstId = flipped[0];
        const firstCard = cards.find(c => c.id === firstId);
        const secondCard = cards.find(c => c.id === secondId);

        if (firstCard.emoji === secondCard.emoji) {
            setSolved([...solved, firstId, secondId]);
            setFlipped([]);
            setDisabled(false);
        } else {
            setTimeout(() => {
                setFlipped([]);
                setDisabled(false);
            }, 1000);
        }
    };

    return (
        <Layout>
            <div className="header">
                <h2>Memory Match</h2>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3>Find the Pairs</h3>
                    <button onClick={initializeGame} className="btn btn-secondary">Restart</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', maxWidth: '400px', margin: '0 auto' }}>
                    {cards.map(card => (
                        <div
                            key={card.id}
                            onClick={() => handleClick(card.id)}
                            style={{
                                aspectRatio: '1',
                                background: flipped.includes(card.id) || solved.includes(card.id) ? 'white' : 'var(--primary)',
                                border: '2px solid var(--border)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                transform: flipped.includes(card.id) || solved.includes(card.id) ? 'rotateY(180deg)' : 'rotateY(0)'
                            }}
                        >
                            {(flipped.includes(card.id) || solved.includes(card.id)) ? card.emoji : ''}
                        </div>
                    ))}
                </div>
                {solved.length === cards.length && cards.length > 0 && (
                    <div style={{ marginTop: '20px', color: 'var(--success)', fontWeight: 'bold' }}>
                        [Celebration] You matched all pairs!
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MemoryMatch;
