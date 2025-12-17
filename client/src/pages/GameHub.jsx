import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { FaWind, FaClock, FaBrain, FaLungs, FaBalanceScale, FaHeartbeat, FaPalette, FaLightbulb, FaCompass, FaPuzzlePiece, FaDice, FaMedal, FaLeaf, FaBullseye, FaStar } from 'react-icons/fa';

const GameHub = () => {
    const games = [
        { id: 'stress-popper', title: 'Stress Popper', desc: 'Pop bubbles to relieve stress.', icon: <FaWind />, route: '/games/stress-popper', category: 'stress' },
        { id: 'focus-flow', title: 'Focus Flow', desc: 'Train your attention span.', icon: <FaClock />, route: '/games/focus-flow', category: 'focus' },
        { id: 'memory-match', title: 'Memory Match', desc: 'Boost your memory.', icon: <FaBrain />, route: '/games/memory-match', category: 'cognitive' },
        { id: 'breathing', title: 'Breathing Bubble', desc: '4-7-8 Breathing Guide.', icon: <FaLungs />, route: '/games/breathing', category: 'breathing' },
        { id: 'thought-sorter', title: 'Thought Sorter', desc: 'Challenge negative thoughts.', icon: <FaBalanceScale />, route: '/games/thought-sorter', category: 'mindfulness' },

        // New games
        { id: 'mindful-walk', title: 'Mindful Walk', desc: 'Walking meditation timer with music.', icon: <FaCompass />, route: '/games/mindful-walk', category: 'mindfulness' },
        { id: 'emotion-wheel', title: 'Emotion Wheel', desc: 'Identify and process your emotions.', icon: <FaHeartbeat />, route: '/games/emotion-wheel', category: 'emotional' },
        { id: 'gratitude-jar', title: 'Gratitude Jar', desc: 'Write and reflect on things you\'re grateful for.', icon: <FaLeaf />, route: '/games/gratitude-jar', category: 'mindfulness' },
        { id: 'progress-tracker', title: 'Progress Tracker', desc: 'Track daily wellness habits and goals.', icon: <FaMedal />, route: '/games/progress-tracker', category: 'habits' },
        { id: 'quiz-mood', title: 'Mood Quiz', desc: 'Interactive quiz to understand your mood.', icon: <FaLightbulb />, route: '/games/mood-quiz', category: 'emotional' },
        { id: 'puzzle-relax', title: 'Puzzle Relax', desc: 'Relaxing puzzle game for mindfulness.', icon: <FaPuzzlePiece />, route: '/games/puzzle-relax', category: 'cognitive' },
        { id: 'color-therapy', title: 'Color Therapy', desc: 'Soothing color matching game.', icon: <FaPalette />, route: '/games/color-therapy', category: 'stress' },
        { id: 'random-acts', title: 'Random Acts', desc: 'Daily challenges for kindness and wellness.', icon: <FaDice />, route: '/games/random-acts', category: 'mindfulness' },
        { id: 'goal-builder', title: 'Goal Builder', desc: 'Set and track wellness goals.', icon: <FaBullseye />, route: '/games/goal-builder', category: 'habits' },
        { id: 'sleep-story', title: 'Sleep Stories', desc: 'Relaxing stories for better sleep.', icon: <FaLungs />, route: '/games/sleep-story', category: 'sleep' },
        { id: 'affirmations', title: 'Positive Affirmations', desc: 'Build confidence with daily affirmations.', icon: <FaStar />, route: '/games/affirmations', category: 'mindfulness' },
    ];

    return (
        <Layout>
            <div className="header">
                <h2>Mini-Games Hub</h2>
                <p style={{ color: 'var(--text-muted)' }}>Explore and play games for stress relief, focus, and wellness</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '24px' }}>
                {games.map(game => (
                    <div key={game.id} className="card" style={{ textAlign: 'center', transition: 'all 0.3s ease' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '16px', color: 'var(--primary)' }}>{game.icon}</div>
                        <h3>{game.title}</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '0.9rem' }}>{game.desc}</p>
                        <span style={{
                            display: 'inline-block',
                            background: 'rgba(99, 102, 241, 0.2)',
                            color: 'var(--primary)',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '0.75rem',
                            marginBottom: '16px',
                            textTransform: 'capitalize'
                        }}>
                            {game.category}
                        </span>
                        <Link to={game.route} className="btn btn-primary" style={{ width: '100%' }}>
                            Play Now
                        </Link>
                    </div>
                ))}
            </div>
        </Layout>
    );
};

export default GameHub;
