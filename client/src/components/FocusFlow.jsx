import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

const FocusFlow = () => {
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0); // in seconds
    const [target, setTarget] = useState(60); // 1 minute target

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setTime((time) => time + 1);
            }, 1000);
        } else if (!isActive && time !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, time]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTime(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const progress = Math.min((time / target) * 100, 100);

    return (
        <Layout>
            <div className="header">
                <h2>Focus Flow</h2>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h3 style={{ marginBottom: '10px' }}>Train Your Attention</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>Keep the timer running without switching tabs to earn coins.</p>

                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 40px' }}>
                    <svg width="200" height="200" viewBox="0 0 200 200">
                        <circle cx="100" cy="100" r="90" fill="none" stroke="#e0e0e0" strokeWidth="10" />
                        <circle
                            cx="100" cy="100" r="90" fill="none" stroke="var(--primary)" strokeWidth="10"
                            strokeDasharray="565.48"
                            strokeDashoffset={565.48 - (565.48 * progress) / 100}
                            transform="rotate(-90 100 100)"
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2.5rem', fontWeight: 'bold' }}>
                        {formatTime(time)}
                    </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button onClick={toggleTimer} className={`btn ${isActive ? 'btn-secondary' : 'btn-primary'}`} style={{ width: '120px' }}>
                        {isActive ? 'Pause' : 'Start'}
                    </button>
                    <button onClick={resetTimer} className="btn btn-secondary" style={{ width: '120px' }}>
                        Reset
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default FocusFlow;
