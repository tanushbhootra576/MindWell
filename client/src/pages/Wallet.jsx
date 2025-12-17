import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCoins } from 'react-icons/fa';

const Wallet = () => {
    const { currentUser } = useAuth();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEntries = async () => {
            if (!currentUser) return;
            setLoading(true);
            try {
                console.log('Wallet - fetching history for', currentUser.uid);
                const token = await currentUser.getIdToken();
                const res = await axios.get('http://localhost:5000/api/history', { headers: { Authorization: `Bearer ${token}` } });
                // Keep reward/checkin related items for wallet
                const walletItems = res.data.filter(h => ['reward', 'checkin'].includes(h.type)).map(h => ({
                    id: h._id,
                    type: h.type,
                    coins: h.data?.coins || (h.type === 'checkin' ? 5 : 0),
                    mood: h.data?.mood || '',
                    text: h.data?.text || h.data?.reason || '',
                    date: h.timestamp || h.createdAt
                }));
                setEntries(walletItems);
            } catch (error) {
                console.error('Wallet - Error fetching history', error);
            }
            setLoading(false);
        };
        fetchEntries();
    }, [currentUser?.uid]);

    const getMoodColor = (mood) => {
        switch (mood) {
            case 'Happy': return '#FFD700';
            case 'Calm': return '#A8DADC';
            case 'Anxious': return '#F4A261';
            case 'Sad': return '#457B9D';
            case 'Stressed': return '#E76F51';
            default: return '#E0E0E0';
        }
    };

    return (
        <Layout>
            <div className="header">
                <h2>Check-in Wallet</h2>
            </div>
            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <h3 style={{ margin: 0 }}>Balance:</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem' }}>
                    <strong>{currentUser?.coins || 0}</strong>
                    <FaCoins />
                </div>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {entries.length === 0 ? (
                        <div className="card">No wallet activity yet.</div>
                    ) : entries.map(entry => (
                        <div key={entry.id} className="card" style={{ borderTop: `6px solid ${getMoodColor(entry.mood)}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{entry.type === 'reward' ? 'Reward' : (entry.mood || 'Check-in')}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                            <p style={{ color: 'var(--text-main)', marginBottom: '15px' }}>{entry.text}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                <span>Coins: {entry.coins}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>{entry.coins} <FaCoins /></span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Layout>
    );
};

export default Wallet;
