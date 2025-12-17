import React, { useState } from 'react';
import { FaLeaf, FaTrash } from 'react-icons/fa';

const GratitudeJar = () => {
    const [gratitudeText, setGratitudeText] = useState('');
    const [items, setItems] = useState([]);

    const addGratitude = () => {
        if (gratitudeText.trim()) {
            setItems([...items, { id: Date.now(), text: gratitudeText, date: new Date().toLocaleDateString() }]);
            setGratitudeText('');
        }
    };

    const deleteItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    return (
        <div style={styles.container}>
            <h2>Gratitude Jar</h2>
            <p style={styles.description}>Write down things you're grateful for and watch them fill your jar of positivity.</p>

            <div style={styles.jarSection}>
                <div style={styles.jar}>
                    {items.length === 0 ? (
                        <div style={styles.emptyJar}>
                            <FaLeaf style={{ fontSize: '3rem', color: 'var(--text-muted)' }} />
                            <p>Your jar is empty. Add your first gratitude!</p>
                        </div>
                    ) : (
                        <div style={styles.jarContents}>
                            {items.map((item) => (
                                <div key={item.id} style={styles.gratitudeNote}>
                                    "{item.text}"
                                </div>
                            ))}
                            <div style={{ ...styles.jarFill, height: `${Math.min(items.length * 8, 100)}%` }}></div>
                        </div>
                    )}
                </div>
                <p style={styles.count}>{items.length} gratitude{items.length !== 1 ? 's' : ''}</p>
            </div>

            <div style={styles.inputSection}>
                <textarea
                    value={gratitudeText}
                    onChange={(e) => setGratitudeText(e.target.value)}
                    placeholder="What are you grateful for today?"
                    style={styles.textarea}
                />
                <button onClick={addGratitude} style={styles.addBtn}>Add to Jar</button>
            </div>

            {items.length > 0 && (
                <div style={styles.listSection}>
                    <h4>Your Gratitudes</h4>
                    {items.map((item) => (
                        <div key={item.id} style={styles.listItem}>
                            <div style={styles.listContent}>
                                <p style={styles.gratitudeText}>{item.text}</p>
                                <span style={styles.date}>{item.date}</span>
                            </div>
                            <button
                                onClick={() => deleteItem(item.id)}
                                style={styles.deleteBtn}
                            >
                                <FaTrash />
                            </button>
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
        maxWidth: '600px',
        margin: '0 auto',
    },
    description: {
        color: 'var(--text-muted)',
        marginBottom: '30px',
        textAlign: 'center',
    },
    jarSection: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
    },
    jar: {
        width: '200px',
        height: '300px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.1))',
        border: '3px solid var(--border)',
        borderRadius: '12px 12px 24px 24px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        boxShadow: 'inset 0 0 20px rgba(16, 185, 129, 0.2)',
    },
    jarContents: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '12px',
        gap: '8px',
        overflow: 'auto',
    },
    gratitudeNote: {
        background: 'rgba(16, 185, 129, 0.2)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '8px',
        padding: '8px',
        fontSize: '0.8rem',
        color: 'var(--text)',
        wordWrap: 'break-word',
    },
    jarFill: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.4))',
        transition: 'height 0.3s ease',
    },
    emptyJar: {
        textAlign: 'center',
        color: 'var(--text-muted)',
        padding: '40px 20px',
    },
    count: {
        marginTop: '12px',
        color: 'var(--primary)',
        fontWeight: '600',
    },
    inputSection: {
        background: 'rgba(99, 102, 241, 0.1)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
    },
    textarea: {
        width: '100%',
        minHeight: '100px',
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
    addBtn: {
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
    listSection: {
        marginTop: '20px',
    },
    listItem: {
        background: 'rgba(16, 185, 129, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '16px',
        marginTop: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        gap: '12px',
    },
    listContent: {
        flex: 1,
    },
    gratitudeText: {
        margin: '0 0 4px 0',
    },
    date: {
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
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

export default GratitudeJar;
