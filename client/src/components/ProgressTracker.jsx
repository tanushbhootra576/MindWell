import React, { useState } from 'react';
import { FaPlus, FaCheckCircle, FaTrash } from 'react-icons/fa';

const ProgressTracker = () => {
    const [habits, setHabits] = useState([
        { id: 1, name: 'Meditate', streak: 5, completed: false },
        { id: 2, name: 'Exercise', streak: 3, completed: false },
        { id: 3, name: 'Journal', streak: 7, completed: false },
    ]);
    const [newHabit, setNewHabit] = useState('');

    const addHabit = () => {
        if (newHabit.trim()) {
            setHabits([...habits, { id: Date.now(), name: newHabit, streak: 0, completed: false }]);
            setNewHabit('');
        }
    };

    const toggleHabit = (id) => {
        setHabits(habits.map(h =>
            h.id === id ? { ...h, completed: !h.completed, streak: !h.completed ? h.streak + 1 : Math.max(0, h.streak - 1) } : h
        ));
    };

    const deleteHabit = (id) => {
        setHabits(habits.filter(h => h.id !== id));
    };

    const totalCompleted = habits.filter(h => h.completed).length;
    const completionRate = habits.length > 0 ? Math.round((totalCompleted / habits.length) * 100) : 0;

    return (
        <div style={styles.container}>
            <h2>Progress Tracker</h2>
            <p style={styles.description}>Track your daily wellness habits and build lasting streaks.</p>

            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{totalCompleted}</div>
                    <div style={styles.statLabel}>Completed Today</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{completionRate}%</div>
                    <div style={styles.statLabel}>Completion</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{habits.length}</div>
                    <div style={styles.statLabel}>Total Habits</div>
                </div>
            </div>

            <div style={styles.inputSection}>
                <input
                    type="text"
                    value={newHabit}
                    onChange={(e) => setNewHabit(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHabit()}
                    placeholder="Add a new habit..."
                    style={styles.input}
                />
                <button onClick={addHabit} style={styles.addBtn}><FaPlus /> Add</button>
            </div>

            <div style={styles.habitsList}>
                {habits.map(habit => (
                    <div key={habit.id} style={styles.habitCard}>
                        <button
                            onClick={() => toggleHabit(habit.id)}
                            style={{
                                ...styles.checkbox,
                                background: habit.completed ? 'var(--primary)' : 'transparent',
                                borderColor: habit.completed ? 'var(--primary)' : 'var(--border)',
                            }}
                        >
                            {habit.completed && <FaCheckCircle style={{ color: 'white' }} />}
                        </button>
                        <div style={styles.habitInfo}>
                            <div style={{ ...styles.habitName, textDecoration: habit.completed ? 'line-through' : 'none', color: habit.completed ? 'var(--text-muted)' : 'var(--text)' }}>
                                {habit.name}
                            </div>
                            <div style={styles.streakBadge}>Streak: {habit.streak} [Fire]</div>
                        </div>
                        <button
                            onClick={() => deleteHabit(habit.id)}
                            style={styles.deleteBtn}
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
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
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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
        marginBottom: '8px',
    },
    statLabel: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    inputSection: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
    },
    input: {
        flex: 1,
        padding: '12px 16px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        background: 'var(--bg-secondary)',
        color: 'var(--text)',
        fontSize: '0.95rem',
    },
    addBtn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
    },
    habitsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    habitCard: {
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    checkbox: {
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        border: '2px solid var(--border)',
        background: 'transparent',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2rem',
        transition: 'all 0.3s ease',
    },
    habitInfo: {
        flex: 1,
    },
    habitName: {
        fontWeight: '600',
        marginBottom: '4px',
    },
    streakBadge: {
        fontSize: '0.85rem',
        color: 'var(--primary)',
        fontWeight: '600',
    },
    deleteBtn: {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 12px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
};

export default ProgressTracker;
