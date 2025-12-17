import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaClipboardCheck, FaGamepad, FaVideo, FaMusic, FaSignInAlt, FaThumbtack } from 'react-icons/fa';

const History = () => {
    const { currentUser } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = await currentUser.getIdToken();
                const res = await axios.get('http://localhost:5000/api/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setHistory(res.data);
            } catch (error) {
                console.error("Error fetching history", error);
            }
            setLoading(false);
        };
        if (currentUser) fetchHistory();
    }, [currentUser]);

    const getIcon = (type) => {
        switch (type) {
            case 'checkin': return <FaClipboardCheck />;
            case 'game': return <FaGamepad />;
            case 'video': return <FaVideo />;
            case 'music': return <FaMusic />;
            case 'login': return <FaSignInAlt />;
            default: return <FaThumbtack />;
        }
    };

    const formatDetails = (item) => {
        if (item.type === 'checkin') return `Mood: ${item.data?.mood || 'Unknown'}`;
        if (item.type === 'game') return `Played ${item.data?.game || 'a game'}`;
        if (item.type === 'login') return `Logged in via ${item.data?.method || 'Google'}`;
        return JSON.stringify(item.data);
    };

    return (
        <Layout>
            <div className="header">
                <h2>Activity History</h2>
            </div>

            <div className="card">
                {loading ? (
                    <p>Loading history...</p>
                ) : history.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No activity recorded yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {history.map((item) => (
                            <div key={item._id} style={{ display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '1.5rem', marginRight: '15px', width: '40px', textAlign: 'center' }}>
                                    {getIcon(item.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{item.type}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{formatDetails(item)}</div>
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {new Date(item.timestamp).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default History;
