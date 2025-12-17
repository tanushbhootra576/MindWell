import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const MoodQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const questions = [
        {
            question: "How would you rate your overall mood today?",
            options: ["Very Happy", "Happy", "Neutral", "Sad", "Very Sad"],
            points: [5, 4, 3, 2, 1]
        },
        {
            question: "How well did you sleep last night?",
            options: ["Excellently", "Well", "Average", "Poorly", "Very Poorly"],
            points: [5, 4, 3, 2, 1]
        },
        {
            question: "How stressed are you right now?",
            options: ["Not at all", "Slightly", "Moderately", "Very", "Extremely"],
            points: [5, 4, 3, 2, 1]
        },
        {
            question: "How satisfied are you with today?",
            options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
            points: [5, 4, 3, 2, 1]
        },
        {
            question: "How connected do you feel to others?",
            options: ["Very Connected", "Connected", "Somewhat", "Disconnected", "Very Disconnected"],
            points: [5, 4, 3, 2, 1]
        }
    ];

    const getMoodMessage = (finalScore) => {
        if (finalScore >= 23) return { emoji: '[Happy]', message: 'Wonderful! You\'re in a great place mentally!', color: '#10b981' };
        if (finalScore >= 18) return { emoji: '[Smile]', message: 'Good! You\'re doing well. Keep it up!', color: '#3b82f6' };
        if (finalScore >= 13) return { emoji: '[Neutral]', message: 'You\'re okay. Maybe some self-care would help?', color: '#f59e0b' };
        if (finalScore >= 8) return { emoji: '[Sad]', message: 'You might benefit from some support. Try our tools!', color: '#f97316' };
        return { emoji: '[Very Sad]', message: 'Reach out for support. You don\'t have to go through this alone.', color: '#ef4444' };
    };

    const handleAnswer = (points) => {
        setScore(score + points);
        if (currentQuestion + 1 === questions.length) {
            setShowResults(true);
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setScore(0);
        setShowResults(false);
    };

    if (showResults) {
        const moodData = getMoodMessage(score);
        return (
            <div style={styles.container}>
                <h2>Your Mood Results</h2>
                <div style={{ ...styles.resultCard, borderColor: moodData.color }}>
                    <div style={{ fontSize: '4rem', marginBottom: '16px' }}>{moodData.emoji}</div>
                    <h3 style={styles.resultTitle}>Mood Score: {score}/25</h3>
                    <p style={styles.resultMessage}>{moodData.message}</p>
                    <button onClick={resetQuiz} style={styles.restartBtn}>Take Quiz Again</button>
                </div>
                <div style={styles.recommendations}>
                    <h4>Recommended Activities:</h4>
                    <ul>
                        <li>Try a breathing exercise</li>
                        <li>Write in your gratitude jar</li>
                        <li>Take a mindful walk</li>
                        <li>Check in with a friend</li>
                        <li>Practice meditation</li>
                    </ul>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div style={styles.container}>
            <h2>Mood Check-In Quiz</h2>
            <p style={styles.description}>Answer these questions to understand your emotional state better.</p>

            <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
            </div>
            <p style={styles.progressText}>Question {currentQuestion + 1} of {questions.length}</p>

            <div style={styles.questionCard}>
                <h3 style={styles.question}>{question.question}</h3>
                <div style={styles.optionsGrid}>
                    {question.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleAnswer(question.points[idx])}
                            style={styles.optionBtn}
                        >
                            {option}
                        </button>
                    ))}
                </div>
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
        marginBottom: '30px',
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        background: 'rgba(99, 102, 241, 0.2)',
        borderRadius: '4px',
        marginBottom: '12px',
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, var(--primary), var(--secondary))',
        transition: 'width 0.3s ease',
    },
    progressText: {
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        marginBottom: '30px',
    },
    questionCard: {
        background: 'rgba(99, 102, 241, 0.1)',
        border: '2px solid var(--border)',
        borderRadius: '12px',
        padding: '30px 20px',
    },
    question: {
        marginBottom: '20px',
        fontSize: '1.3rem',
        textAlign: 'center',
    },
    optionsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '12px',
    },
    optionBtn: {
        padding: '16px',
        border: '2px solid var(--border)',
        borderRadius: '8px',
        background: 'var(--bg-secondary)',
        color: 'var(--text)',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'all 0.3s ease',
    },
    resultCard: {
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))',
        border: '3px solid',
        borderRadius: '12px',
        padding: '40px 20px',
        textAlign: 'center',
        marginBottom: '30px',
    },
    resultTitle: {
        fontSize: '1.8rem',
        marginBottom: '12px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    resultMessage: {
        fontSize: '1.1rem',
        marginBottom: '20px',
        color: 'var(--text)',
    },
    restartBtn: {
        padding: '12px 24px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    recommendations: {
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
    },
};

export default MoodQuiz;
