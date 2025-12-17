import React, { useState, useCallback } from 'react';
import { FaDice, FaCheckCircle } from 'react-icons/fa';

const acts = [
    { id: 1, title: 'Call a friend', desc: 'Reach out to someone you care about', category: 'social' },
    { id: 2, title: 'Drink water mindfully', desc: 'Hydrate and be present', category: 'health' },
    { id: 3, title: 'Compliment someone', desc: 'Make someone smile today', category: 'kindness' },
    { id: 4, title: 'Stretch for 5 minutes', desc: 'Move your body gently', category: 'health' },
    { id: 5, title: 'Write a gratitude note', desc: 'Express appreciation to someone', category: 'gratitude' },
    { id: 6, title: 'Take a short walk', desc: 'Get some fresh air and movement', category: 'health' },
    { id: 7, title: 'Practice deep breathing', desc: 'Five minutes of calm breathing', category: 'mindfulness' },
    { id: 8, title: 'Listen to your favorite song', desc: 'Enjoy music mindfully', category: 'joy' },
    { id: 9, title: 'Help someone today', desc: 'Do an act of kindness', category: 'kindness' },
    { id: 10, title: 'Journal for 10 minutes', desc: 'Express your thoughts and feelings', category: 'reflection' },
];

const RandomActs = () => {
    const [currentAct, setCurrentAct] = useState(() => {
        const firstAct = acts[Math.floor(Math.random() * acts.length)];
        return firstAct;
    });
    const [completedActs, setCompletedActs] = useState([]);
    const [actHistory, setActHistory] = useState([]);

    const getRandomAct = useCallback(() => {
        const remaining = acts.filter(a => !completedActs.includes(a.id));
        if (remaining.length === 0) {
            setCompletedActs([]);
            setCurrentAct(acts[Math.floor(Math.random() * acts.length)]);
        } else {
            setCurrentAct(remaining[Math.floor(Math.random() * remaining.length)]);
        }
    }, [completedActs]);

    // No useEffect needed - currentAct is initialized in state

    const completeAct = () => {
        if (currentAct) {
            const newCompleted = [...completedActs, currentAct.id];
            setCompletedActs(newCompleted);
            setActHistory([...actHistory, { ...currentAct, completedAt: new Date().toLocaleString() }]);
            getRandomAct();
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            social: '#ec4899',
            health: '#10b981',
            kindness: '#f59e0b',
            gratitude: '#06b6d4',
            mindfulness: '#8b5cf6',
            joy: '#eab308',
            reflection: '#3b82f6',
        };
        return colors[category] || '#6366f1';
    };

    return (
        <div style={styles.container}>
            <h2>Random Acts of Wellness</h2>
            <p style={styles.description}>Get a random wellness challenge. Complete it for a sense of accomplishment!</p>

            <div style={styles.stats}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{completedActs.length}</div>
                    <div style={styles.statLabel}>Acts Today</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{actHistory.length}</div>
                    <div style={styles.statLabel}>Total Completed</div>
                </div>
            </div>

            {currentAct && (
                <div style={{ ...styles.actCard, borderColor: getCategoryColor(currentAct.category) }}>
                    <div style={{ ...styles.categoryBadge, background: getCategoryColor(currentAct.category) }}>
                        {currentAct.category}
                    </div>
                    <h3 style={styles.actTitle}>{currentAct.title}</h3>
                    <p style={styles.actDesc}>{currentAct.desc}</p>
                    <button onClick={completeAct} style={styles.completeBtn}>
                        <FaCheckCircle /> I Completed This!
                    </button>
                    <button onClick={getRandomAct} style={styles.skipBtn}>
                        <FaDice /> Get Another
                    </button>
                </div>
            )}

            {actHistory.length > 0 && (
                <div style={styles.historySection}>
                    <h4>Completed Today ({actHistory.length})</h4>
                    {actHistory.slice(-5).reverse().map((act, idx) => (
                        <div key={idx} style={styles.historyItem}>
                            <FaCheckCircle style={{ color: getCategoryColor(act.category) }} />
                            <div style={styles.historyContent}>
                                <div style={styles.historyTitle}>{act.title}</div>
                                <div style={styles.historyTime}>{act.completedAt}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={styles.motivation}>
                <h4>[Muscle] Keep Going!</h4>
                <p>Every small act of wellness counts. You're doing amazing by taking care of yourself!</p>
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
    description: {
        color: 'var(--text-muted)',
        marginBottom: '20px',
        textAlign: 'center',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '30px',
    },
    statCard: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
    },
    statValue: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: 'var(--primary)',
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    actCard: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '3px solid var(--primary)',
        borderRadius: '12px',
        padding: '30px 20px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    categoryBadge: {
        display: 'inline-block',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '600',
        marginBottom: '12px',
        textTransform: 'capitalize',
    },
    actTitle: {
        fontSize: '1.6rem',
        marginBottom: '12px',
    },
    actDesc: {
        color: 'var(--text-muted)',
        marginBottom: '20px',
        fontSize: '0.95rem',
    },
    completeBtn: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '12px',
        transition: 'all 0.3s ease',
    },
    skipBtn: {
        width: '100%',
        padding: '12px',
        background: 'rgba(99, 102, 241, 0.2)',
        color: 'var(--primary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
    },
    historySection: {
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
    },
    historyItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        marginTop: '8px',
    },
    historyContent: {
        flex: 1,
    },
    historyTitle: {
        fontWeight: '600',
        marginBottom: '2px',
    },
    historyTime: {
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
    },
    motivation: {
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
    },
};

export default RandomActs;
