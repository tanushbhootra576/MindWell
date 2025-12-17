import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    border: 'var(--glass-border)',
                    backdropFilter: 'blur(12px)',
                },
            }} />
            {/* Background Elements */}
            <div className="orb orb-1" />
            <div className="orb orb-2" />

            <Navbar />
            <main style={{ flex: 1, padding: '20px 0', position: 'relative', zIndex: 1 }}>
                <div className="container">
                    {children}
                </div>
            </main>
            <footer style={{ textAlign: 'center', padding: '20px 10px', color: 'var(--text-muted)', fontSize: '0.9rem', borderTop: '1px solid var(--border)', wordBreak: 'break-word' }}>
                &copy; {new Date().getFullYear()} MindWell Platform.
            </footer>
        </div>
    );
};

export default Layout;
