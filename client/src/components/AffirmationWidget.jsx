import React, { useState, useEffect } from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const AffirmationWidget = () => {
    const [affirmation, setAffirmation] = useState('');

    const affirmations = [
        "I am capable of handling whatever comes my way.",
        "I choose to focus on what I can control.",
        "My potential to succeed is infinite.",
        "I am worthy of love and respect.",
        "Every day is a fresh start."
    ];

    useEffect(() => {
        // Pick a random affirmation
        const random = affirmations[Math.floor(Math.random() * affirmations.length)];
        setAffirmation(random);
    }, []);

    return (
        <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: 'white', textAlign: 'center' }}>
            <h4 style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <FaQuoteLeft size={12} /> Daily Affirmation
            </h4>
            <p style={{ fontSize: '1.2rem', fontWeight: '500', margin: '10px 0' }}>"{affirmation}"</p>
        </div>
    );
};

export default AffirmationWidget;
