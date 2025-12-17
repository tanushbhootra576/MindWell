import React from 'react';
import Layout from '../components/Layout';

const Helpline = () => {
    return (
        <Layout>
            <div className="header">
                <h2>Helpline & Support</h2>
            </div>
            <div className="card" style={{ borderLeft: '4px solid var(--error)' }}>
                <h3 style={{ color: 'var(--error)' }}>Emergency Crisis Support</h3>
                <p>If you are in immediate danger, please call your local emergency number immediately.</p>
                <ul style={{ marginTop: '16px', listStyle: 'none' }}>
                    <li style={{ marginBottom: '8px' }}><strong>[Ambulance] Emergency:</strong> 112 (India) / 911 (US)</li>
                    <li style={{ marginBottom: '8px' }}><strong>[Phone] Suicide Prevention:</strong> 988</li>
                </ul>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="card">
                    <h3>Professional Support</h3>
                    <p>Connect with verified therapists.</p>
                    <button className="btn btn-secondary" style={{ marginTop: '10px' }}>Find a Therapist</button>
                </div>
                <div className="card">
                    <h3>Community Resources</h3>
                    <p>Join support groups and forums.</p>
                    <button className="btn btn-secondary" style={{ marginTop: '10px' }}>View Resources</button>
                </div>
            </div>
        </Layout>
    );
};

export default Helpline;
