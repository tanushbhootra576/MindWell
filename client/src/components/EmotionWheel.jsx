import React, { useState } from 'react';
import { FaHeartbeat, FaSmile, FaFrown, FaFire } from 'react-icons/fa';

const EmotionWheel = () => {
    const emotions = [
        { name: 'Happy', color: '#fbbf24', icon: '[Happy]' },
        { name: 'Calm', color: '#60a5fa', icon: '[Calm]' },
        { name: 'Energized', color: '#f87171', icon: '[Lightning]' },
        { name: 'Anxious', color: '#c084fc', icon: '[Anxious]' },
        { name: 'Sad', color: '#6b7280', icon: '[Sad]' },
        { name: 'Angry', color: '#dc2626', icon: '[Angry]' },
        { name: 'Grateful', color: '#10b981', icon: '[Prayer]' },
        { name: 'Overwhelmed', color: '#f59e0b', icon: '[Exhausted]' },
    ];

    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const [journalEntry, setJournalEntry] = useState('');
    const [entries, setEntries] = useState([]);

    const handleSave = () => {
        if (selectedEmotion && journalEntry.trim()) {
            setEntries([...entries, { emotion: selectedEmotion, text: journalEntry, time: new Date().toLocaleString() }]);
            setJournalEntry('');
            alert('Emotion logged! Keep checking in with yourself.');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Emotion Wheel</h2>
            <p style={styles.description}>Identify and explore your emotions. What are you feeling right now?</p>

            <div style={styles.wheel}>
                {emotions.map((emotion, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedEmotion(emotion.name)}
                        style={{
                            ...styles.emotionBtn,
                            background: selectedEmotion === emotion.name ? emotion.color : `${emotion.color}40`,
                            border: selectedEmotion === emotion.name ? `3px solid ${emotion.color}` : '2px solid transparent',
                        }}
                    >
                        <div style={{ fontSize: '2rem' }}>{emotion.icon}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{emotion.name}</div>
                    </button>
                ))}
            </div>

            {selectedEmotion && (
                <div style={styles.journalSection}>
                    <h4>How are you feeling about your {selectedEmotion} mood?</h4>
                    <textarea
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        placeholder="Write your thoughts here..."
                        style={styles.textarea}
                    />
                    <button onClick={handleSave} style={styles.saveBtn}>Save Entry</button>
                </div>
            )}

            {entries.length > 0 && (
                <div style={styles.entriesSection}>
                    <h4>Your Emotion Journal ({entries.length} entries)</h4>
                    {entries.map((entry, idx) => (
                        <div key={idx} style={styles.entryCard}>
                            <div style={styles.entryHeader}>
                                <span style={{ fontWeight: '600' }}>{entry.emotion}</span>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{entry.time}</span>
                            </div>
                            <p>{entry.text}</p>
                        </div>
                    ))}
                </div>
            )}
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
    wheel: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px',
        marginBottom: '30px',
    },
    emotionBtn: {
        padding: '16px',
        border: '2px solid transparent',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
        background: '#f3f4f6',
    },
    journalSection: {
        background: 'rgba(99, 102, 241, 0.1)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        minHeight: '120px',
        padding: '12px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        background: 'var(--bg-secondary)',
        color: 'var(--text)',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        marginBottom: '12px',
        resize: 'vertical',
    },
    saveBtn: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    entriesSection: {
        marginTop: '20px',
    },
    entryCard: {
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '12px',
    },
    entryHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '8px',
        alignItems: 'center',
    },
};

export default EmotionWheel;
