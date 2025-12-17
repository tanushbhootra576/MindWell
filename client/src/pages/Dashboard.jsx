import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import OnboardingModal from '../components/OnboardingModal';
import MoodModal from '../components/MoodModal';
import AffirmationWidget from '../components/AffirmationWidget';
import MediaPlayer from '../components/MediaPlayer';
import TaskList from '../components/TaskList';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaBrain, FaSpa, FaWind, FaClock, FaStore, FaCoins, FaFilm, FaGamepad, FaYinYang, FaLightbulb, FaCheckCircle, FaFire } from 'react-icons/fa';

const Dashboard = () => {
    const { currentUser, refreshCurrentUser } = useAuth();
    const [mood, setMood] = useState('');
    const [journalText, setJournalText] = useState('');
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);


    // Flow State
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showMoodModal, setShowMoodModal] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState(null);

    // Fetch Entries
    const fetchEntries = async () => {
        if (!currentUser) return;
        try {
            console.log('Dashboard - fetchEntries for', currentUser.uid);
            const token = await currentUser.getIdToken();
            const res = await axios.get('http://localhost:5000/api/entries', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEntries(res.data);
        } catch (error) {
            console.error("Dashboard - Error fetching entries", error);
        }
    };

    useEffect(() => {
        if (!currentUser) return;

        console.log('Dashboard useEffect - currentUser present:', !!currentUser, 'onboarding.completed:', currentUser.onboarding?.completed, 'streaks:', !!currentUser.streaks);
        fetchEntries();

        // 1. Check Profile Completion
        if (!currentUser.onboarding?.completed) {
            setShowOnboarding(true);
            setShowMoodModal(false);
            return;
        }

        // 2. Check Daily Check-in
        const hasStreaks = !!currentUser.streaks;
        const lastCheckInRaw = currentUser.streaks?.lastCheckInDate;
        console.log('Dashboard checkin debug - hasStreaks:', hasStreaks, 'lastCheckInRaw:', lastCheckInRaw);
        if (!hasStreaks || !lastCheckInRaw) {
            console.log('Dashboard - showing mood modal because no streaks or lastCheckIn');
            setShowMoodModal(true);
        } else {
            const lastCheckIn = new Date(lastCheckInRaw);
            const today = new Date();
            if (isNaN(lastCheckIn.getTime())) {
                console.log('Dashboard - showing mood modal because lastCheckIn invalid');
                setShowMoodModal(true);
            } else {
                const isSameDay = lastCheckIn.getDate() === today.getDate() &&
                    lastCheckIn.getMonth() === today.getMonth() &&
                    lastCheckIn.getFullYear() === today.getFullYear();
                console.log('Dashboard - lastCheckIn isSameDay?', isSameDay);
                if (!isSameDay) {
                    console.log('Dashboard - showing mood modal because last check-in not today');
                    setShowMoodModal(true);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    const handleOnboardingComplete = () => {
        setShowOnboarding(false);
        setShowMoodModal(true); // Proceed to mood check-in
    };

    const handleMoodSelect = (selectedMood) => {
        setMood(selectedMood);
        setShowMoodModal(false);
        generateSuggestions(selectedMood);
    };

    const generateSuggestions = async (currentMood) => {
        const toastId = toast.loading('Generating personalized plan...');
        try {
            const token = await currentUser.getIdToken();

            // Parallel fetch for recommendations and AI quote
            const [recRes, aiRes] = await Promise.allSettled([
                axios.get(`http://localhost:5000/api/recommendations?mood=${currentMood}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.post('http://localhost:5000/api/ai/chat', {
                    message: `Give me a short, inspiring quote for someone feeling ${currentMood}. Just the quote.`
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const recommendations = recRes.status === 'fulfilled' ? recRes.value.data : [];
            const aiQuote = aiRes.status === 'fulfilled' ? aiRes.value.data.reply : null;

            const videos = recommendations.filter(i => i.type === 'video');
            const music = recommendations.filter(i => i.type === 'music' || i.type === 'track');
            const activities = recommendations.filter(i => i.type === 'activity');

            // Fallback content
            const staticContent = {
                'Happy': { video: "https://www.youtube.com/watch?v=ZbZSe6N_BXs", quote: "Happiness is not something ready made. It comes from your own actions." },
                'Calm': { video: "https://www.youtube.com/watch?v=1ZYbU82GVz4", quote: "Calmness is the cradle of power." },
                'Anxious': { video: "https://www.youtube.com/watch?v=O-6f5wQXSu8", quote: "You don't have to control your thoughts. You just have to stop letting them control you." },
                'Sad': { video: "https://www.youtube.com/watch?v=lFcSrYw-ARY", quote: "Tough times never last, but tough people do." },
                'Stressed': { video: "https://www.youtube.com/watch?v=hnpQrKuUEQQ", quote: "It's not stress that kills us, it is our reaction to it." }
            };
            const fallback = staticContent[currentMood] || staticContent['Calm'];

            setSuggestions({
                quote: aiQuote || fallback.quote,
                video: videos.length > 0 ? videos[0] : { url: fallback.video, title: 'Recommended Video' },
                music: music.length > 0 ? music[0] : null,
                activity: activities.length > 0 ? activities[0] : { title: 'Breathe', description: 'Take a deep breath.' },
                game: { name: 'Zen Mode', path: '/zen', icon: <FaSpa /> }
            });

            setShowSuggestions(true);
            toast.dismiss(toastId);
        } catch (error) {
            console.error("Error generating suggestions", error);
            toast.error("Could not generate plan", { id: toastId });
        }
    };

    const getJournalPrompt = async () => {
        const toastId = toast.loading('Thinking of a prompt...');
        try {
            const token = await currentUser.getIdToken();
            const res = await axios.post('http://localhost:5000/api/ai/chat', {
                message: `Give me a short, unique journaling prompt for someone feeling ${mood || 'neutral'}. Focus on deep emotional reflection and somatic awareness (feelings in the body). Just the prompt text, no intro or quotes.`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const prompt = res.data.reply.replace(/^["']|["']$/g, ''); // Clean quotes
            setJournalText(prev => prev ? prev + "\n\n" + prompt : prompt);
            toast.dismiss(toastId);
        } catch (error) {
            console.error("Error getting prompt", error);
            toast.dismiss(toastId);
            // Fallback to static
            const prompts = [
                "Close your eyes for a moment. What physical sensations do you notice in your body right now?",
                "If your current mood was a landscape, what would it look like? Describe the weather and terrain.",
                "What is the strongest emotion you are feeling right now, and what is it trying to tell you?",
                "Describe a recent moment where you felt truly connected to yourself.",
                "What does your inner self need most right now?"
            ];
            const random = prompts[Math.floor(Math.random() * prompts.length)];
            setJournalText(prev => prev ? prev + "\n\n" + random : random);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!mood) {
                // require mood selection before saving
                setShowMoodModal(true);
                toast.error('Please select your mood before saving.');
                setLoading(false);
                return;
            }
            console.log('Dashboard - submitting entry', { mood, journalTextLength: journalText.length });
            // Save entry to backend
            const token = await currentUser.getIdToken();
            await axios.post('http://localhost:5000/api/entries', { mood, journalText }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Refresh entries from backend
            await fetchEntries();

            // Check and award badges
            try {
                await axios.post('http://localhost:5000/api/badges/check-and-award', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                console.error('Dashboard - Error checking badges:', error);
            }

            // Refresh user profile so coins/streaks/badges update in UI
            if (refreshCurrentUser) await refreshCurrentUser();

            setJournalText('');
            toast.success("Check-in saved!");
            console.log('Dashboard - entry saved successfully');
        } catch (error) {
            console.error("Dashboard - Error submitting entry", error, error?.response?.data);
            toast.error("Failed to save entry.");
        }
        setLoading(false);
    };

    return (
        <Layout>
            {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
            {showMoodModal && <MoodModal onSelect={handleMoodSelect} onClose={() => setShowMoodModal(false)} />}

            {/* Immediate Suggestions Modal/Overlay */}
            {showSuggestions && suggestions && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card fade-in" style={{ width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto', position: 'relative', background: 'var(--bg-card)', border: 'var(--glass-border)' }}>
                        <button
                            onClick={() => setShowSuggestions(false)}
                            style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-main)' }}
                        >
                            &times;
                        </button>

                        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Your Wellness Plan</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '20px' }}>Based on your mood: <strong>{mood}</strong></p>

                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', marginBottom: '20px', fontStyle: 'italic', textAlign: 'center' }}>
                            "{suggestions.quote}"
                        </div>

                        {/* Video Section */}
                        {suggestions.video && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4>Recommended Video</h4>
                                <MediaPlayer
                                    url={suggestions.video.url || suggestions.video}
                                    type="video"
                                    title={suggestions.video.title || "Recommended for you"}
                                />
                            </div>
                        )}

                        {/* Music Section */}
                        {suggestions.music && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4>Recommended Music</h4>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                                    {suggestions.music.thumbnail && <img src={suggestions.music.thumbnail} alt="Album Art" style={{ width: '50px', height: '50px', borderRadius: '4px' }} />}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold' }}>{suggestions.music.title}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{suggestions.music.artist}</div>
                                    </div>
                                    <a href={suggestions.music.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                                        Listen
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Activity Section */}
                        {suggestions.activity && (
                            <div style={{ marginBottom: '20px' }}>
                                <h4>Suggested Activity</h4>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{suggestions.activity.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{suggestions.activity.description}</div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                            <span style={{ fontSize: '2rem' }}>{suggestions.game.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 'bold' }}>Play {suggestions.game.name}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Quick relief activity</div>
                            </div>
                            <Link to={suggestions.game.path} className="btn btn-primary" onClick={() => setShowSuggestions(false)}>
                                Play Now
                            </Link>
                        </div>

                        <div style={{ marginTop: '20px', textAlign: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => setShowSuggestions(false)}>Continue to Dashboard</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="header" style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Welcome, {currentUser?.displayName || 'User'}
                    </h2>
                    <span style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            <style>{`
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 2fr 1fr;
                    gap: 30px;
                }
                @media (max-width: 900px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .entry-item {
                    background: rgba(255,255,255,0.03);
                    border-radius: var(--radius-sm);
                    padding: 15px;
                    margin-bottom: 10px;
                    border-left: 4px solid var(--primary);
                }
            `}</style>

            <div className="dashboard-grid">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h3>Daily Journal</h3>
                            <button
                                type="button"
                                onClick={getJournalPrompt}
                                className="btn btn-secondary"
                                style={{ fontSize: '0.8rem', padding: '5px 10px' }}
                            >
                                <FaLightbulb /> Prompt Me
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Current Mood</label>
                                <input
                                    type="text"
                                    value={mood}
                                    readOnly
                                    placeholder="Select from check-in..."
                                    style={{ background: 'rgba(255,255,255,0.05)', cursor: 'not-allowed' }}
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Write your thoughts...</label>
                                <textarea
                                    value={journalText}
                                    onChange={(e) => setJournalText(e.target.value)}
                                    rows="4"
                                    placeholder="How are you feeling right now?"
                                    style={{ resize: 'vertical' }}
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={loading || !journalText} style={{ width: '100%' }}>
                                {loading ? 'Saving...' : 'Save Entry'}
                            </button>
                        </form>
                    </div>

                    <div style={{ height: '400px' }}>
                        <TaskList />
                    </div>

                    <div className="card">
                        <h3>Recent Entries</h3>
                        {entries.length === 0 ? (
                            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No entries yet. Start journaling!</p>
                        ) : (
                            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
                                {entries.map((entry) => (
                                    <div key={entry._id} className="entry-item">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 'bold', color: 'var(--accent)' }}>{entry.mood}</span>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {new Date(entry.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>{entry.journalText}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Check-in Card */}
                    <div
                        className="card"
                        onClick={() => setShowMoodModal(true)}
                        style={{
                            background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                            color: '#fff',
                            cursor: 'pointer',
                            transition: 'transform 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>Daily Check-in</h3>
                                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Track your mood now</p>
                            </div>
                            <div style={{ fontSize: '2.5rem' }}>
                                <FaCheckCircle />
                            </div>
                        </div>
                    </div>

                    {/* Wallet / Store Card */}
                    <Link to="/wallet" style={{ textDecoration: 'none' }}>
                        <div
                            className="card"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255, 191, 0, 1) 0%, #FFA500 100%)',
                                color: '#fff',
                                transition: 'transform 0.2s'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.4rem', color: '#fff' }}>My Wallet</h3>
                                    <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Redeem rewards</p>
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FaCoins /> {currentUser?.coins || 0}
                                </div>
                            </div>
                        </div>
                    </Link>

                    <div className="card" style={{ background: 'linear-gradient(135deg, #E76F51 0%, #F4A261 100%)', color: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#fff' }}>Current Streak</h3>
                                <p style={{ margin: '5px 0 0 0', opacity: 0.9 }}>Keep the momentum!</p>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FaFire /> {currentUser?.streaks?.currentStreak || 0}
                            </div>
                        </div>
                    </div>

                    <div>
                        <AffirmationWidget />
                    </div>

                    <div className="card" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><FaCheckCircle style={{ color: '#4CAF50' }} /> Daily Challenge</h3>
                        <p style={{ margin: '10px 0', fontSize: '1.1rem' }}>Drink a glass of water and take 3 deep breaths.</p>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }} onClick={async () => {
                            try {
                                console.log('Dashboard - Daily Challenge complete: awarding 5 coins');
                                const token = await currentUser.getIdToken();
                                const res = await axios.post('http://localhost:5000/api/rewards/add', { coins: 5, reason: 'daily_challenge' }, { headers: { Authorization: `Bearer ${token}` } });
                                const awarded = res.data?.awarded ?? 0;
                                if (awarded > 0) {
                                    if (awarded >= 5) {
                                        toast.success(`Woohoo! You earned +${awarded} coins [Celebration]`);
                                    } else {
                                        toast.success(`Nice! You got ${awarded} coin${awarded > 1 ? 's' : ''} [Sparkle]`);
                                    }
                                    if (typeof refreshCurrentUser === 'function') await refreshCurrentUser();
                                } else {
                                    // No coins awarded but request succeeded
                                    toast('All good! No more coins available right now [Water]');
                                }
                            } catch (err) {
                                console.error('Dashboard - reward error', err, err?.response?.data);
                                if (err?.response?.status === 400 && err?.response?.data?.message === 'daily cap reached') {
                                    toast('Aw, you\'ve already claimed today\'s water bonus! Come back tomorrow [Water]');
                                } else {
                                    toast.error('Oops — could not award coins right now. Try again later [Broken Heart]');
                                }
                            }
                        }}>
                            Mark Complete
                        </button>
                    </div>

                    <div className="card">
                        <h3>Quick Links</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link to="/tools/pomodoro" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                                <FaClock /> Focus Timer
                            </Link>
                            <Link to="/crisis" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px', color: '#E76F51', borderColor: '#E76F51' }}>
                                <FaBrain /> Crisis Support
                            </Link>
                            <Link to="/recommendations" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                                <FaFilm /> Movies & Music
                            </Link>
                            <Link to="/games" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                                <FaGamepad /> All Games
                            </Link>
                            <Link to="/zen" className="btn btn-secondary" style={{ justifyContent: 'flex-start', gap: '10px' }}>
                                <FaYinYang /> Zen Mode
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
