import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { FaPlay, FaPause, FaRedo, FaCoffee, FaBrain } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PomodoroTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'break'
    const [sessions, setSessions] = useState(0);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleTimerComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const handleTimerComplete = () => {
        setIsActive(false);
        if (mode === 'focus') {
            toast.success("Focus session complete! Take a break.", { icon: '[Celebration]' });
            setSessions(prev => prev + 1);
            setMode('break');
            setTimeLeft(5 * 60);
        } else {
            toast.success("Break over! Ready to focus?", { icon: '[Muscle]' });
            setMode('focus');
            setTimeLeft(25 * 60);
        }
    };

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setMode('focus');
        setTimeLeft(25 * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'focus'
        ? ((25 * 60 - timeLeft) / (25 * 60)) * 100
        : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

    return (
        <Layout>
            <div className="container fade-in" style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{ marginBottom: '10px' }}>Focus Timer</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    Use the Pomodoro technique to stay productive.
                </p>

                <div className="card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
                    {/* Progress Bar Background */}
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        height: '5px',
                        width: `${progress}%`,
                        background: mode === 'focus' ? 'var(--primary)' : 'var(--success)',
                        transition: 'width 1s linear'
                    }}></div>

                    <div style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 'bold', color: mode === 'focus' ? 'var(--primary)' : 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        {mode === 'focus' ? <><FaBrain /> Focus Time</> : <><FaCoffee /> Break Time</>}
                    </div>

                    <div style={{ fontSize: '5rem', fontWeight: 'bold', fontFamily: 'monospace', marginBottom: '30px' }}>
                        {formatTime(timeLeft)}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        <button
                            className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`}
                            onClick={toggleTimer}
                            style={{ fontSize: '1.2rem', padding: '15px 30px', borderRadius: '50px' }}
                        >
                            {isActive ? <FaPause /> : <FaPlay />}
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={resetTimer}
                            style={{ fontSize: '1.2rem', padding: '15px', borderRadius: '50%' }}
                        >
                            <FaRedo />
                        </button>
                    </div>

                    <div style={{ marginTop: '30px', color: 'var(--text-muted)' }}>
                        Sessions completed today: <strong>{sessions}</strong>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default PomodoroTimer;
