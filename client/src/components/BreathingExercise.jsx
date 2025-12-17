import React, { useState, useEffect } from 'react';
import Layout from './Layout';
import { FaLungs } from 'react-icons/fa';

const BreathingExercise = () => {
    const [phase, setPhase] = useState('Inhale'); // Inhale, Hold, Exhale
    const [timer, setTimer] = useState(4);
    const [active, setActive] = useState(false);

    useEffect(() => {
        let interval;
        if (active) {
            interval = setInterval(() => {
                setTimer((prev) => {
                    if (prev === 1) {
                        handlePhaseChange();
                        return getNextDuration();
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [active, phase]);

    const handlePhaseChange = () => {
        if (phase === 'Inhale') setPhase('Hold');
        else if (phase === 'Hold') setPhase('Exhale');
        else if (phase === 'Exhale') setPhase('Inhale');
    };

    const getNextDuration = () => {
        if (phase === 'Inhale') return 7; // Next is Hold (7s)
        if (phase === 'Hold') return 8;   // Next is Exhale (8s)
        if (phase === 'Exhale') return 4; // Next is Inhale (4s)
        return 4;
    };

    const getCircleSize = () => {
        if (phase === 'Inhale') return 'scale(1.5)';
        if (phase === 'Hold') return 'scale(1.5)';
        return 'scale(1)';
    };

    const getInstruction = () => {
        if (phase === 'Inhale') return "Breathe In...";
        if (phase === 'Hold') return "Hold...";
        return "Breathe Out...";
    };

    return (
        <Layout>
            <div className="container fade-in" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <h2 style={{ marginBottom: '20px' }}>4-7-8 Breathing</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px' }}>
                    A simple technique to reduce anxiety and help you sleep.
                </p>

                <div style={{
                    position: 'relative',
                    width: '300px',
                    height: '300px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    {/* Outer Circle (Guide) */}
                    <div style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        border: '2px dashed var(--text-muted)',
                        opacity: 0.3
                    }}></div>

                    {/* Animated Circle */}
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #A8DADC 0%, #457B9D 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        boxShadow: '0 0 30px rgba(168, 218, 220, 0.5)',
                        transform: active ? getCircleSize() : 'scale(1)',
                        transition: active ? `transform ${phase === 'Inhale' ? '4s' : phase === 'Exhale' ? '8s' : '0s'} ease-in-out` : 'none'
                    }}>
                        {active ? timer : <FaLungs size={40} />}
                    </div>
                </div>

                <h3 style={{ marginTop: '40px', fontSize: '2rem', minHeight: '3rem' }}>
                    {active ? getInstruction() : "Ready?"}
                </h3>

                <button
                    className="btn btn-primary"
                    onClick={() => {
                        setActive(!active);
                        setPhase('Inhale');
                        setTimer(4);
                    }}
                    style={{ marginTop: '20px', padding: '15px 40px', fontSize: '1.2rem' }}
                >
                    {active ? "Stop" : "Start Breathing"}
                </button>
            </div>
        </Layout>
    );
};

export default BreathingExercise;
