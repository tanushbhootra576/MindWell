import React, { useState } from 'react';
import { FaHeart, FaRedo, FaBookmark, FaStar } from 'react-icons/fa';

const affirmations = [
    "I am worthy of love and respect.",
    "I am capable of achieving my goals.",
    "I choose to focus on the positive.",
    "I am stronger than I think.",
    "I am deserving of happiness and success.",
    "I believe in myself and my abilities.",
    "I am grateful for all the good in my life.",
    "I am enough, just as I am.",
    "I radiate confidence and positive energy.",
    "I am in control of my own happiness.",
    "I choose to be kind to myself.",
    "I am growing and improving every day.",
    "I am proud of how far I've come.",
    "I attract positive experiences and people.",
    "I am creating a life I love.",
    "My potential is unlimited.",
    "I am resilient and can overcome challenges.",
    "I deserve to pursue my dreams.",
    "I am enough right now, in this moment.",
    "I spread joy and positivity wherever I go.",
    "I am becoming my best self.",
    "Every day brings new opportunities for growth.",
    "I am a beacon of hope and light.",
    "I choose progress over perfection.",
    "I am worthy of all good things.",
];

const PositiveAffirmations = () => {
    // Initialize state from localStorage with lazy init
    const [currentAffirmation, setCurrentAffirmation] = useState(() => {
        const random = affirmations[Math.floor(Math.random() * affirmations.length)];
        return random;
    });

    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('affirmationFavorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [streak] = useState(() => {
        const savedStreak = localStorage.getItem('affirmationStreak');
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('affirmationLastViewed');

        if (savedDate !== today) {
            const newStreak = savedStreak ? parseInt(savedStreak) + 1 : 1;
            localStorage.setItem('affirmationStreak', newStreak.toString());
            localStorage.setItem('affirmationLastViewed', today);
            return newStreak;
        } else {
            localStorage.setItem('affirmationLastViewed', today);
            return savedStreak ? parseInt(savedStreak) : 0;
        }
    });

    const [isFavorited, setIsFavorited] = useState(false);
    const [showFavorites, setShowFavorites] = useState(false);

    // No useEffect needed - all state is initialized in lazy initializers

    const toggleFavorite = () => {
        let updated;
        if (isFavorited) {
            updated = favorites.filter(fav => fav !== currentAffirmation);
        } else {
            updated = [...favorites, currentAffirmation];
        }
        setFavorites(updated);
        localStorage.setItem('affirmationFavorites', JSON.stringify(updated));
        setIsFavorited(!isFavorited);
    };

    const removeFavorite = (affirmation) => {
        const updated = favorites.filter(fav => fav !== affirmation);
        setFavorites(updated);
        localStorage.setItem('affirmationFavorites', JSON.stringify(updated));
    };

    return (
        <div style={styles.container}>
            <h2>Positive Affirmations</h2>
            <p style={styles.description}>Start your day with positive affirmations. Build confidence and self-belief, one affirmation at a time.</p>

            <div style={styles.streakCard}>
                <div style={styles.streakContent}>
                    <FaStar style={{ fontSize: '2rem', color: '#fbbf24' }} />
                    <div style={styles.streakText}>
                        <div style={styles.streakNumber}>{streak}</div>
                        <div style={styles.streakLabel}>Day Streak! [Fire]</div>
                    </div>
                </div>
            </div>

            {!showFavorites ? (
                <div style={styles.affirmationCard}>
                    <div style={styles.affirmationContent}>
                        <div style={styles.affirmationText}>"{currentAffirmation}"</div>
                    </div>

                    <div style={styles.controls}>
                        <button
                            onClick={toggleFavorite}
                            style={{
                                ...styles.btn,
                                ...styles.favoriteBtn,
                                background: isFavorited ? 'rgba(236, 72, 153, 0.3)' : 'rgba(99, 102, 241, 0.2)',
                                color: isFavorited ? '#ec4899' : 'var(--text)',
                            }}
                        >
                            <FaHeart style={{ fill: isFavorited ? '#ec4899' : 'none' }} />
                            {isFavorited ? 'Favorited' : 'Favorite'}
                        </button>
                        <button onClick={() => {
                            const random = affirmations[Math.floor(Math.random() * affirmations.length)];
                            setCurrentAffirmation(random);
                        }} style={{ ...styles.btn, ...styles.nextBtn }}>
                            <FaRedo /> New Affirmation
                        </button>
                    </div>

                    {favorites.length > 0 && (
                        <button
                            onClick={() => setShowFavorites(true)}
                            style={{ ...styles.btn, ...styles.viewFavBtn }}
                        >
                            <FaBookmark /> View Favorites ({favorites.length})
                        </button>
                    )}
                </div>
            ) : (
                <div style={styles.favoritesCard}>
                    <button
                        onClick={() => setShowFavorites(false)}
                        style={{ ...styles.btn, ...styles.backBtn }}
                    >
                        ← Back to Affirmations
                    </button>
                    <h3 style={styles.favoritesTitle}>Your Favorite Affirmations ({favorites.length})</h3>
                    {favorites.length > 0 ? (
                        <div style={styles.favoritesList}>
                            {favorites.map((fav, idx) => (
                                <div key={idx} style={styles.favoriteItem}>
                                    <p>{fav}</p>
                                    <button
                                        onClick={() => removeFavorite(fav)}
                                        style={styles.removeBtn}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={styles.emptyMessage}>No favorites yet. Add some affirmations to your list!</p>
                    )}
                </div>
            )}

            <div style={styles.tips}>
                <h4>[Thought] How to Use:</h4>
                <ul>
                    <li>Read the affirmation aloud to yourself</li>
                    <li>Believe in the words you're saying</li>
                    <li>Favorite affirmations that resonate with you</li>
                    <li>Repeat your favorites throughout the day</li>
                    <li>Maintain your daily streak for consistency</li>
                </ul>
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
        marginBottom: '20px',
        textAlign: 'center',
    },
    streakCard: {
        background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(249, 158, 11, 0.1))',
        border: '2px solid rgba(251, 191, 36, 0.3)',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '30px',
    },
    streakContent: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    streakText: {
        textAlign: 'left',
    },
    streakNumber: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#fbbf24',
        lineHeight: 1,
    },
    streakLabel: {
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
    },
    affirmationCard: {
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
        border: '2px solid var(--border)',
        borderRadius: '16px',
        padding: '40px 20px',
        marginBottom: '20px',
    },
    affirmationContent: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    affirmationText: {
        fontSize: '1.6rem',
        fontWeight: '600',
        color: 'var(--primary)',
        lineHeight: '1.6',
    },
    controls: {
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
    },
    btn: {
        padding: '12px 20px',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.3s ease',
    },
    favoriteBtn: {
        flex: 1,
        minWidth: '150px',
        border: '1px solid var(--border)',
    },
    nextBtn: {
        flex: 1,
        minWidth: '150px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
    },
    viewFavBtn: {
        width: '100%',
        background: 'rgba(99, 102, 241, 0.2)',
        color: 'var(--primary)',
        border: '1px solid var(--border)',
    },
    favoritesCard: {
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(139, 92, 246, 0.1))',
        border: '2px solid var(--border)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '20px',
    },
    backBtn: {
        width: '100%',
        background: 'rgba(99, 102, 241, 0.2)',
        color: 'var(--primary)',
        border: '1px solid var(--border)',
        marginBottom: '16px',
    },
    favoritesTitle: {
        marginBottom: '16px',
        color: 'var(--primary)',
    },
    favoritesList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    favoriteItem: {
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        gap: '12px',
    },
    removeBtn: {
        padding: '6px 12px',
        background: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: '600',
    },
    emptyMessage: {
        textAlign: 'center',
        color: 'var(--text-muted)',
        padding: '20px',
    },
    tips: {
        background: 'rgba(236, 72, 153, 0.1)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
    },
};

export default PositiveAffirmations;
