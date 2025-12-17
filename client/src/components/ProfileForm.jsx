import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaCheck } from 'react-icons/fa';

const ProfileForm = ({ user, onUpdate, isInitialSetup = false }) => {
    const [name, setName] = useState(user?.name || '');
    const [age, setAge] = useState(user?.age || '');
    const [gender, setGender] = useState(user?.gender || '');
    const [location, setLocation] = useState(user?.location || '');
    const [occupation, setOccupation] = useState(user?.occupation || '');
    const [language, setLanguage] = useState(user?.language || 'en');
    const [bio, setBio] = useState(user?.bio || '');
    const [goals, setGoals] = useState(user?.goals || []);
    const [healthInterests, setHealthInterests] = useState(user?.healthInterests || []);
    const [mentalHealthFocus, setMentalHealthFocus] = useState(user?.mentalHealthFocus || []);
    const [contentPreferences, setContentPreferences] = useState(user?.contentPreferences || []);
    const [reminderTime, setReminderTime] = useState(user?.reminderSettings?.checkInTime || '09:00');
    const [reminderFrequency, setReminderFrequency] = useState(user?.reminderSettings?.frequency || 'daily');
    const [emailEnabled, setEmailEnabled] = useState(user?.reminderSettings?.emailNotifications || false);
    const [textSize, setTextSize] = useState(user?.accessibility?.textSize || 'medium');
    const [loading, setLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const { currentUser, logout, refreshCurrentUser } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate required fields for initial setup
        if (isInitialSetup && (!name.trim() || !age || !gender || !mentalHealthFocus.length)) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            // Get token from currentUser or from Firebase auth
            let token;
            if (currentUser?.getIdToken) {
                token = await currentUser.getIdToken();
            } else {
                const firebaseUser = currentUser?._firebaseUser;
                if (firebaseUser) {
                    token = await firebaseUser.getIdToken();
                }
            }

            console.log('ProfileForm - token obtained:', !!token);

            const res = await axios.put('http://localhost:5000/api/auth/profile', {
                firebaseUid: currentUser.uid,
                name,
                age: parseInt(age),
                gender,
                location,
                occupation,
                language,
                bio,
                goals,
                healthInterests,
                mentalHealthFocus,
                contentPreferences,
                reminderSettings: {
                    checkInTime: reminderTime,
                    frequency: reminderFrequency,
                    emailNotifications: emailEnabled
                },
                accessibility: {
                    textSize
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('ProfileForm - update response OK', res.data);
            onUpdate(res.data);

            // Refresh auth context to update profile completion status
            if (isInitialSetup) {
                console.log('ProfileForm - calling refreshCurrentUser');
                const updated = await refreshCurrentUser();
                console.log('ProfileForm - refreshCurrentUser returned:', updated);
                toast.success('Profile setup complete! Welcome to MindWell!');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1500);
            } else {
                toast.success('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile.');
        }
        setLoading(false);
    };

    const toggleGoal = (goal) => {
        setGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const toggleHealthInterest = (interest) => {
        setHealthInterests(prev =>
            prev.includes(interest) ? prev.filter(h => h !== interest) : [...prev, interest]
        );
    };

    const toggleMentalHealthFocus = (focus) => {
        setMentalHealthFocus(prev =>
            prev.includes(focus) ? prev.filter(f => f !== focus) : [...prev, focus]
        );
    };

    const toggleContentPreference = (pref) => {
        setContentPreferences(prev =>
            prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
        );
    };

    // Delete profile handler
    const handleDeleteProfile = async () => {
        if (!window.confirm('Are you sure you want to delete your profile? This action cannot be undone. All your data will be permanently deleted.')) {
            return;
        }

        setDeleting(true);
        try {
            const token = currentUser && (await currentUser.getIdToken());
            console.log('Deleting profile for user:', currentUser.uid);

            await axios.delete('http://localhost:5000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success('Profile deleted successfully. Logging out...');

            // Log out the user after successful deletion
            setTimeout(async () => {
                try {
                    await logout();
                    window.location.href = '/login';
                } catch (logoutError) {
                    console.error('Error during logout:', logoutError);
                    window.location.href = '/login';
                }
            }, 1500);
        } catch (error) {
            console.error('Error deleting profile:', error);
            toast.error('Failed to delete profile. Please try again.');
            setDeleting(false);
        }
    };

    const goalOptions = ['Sleep Better', 'Reduce Stress', 'Improve Focus', 'Emotional Balance', 'Boost Productivity', 'Build Confidence', 'Better Relationships'];
    const healthOptions = ['Meditation', 'Exercise', 'Nutrition', 'Sleep Hygiene', 'Yoga', 'Mental Health Awareness', 'Therapy Resources'];
    const mentalHealthOptions = ['Anxiety', 'Depression', 'Stress Management', 'Work-life Balance', 'Self-esteem', 'Grief Support', 'Mindfulness', 'Motivation'];
    const contentOptions = ['Music', 'Videos', 'Books', 'Games', 'Articles', 'Podcasts'];

    return (
        <div className="card">
            <style>{`
                @media (max-width: 768px) {
                    .profile-form-section {
                        margin-bottom: 20px;
                    }

                    .profile-form-section h4 {
                        font-size: 1.1rem;
                    }

                    .form-button-group {
                        gap: 8px;
                    }

                    .form-button-group button {
                        font-size: 0.8rem;
                        padding: 7px 12px;
                    }

                    .reminder-flex {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .reminder-grid {
                        grid-template-columns: 1fr !important;
                    }
                }

                @media (max-width: 480px) {
                    .profile-form-section {
                        margin-bottom: 15px;
                    }

                    .profile-form-section h4 {
                        font-size: 1rem;
                        margin-bottom: 10px;
                    }

                    .form-button-group {
                        gap: 6px;
                    }

                    .form-button-group button {
                        font-size: 0.75rem;
                        padding: 6px 10px;
                    }

                    .form-button-group button svg {
                        font-size: 0.6rem !important;
                    }

                    .reminder-flex {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .reminder-grid {
                        grid-template-columns: 1fr !important;
                    }

                    .reminder-grid > div {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .reminder-grid label {
                        min-width: 100%;
                    }

                    .reminder-grid input,
                    .reminder-grid select {
                        width: 100%;
                    }

                    .profile-form-section input,
                    .profile-form-section textarea,
                    .profile-form-section select {
                        font-size: 16px;
                    }

                    .profile-form-section .input-group {
                        margin-bottom: 12px;
                    }
                }
            `}</style>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>{isInitialSetup ? 'Complete Your Profile' : 'Edit Profile'}</h3>
                {isInitialSetup && <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>(Required to continue)</span>}
            </div>

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div style={{ marginBottom: '30px' }} className="profile-form-section">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Basic Information <span style={{ color: 'var(--danger)' }}>*</span></h4>

                    <div className="input-group">
                        <label>Full Name <span style={{ color: 'var(--danger)' }}>*</span></label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Full Name"
                            required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                        <div className="input-group">
                            <label>Age <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="Your Age"
                                min="13"
                                max="120"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Gender <span style={{ color: 'var(--danger)' }}>*</span></label>
                            <select value={gender} onChange={(e) => setGender(e.target.value)} required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="non-binary">Non-binary</option>
                                <option value="prefer-not-to-say">Prefer Not to Say</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="grid-2">
                        <div className="input-group">
                            <label>Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="City, Country"
                            />
                        </div>
                        <div className="input-group">
                            <label>Occupation</label>
                            <input
                                type="text"
                                value={occupation}
                                onChange={(e) => setOccupation(e.target.value)}
                                placeholder="Your Job or Role"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Language Preference</label>
                        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Bio / About You</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself, your interests, and what brings you to MindWell..."
                            rows="3"
                        />
                    </div>
                </div>

                {/* Wellness Goals */}
                <div style={{ marginBottom: '30px' }} className="profile-form-section">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Wellness Goals</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>Select what you want to achieve:</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className="form-button-group">
                        {goalOptions.map(goal => (
                            <button
                                key={goal}
                                type="button"
                                onClick={() => toggleGoal(goal)}
                                className={`btn ${goals.includes(goal) ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: '0.85rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                {goals.includes(goal) && <FaCheck style={{ fontSize: '0.7rem' }} />}
                                {goal}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mental Health Focus */}
                <div style={{ marginBottom: '30px' }} className="profile-form-section">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Mental Health Focus Areas <span style={{ color: 'var(--danger)' }}>*</span></h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>What would you like to focus on? (Select at least one):</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className="form-button-group">
                        {mentalHealthOptions.map(focus => (
                            <button
                                key={focus}
                                type="button"
                                onClick={() => toggleMentalHealthFocus(focus)}
                                className={`btn ${mentalHealthFocus.includes(focus) ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: '0.85rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                {mentalHealthFocus.includes(focus) && <FaCheck style={{ fontSize: '0.7rem' }} />}
                                {focus}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Health Interests */}
                <div style={{ marginBottom: '30px' }} className="profile-form-section">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Health Interests</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>What areas of health interest you:</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className="form-button-group">
                        {healthOptions.map(interest => (
                            <button
                                key={interest}
                                type="button"
                                onClick={() => toggleHealthInterest(interest)}
                                className={`btn ${healthInterests.includes(interest) ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: '0.85rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                {healthInterests.includes(interest) && <FaCheck style={{ fontSize: '0.7rem' }} />}
                                {interest}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Preferences */}
                <div style={{ marginBottom: '30px' }} className="profile-form-section">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Content Preferences</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>What type of content do you prefer:</p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} className="form-button-group">
                        {contentOptions.map(pref => (
                            <button
                                key={pref}
                                type="button"
                                onClick={() => toggleContentPreference(pref)}
                                className={`btn ${contentPreferences.includes(pref) ? 'btn-primary' : 'btn-secondary'}`}
                                style={{ fontSize: '0.85rem', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                {contentPreferences.includes(pref) && <FaCheck style={{ fontSize: '0.7rem' }} />}
                                {pref}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reminder Settings */}
                <div style={{ marginBottom: '30px' }} className="profile-form-section">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Daily Reminders</h4>
                    <div style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '15px' }} className="reminder-flex">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="emailNotif"
                                    checked={emailEnabled}
                                    onChange={(e) => setEmailEnabled(e.target.checked)}
                                    style={{ width: 'auto' }}
                                />
                                <label htmlFor="emailNotif" style={{ margin: 0, fontWeight: 'normal' }}>Enable Email Reminders</label>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }} className="reminder-grid grid-2">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label htmlFor="time" style={{ margin: 0, fontWeight: 'normal', minWidth: '60px' }}>Check-in Time:</label>
                                <input
                                    type="time"
                                    id="time"
                                    value={reminderTime}
                                    onChange={(e) => setReminderTime(e.target.value)}
                                    style={{ padding: '5px', borderRadius: '4px', border: '1px solid var(--border)', background: 'var(--bg-main)', color: 'var(--text-main)' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label htmlFor="frequency" style={{ margin: 0, fontWeight: 'normal', minWidth: '60px' }}>Frequency:</label>
                                <select
                                    id="frequency"
                                    value={reminderFrequency}
                                    onChange={(e) => setReminderFrequency(e.target.value)}
                                    style={{ flex: 1 }}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="never">Never</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Accessibility Settings */}
                <div style={{ marginBottom: '30px' }} className="profile-form-section">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>Text Size</h4>
                    <div className="input-group">
                        <label>Text Size Preference</label>
                        <select value={textSize} onChange={(e) => setTextSize(e.target.value)}>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="extra-large">Extra Large</option>
                        </select>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '12px', fontSize: '1rem' }}>
                    {loading ? 'Saving...' : isInitialSetup ? 'Complete Setup' : 'Save Changes'}
                </button>
            </form>

            {!isInitialSetup && (
                <>
                    <hr style={{ margin: '30px 0' }} />
                    <button
                        className="btn btn-danger"
                        style={{ width: '100%' }}
                        onClick={handleDeleteProfile}
                        disabled={deleting}
                    >
                        {deleting ? 'Deleting...' : 'Delete Profile'}
                    </button>
                </>
            )}
        </div>
    );
};

export default ProfileForm;
