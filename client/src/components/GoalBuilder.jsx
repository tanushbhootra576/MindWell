import React, { useState } from 'react';
import { FaBullseye, FaPlus, FaTrash, FaCheckCircle } from 'react-icons/fa';

const GoalBuilder = () => {
    const [goals, setGoals] = useState([
        { id: 1, title: 'Meditate daily', category: 'mindfulness', priority: 'high', progress: 60 },
        { id: 2, title: 'Exercise 3x a week', category: 'health', priority: 'high', progress: 40 },
    ]);
    const [newGoal, setNewGoal] = useState('');
    const [newCategory, setNewCategory] = useState('mindfulness');
    const [newPriority, setNewPriority] = useState('medium');

    const categories = ['mindfulness', 'health', 'productivity', 'relationships', 'learning'];
    const priorities = ['low', 'medium', 'high'];

    const addGoal = () => {
        if (newGoal.trim()) {
            setGoals([...goals, {
                id: Date.now(),
                title: newGoal,
                category: newCategory,
                priority: newPriority,
                progress: 0
            }]);
            setNewGoal('');
        }
    };

    const updateProgress = (id, amount) => {
        setGoals(goals.map(g =>
            g.id === id ? { ...g, progress: Math.min(100, g.progress + amount) } : g
        ));
    };

    const deleteGoal = (id) => {
        setGoals(goals.filter(g => g.id !== id));
    };

    const getPriorityColor = (priority) => {
        const colors = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
        return colors[priority];
    };

    const getCategoryEmoji = (category) => {
        const emojis = {
            mindfulness: '[Meditation]',
            health: '[Health]',
            productivity: '[Lightning]',
            relationships: '[Handshake]',
            learning: '[Books]'
        };
        return emojis[category] || '[Target]';
    };

    const completedGoals = goals.filter(g => g.progress === 100).length;
    const totalProgress = goals.length > 0 ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length) : 0;

    return (
        <div style={styles.container}>
            <h2>Goal Builder</h2>
            <p style={styles.description}>Set wellness goals and track your progress toward a healthier you.</p>

            <div style={styles.statsContainer}>
                <div style={styles.statBox}>
                    <div style={styles.statNumber}>{completedGoals}/{goals.length}</div>
                    <div style={styles.statLabel}>Goals Completed</div>
                </div>
                <div style={styles.statBox}>
                    <div style={styles.statNumber}>{totalProgress}%</div>
                    <div style={styles.statLabel}>Overall Progress</div>
                </div>
            </div>

            <div style={styles.progressBarContainer}>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${totalProgress}%` }}></div>
                </div>
            </div>

            <div style={styles.inputSection}>
                <div style={styles.inputGroup}>
                    <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="Enter your goal..."
                        style={styles.input}
                    />
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={styles.select}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={styles.select}>
                        {priorities.map(p => <option key={p} value={p}>{p} priority</option>)}
                    </select>
                    <button onClick={addGoal} style={styles.addBtn}><FaPlus /> Add</button>
                </div>
            </div>

            <div style={styles.goalsList}>
                {goals.map(goal => (
                    <div key={goal.id} style={{ ...styles.goalCard, borderLeftColor: getPriorityColor(goal.priority) }}>
                        <div style={styles.goalHeader}>
                            <div style={styles.goalTitle}>
                                <span style={styles.emoji}>{getCategoryEmoji(goal.category)}</span>
                                <div>
                                    <h4 style={{ margin: '0 0 4px 0' }}>{goal.title}</h4>
                                    <span style={styles.categoryTag}>{goal.category}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => deleteGoal(goal.id)}
                                style={styles.deleteBtn}
                            >
                                <FaTrash />
                            </button>
                        </div>

                        <div style={styles.progressContainer}>
                            <div style={styles.progressBar}>
                                <div style={{ ...styles.progressFill, width: `${goal.progress}%` }}></div>
                            </div>
                            <span style={styles.progressText}>{goal.progress}%</span>
                        </div>

                        <div style={styles.actions}>
                            <button
                                onClick={() => updateProgress(goal.id, 10)}
                                style={styles.actionBtn}
                            >
                                +10%
                            </button>
                            <button
                                onClick={() => updateProgress(goal.id, 25)}
                                style={styles.actionBtn}
                            >
                                +25%
                            </button>
                            {goal.progress < 100 && (
                                <button
                                    onClick={() => updateProgress(goal.id, 100 - goal.progress)}
                                    style={{ ...styles.actionBtn, ...styles.completeBtn }}
                                >
                                    <FaCheckCircle /> Complete
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {goals.length === 0 && (
                <div style={styles.emptyState}>
                    <FaBullseye style={{ fontSize: '3rem', marginBottom: '12px', color: 'var(--text-muted)' }} />
                    <p>No goals yet. Set your first wellness goal!</p>
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
        marginBottom: '20px',
        textAlign: 'center',
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '12px',
        marginBottom: '20px',
    },
    statBox: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
    },
    statNumber: {
        fontSize: '1.8rem',
        fontWeight: 'bold',
        color: 'var(--primary)',
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    progressBarContainer: {
        marginBottom: '20px',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
        transition: 'width 0.3s ease',
    },
    inputSection: {
        marginBottom: '30px',
    },
    inputGroup: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    input: {
        flex: 1,
        minWidth: '200px',
        padding: '12px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        background: 'var(--bg-secondary)',
        color: 'var(--text)',
    },
    select: {
        padding: '12px',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        background: 'var(--bg-secondary)',
        color: 'var(--text)',
    },
    addBtn: {
        padding: '12px 20px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    goalsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    goalCard: {
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderLeft: '4px solid',
        borderRadius: '8px',
        padding: '16px',
    },
    goalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '12px',
    },
    goalTitle: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: '1.5rem',
    },
    categoryTag: {
        fontSize: '0.75rem',
        background: 'rgba(99, 102, 241, 0.2)',
        color: 'var(--primary)',
        padding: '2px 8px',
        borderRadius: '12px',
    },
    deleteBtn: {
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        border: 'none',
        borderRadius: '6px',
        padding: '8px 12px',
        cursor: 'pointer',
    },
    progressContainer: {
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '12px',
    },
    progressText: {
        fontSize: '0.85rem',
        fontWeight: '600',
        minWidth: '40px',
    },
    actions: {
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
    },
    actionBtn: {
        padding: '6px 12px',
        background: 'rgba(99, 102, 241, 0.2)',
        color: 'var(--primary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    completeBtn: {
        background: 'rgba(16, 185, 129, 0.2)',
        color: '#10b981',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '40px 20px',
        color: 'var(--text-muted)',
    },
};

export default GoalBuilder;
