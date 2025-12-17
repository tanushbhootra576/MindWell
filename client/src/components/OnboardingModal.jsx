import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

const OnboardingModal = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        ageRange: '',
        sleepPattern: '',
        stressLevel: '',
        preferences: [],
        goals: []
    });

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const togglePreference = (pref) => {
        setFormData(prev => {
            const prefs = prev.preferences.includes(pref)
                ? prev.preferences.filter(p => p !== pref)
                : [...prev.preferences, pref];
            return { ...prev, preferences: prefs };
        });
    };

    const toggleGoal = (goal) => {
        setFormData(prev => {
            const goals = prev.goals.includes(goal)
                ? prev.goals.filter(g => g !== goal)
                : [...prev.goals, goal];
            return { ...prev, goals: goals };
        });
    };

    const handleSubmit = async () => {
        try {
            const token = await auth.currentUser.getIdToken();
            await axios.put('http://localhost:5000/api/auth/profile', {
                ...formData,
                onboardingCompleted: true
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            window.location.reload();
        } catch (error) {
            console.error("Error saving onboarding data", error);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome to MindWell</h2>

                {step === 1 && (
                    <div className="fade-in">
                        <h3>Tell us about yourself</h3>
                        <div className="input-group">
                            <label>Age Range</label>
                            <select value={formData.ageRange} onChange={(e) => handleChange('ageRange', e.target.value)}>
                                <option value="">Select Age Range</option>
                                <option value="18-24">18-24</option>
                                <option value="25-34">25-34</option>
                                <option value="35-44">35-44</option>
                                <option value="45+">45+</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>How is your sleep?</label>
                            <select value={formData.sleepPattern} onChange={(e) => handleChange('sleepPattern', e.target.value)}>
                                <option value="">Select Sleep Pattern</option>
                                <option value="Good">Good (7-8 hours)</option>
                                <option value="Average">Average (5-6 hours)</option>
                                <option value="Poor">Poor (Less than 5 hours)</option>
                            </select>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setStep(2)}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div className="fade-in">
                        <h3>Your Goals</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '15px' }}>What do you want to achieve?</p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                            {['Sleep Better', 'Reduce Stress', 'Improve Focus', 'Emotional Balance', 'Boost Productivity'].map(goal => (
                                <button
                                    key={goal}
                                    onClick={() => toggleGoal(goal)}
                                    className={`btn ${formData.goals.includes(goal) ? 'btn-primary' : 'btn-secondary'}`}
                                    style={{ fontSize: '0.9rem', padding: '10px 15px' }}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>Back</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Next</button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="fade-in">
                        <h3>Your Mental Wellness</h3>
                        <div className="input-group">
                            <label>Current Stress Level</label>
                            <select value={formData.stressLevel} onChange={(e) => handleChange('stressLevel', e.target.value)}>
                                <option value="">Select Stress Level</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>What helps you relax? (Select multiple)</label>
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                {['Meditation', 'Music', 'Reading', 'Gaming', 'Exercise'].map(pref => (
                                    <button
                                        key={pref}
                                        onClick={() => togglePreference(pref)}
                                        className={`btn ${formData.preferences.includes(pref) ? 'btn-primary' : 'btn-secondary'}`}
                                        style={{ fontSize: '0.8rem', padding: '8px 12px' }}
                                    >
                                        {pref}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>Back</button>
                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>Complete</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OnboardingModal;
