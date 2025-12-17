import React, { useState } from 'react';
import { FaSmile, FaSpa, FaWind, FaFrown, FaBolt } from 'react-icons/fa';

const MoodModal = ({ onSelect, onClose }) => {
    const moods = [
        { label: 'Happy', emoji: <FaSmile />, color: '#FFD700' },
        { label: 'Calm', emoji: <FaSpa />, color: '#A8DADC' },
        { label: 'Anxious', emoji: <FaWind />, color: '#F4A261' },
        { label: 'Sad', emoji: <FaFrown />, color: '#457B9D' },
        { label: 'Stressed', emoji: <FaBolt />, color: '#E76F51' },
    ];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card fade-in" style={{ width: '400px', textAlign: 'center', position: 'relative' }}>
                <button onClick={onClose} aria-label="Close" style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer' }}>&times;</button>
                <h3>How are you feeling right now?</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Check in to unlock your dashboard.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {moods.map(mood => (
                        <button
                            key={mood.label}
                            onClick={() => onSelect(mood.label)}
                            style={{
                                background: 'white',
                                border: `2px solid ${mood.color}`,
                                borderRadius: '12px',
                                padding: '15px',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <span style={{ fontSize: '2rem' }}>{mood.emoji}</span>
                            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>{mood.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MoodModal;
