import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { FaStore, FaGift, FaPalette } from 'react-icons/fa';

const Store = () => {
    const { currentUser } = useAuth();

    return (
        <Layout>
            <div className="header">
                <h2>Redeem Store</h2>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                    Balance: {currentUser?.coins || 0}
                </div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}><FaStore /></div>
                <h2 style={{ marginBottom: '10px' }}>Coming Soon!</h2>
                <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
                    We are working hard to bring you an amazing store where you can redeem your hard-earned coins for real-world rewards, premium content, and exclusive themes.
                </p>
                <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '20px', opacity: 0.5 }}>
                    <div className="card" style={{ width: '200px' }}>
                        <div style={{ fontSize: '2rem' }}><FaGift /></div>
                        <h4>Gift Cards</h4>
                        <p>Unlock Amazon, Spotify, and more.</p>
                    </div>
                    <div className="card" style={{ width: '200px' }}>
                        <div style={{ fontSize: '2rem' }}><FaPalette /></div>
                        <h4>Themes</h4>
                        <p>Customize your dashboard.</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Store;
