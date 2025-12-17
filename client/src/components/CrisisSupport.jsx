import React from 'react';
import Layout from './Layout';
import { FaPhoneAlt, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';

const CrisisSupport = () => {
    const helplines = [
        { country: 'India', name: 'Vandrevala Foundation', number: '1860-266-2345', available: '24/7' },
        { country: 'India', name: 'iCall', number: '9152987821', available: 'Mon-Sat, 8 AM - 10 PM' },
        { country: 'USA', name: 'National Suicide Prevention Lifeline', number: '988', available: '24/7' },
        { country: 'UK', name: 'Samaritans', number: '116 123', available: '24/7' },
    ];

    return (
        <Layout>
            <div className="container fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h2 style={{ color: '#E76F51', marginBottom: '10px' }}>Crisis Support</h2>
                    <p style={{ fontSize: '1.1rem' }}>You are not alone. Help is available.</p>
                </div>

                <div className="card" style={{ borderLeft: '5px solid #E76F51', marginBottom: '30px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#E76F51' }}>
                        <FaPhoneAlt /> Immediate Help
                    </h3>
                    <p style={{ margin: '15px 0' }}>
                        If you or someone you know is in immediate danger, please call your local emergency number (e.g., 112, 911) or go to the nearest hospital emergency room.
                    </p>
                    <button className="btn" style={{ background: '#E76F51', color: 'white', width: '100%', fontSize: '1.2rem', padding: '15px' }}>
                        Call Emergency Services
                    </button>
                </div>

                <h3 style={{ marginBottom: '20px' }}><FaGlobe /> Helplines</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {helplines.map((line, index) => (
                        <div key={index} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{line.name}</span>
                                <span style={{ fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px' }}>{line.country}</span>
                            </div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '5px' }}>
                                {line.number}
                            </div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                Available: {line.available}
                            </div>
                            <a href={`tel:${line.number}`} className="btn btn-secondary" style={{ marginTop: '15px', width: '100%', textAlign: 'center', display: 'block', textDecoration: 'none' }}>
                                Call Now
                            </a>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p><FaMapMarkerAlt /> Location-based services coming soon.</p>
                </div>
            </div>
        </Layout>
    );
};

export default CrisisSupport;
