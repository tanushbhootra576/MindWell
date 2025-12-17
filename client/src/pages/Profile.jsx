import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCoins, FaFire, FaTrophy, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
    const { currentUser, refreshCurrentUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setUserData(currentUser);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
            setLoading(false);
        };

        const fetchStats = async () => {
            try {
                if (!currentUser) return;
                const token = await currentUser.getIdToken();
                // Fetch history but only use for potential analytics
                await axios.get('http://localhost:5000/api/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Refresh current user to ensure streaks/badges are up to date
                if (refreshCurrentUser) await refreshCurrentUser();
            } catch (error) {
                console.error("Error fetching stats", error);
            }
        };

        if (currentUser) {
            fetchUser();
            fetchStats();
        }
    }, [currentUser, refreshCurrentUser]);

    const handleUpdate = (updatedUser) => {
        setUserData({ ...userData, ...updatedUser });
    };

    if (loading) return <Layout><div className="container fade-in" style={{ padding: '40px', textAlign: 'center' }}>Loading...</div></Layout>;

    return (
        <Layout>
            <style>{`
                .profile-header {
                    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
                    padding: 30px 20px;
                    border-radius: var(--radius-lg);
                    margin-bottom: 30px;
                    border: var(--glass-border);
                }

                .stats-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .stat-box {
                    background: var(--bg-card);
                    border: var(--glass-border);
                    border-radius: var(--radius-md);
                    padding: 20px;
                    text-align: center;
                    transition: all 0.3s ease;
                }

                .stat-box:hover {
                    transform: translateY(-5px);
                    border-color: var(--primary);
                    box-shadow: 0 10px 25px rgba(99, 102, 241, 0.15);
                }

                .stat-value {
                    font-size: 2rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                }

                .stat-label {
                    color: var(--text-muted);
                    font-size: 0.9rem;
                }

                .profile-avatar-container {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .profile-avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    color: white;
                    font-size: 3.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    overflow: hidden;
                    border: 4px solid var(--border);
                    box-shadow: 0 10px 30px rgba(99, 102, 241, 0.2);
                }

                .profile-avatar img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .profile-info {
                    text-align: center;
                }

                .profile-info h2 {
                    margin: 0 0 8px 0;
                    font-size: 1.8rem;
                }

                .profile-info p {
                    margin: 0;
                    color: var(--text-muted);
                    word-break: break-all;
                }

                @media (max-width: 900px) {
                    .profile-grid {
                        grid-template-columns: 1fr;
                    }

                    .stats-container {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .profile-avatar {
                        width: 100px;
                        height: 100px;
                        font-size: 3rem;
                    }

                    .profile-info h2 {
                        font-size: 1.5rem;
                    }
                }

                @media (max-width: 768px) {
                    .profile-header {
                        padding: 20px 15px;
                        margin-bottom: 20px;
                    }

                    .stats-container {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 15px;
                    }

                    .stat-box {
                        padding: 15px;
                    }

                    .stat-value {
                        font-size: 1.5rem;
                    }

                    .stat-label {
                        font-size: 0.8rem;
                    }

                    .card {
                        margin-bottom: 20px;
                    }

                    .profile-avatar {
                        width: 90px;
                        height: 90px;
                        font-size: 2.5rem;
                    }

                    .profile-info h2 {
                        font-size: 1.3rem;
                    }

                    .profile-info p {
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 480px) {
                    .profile-header {
                        padding: 15px 10px;
                        margin-bottom: 15px;
                        border-radius: var(--radius-md);
                    }

                    .profile-avatar {
                        width: 80px;
                        height: 80px;
                        font-size: 2rem;
                        margin: 0 auto 15px;
                    }

                    .profile-info h2 {
                        font-size: 1.1rem;
                    }

                    .profile-info p {
                        font-size: 0.8rem;
                        word-break: break-word;
                    }

                    .stats-container {
                        grid-template-columns: 1fr 1fr;
                        gap: 10px;
                    }

                    .stat-box {
                        padding: 12px;
                        border-radius: var(--radius-sm);
                    }

                    .stat-icon {
                        font-size: 1.3rem !important;
                        margin-bottom: 8px !important;
                    }

                    .stat-value {
                        font-size: 1.3rem;
                    }

                    .stat-label {
                        font-size: 0.75rem;
                    }

                    .card {
                        padding: 15px;
                        margin-bottom: 15px;
                    }

                    .card h3,
                    .card h4 {
                        font-size: 1rem;
                        margin-bottom: 10px;
                    }

                    [style*="flexWrap"] {
                        gap: 6px !important;
                    }

                    [style*="padding: 6px"] {
                        padding: 5px 10px !important;
                        font-size: 0.75rem !important;
                    }
                }
            `}</style>

            <div className="profile-header">
                <div className="profile-avatar-container">
                    <div className="profile-avatar">
                        {currentUser?.photoURL ? (
                            <img src={currentUser.photoURL} alt="Profile" />
                        ) : (
                            currentUser?.displayName?.charAt(0) || 'U'
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{currentUser?.name || currentUser?.displayName || 'User'}</h2>
                        <p>{currentUser?.email}</p>
                        {currentUser?.location && <p style={{ marginTop: '5px' }}>[Location] {currentUser.location}</p>}
                        {currentUser?.occupation && <p style={{ marginTop: '5px' }}>[Briefcase] {currentUser.occupation}</p>}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-container">
                <div className="stat-box">
                    <div className="stat-icon" style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--warning)' }}>
                        <FaCoins />
                    </div>
                    <div className="stat-value">{currentUser?.coins || 0}</div>
                    <div className="stat-label">Total Coins</div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--danger)' }}>
                        <FaFire />
                    </div>
                    <div className="stat-value">{currentUser?.streaks?.current || 0}</div>
                    <div className="stat-label">Current Streak</div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--primary)' }}>
                        <FaTrophy />
                    </div>
                    <div className="stat-value">{currentUser?.streaks?.longest || 0}</div>
                    <div className="stat-label">Longest Streak</div>
                </div>

                <div className="stat-box">
                    <div className="stat-icon" style={{ fontSize: '1.8rem', marginBottom: '10px', color: 'var(--secondary)' }}>
                        <FaCheckCircle />
                    </div>
                    <div className="stat-value">{currentUser?.badges?.length || 0}</div>
                    <div className="stat-label">Badges Earned</div>
                </div>
            </div>

            {/* Badges Collection */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <h3>Badges Collection</h3>
                {currentUser?.badges?.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '15px' }}>
                        {currentUser.badges.map((badge, index) => (
                            <div key={index} className="badge-item" style={{ textAlign: 'center', padding: '15px', background: 'var(--bg-main)', borderRadius: '12px', border: '1px solid var(--border)', transition: 'transform 0.2s' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{badge.icon || '[Badge]'}</div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '5px' }}>{badge.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(badge.dateEarned).toLocaleDateString()}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '10px', opacity: 0.5 }}>[Shield]</div>
                        <p>No badges earned yet. Keep checking in and completing tasks to unlock them!</p>
                    </div>
                )}
            </div>

            {/* Bio Section */}
            {currentUser?.bio && (
                <div className="card" style={{ marginBottom: '30px' }}>
                    <h3>About Me</h3>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{currentUser.bio}</p>
                </div>
            )}

            {/* Goals & Focus Areas */}
            {(currentUser?.goals?.length || currentUser?.mentalHealthFocus?.length || currentUser?.healthInterests?.length || currentUser?.contentPreferences?.length) && (
                <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    {currentUser?.goals?.length > 0 && (
                        <div className="card">
                            <h4 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Wellness Goals</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {currentUser.goals.map(goal => (
                                    <span key={goal} style={{
                                        background: 'var(--primary)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {goal}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentUser?.mentalHealthFocus?.length > 0 && (
                        <div className="card">
                            <h4 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Mental Health Focus</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {currentUser.mentalHealthFocus.map(focus => (
                                    <span key={focus} style={{
                                        background: 'var(--secondary)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {focus}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentUser?.healthInterests?.length > 0 && (
                        <div className="card">
                            <h4 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Health Interests</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {currentUser.healthInterests.map(interest => (
                                    <span key={interest} style={{
                                        background: 'var(--accent)',
                                        color: 'white',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem'
                                    }}>
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentUser?.contentPreferences?.length > 0 && (
                        <div className="card">
                            <h4 style={{ color: 'var(--primary)', marginBottom: '12px' }}>Content Preferences</h4>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {currentUser.contentPreferences.map(pref => (
                                    <span key={pref} style={{
                                        background: 'rgba(99, 102, 241, 0.3)',
                                        color: 'var(--primary)',
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.85rem',
                                        border: '1px solid var(--primary)'
                                    }}>
                                        {pref}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Edit Profile Form */}
            <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
                <div>
                    <ProfileForm user={userData} onUpdate={handleUpdate} />
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
