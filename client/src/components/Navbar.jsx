import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const isActive = (path) => location.pathname === path;

    const navLinkStyle = (path) => ({
        textDecoration: 'none',
        color: isActive(path) ? 'var(--accent)' : 'var(--text-main)',
        fontWeight: isActive(path) ? '700' : '500',
        padding: '8px 12px',
        borderRadius: 'var(--radius-sm)',
        transition: 'all 0.2s',
        background: isActive(path) ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
    });

    return (
        <nav style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', position: 'relative' }}>
                <Link to="/" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'white', textDecoration: 'none', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
                    MindWell
                </Link>

                {/* Desktop Menu */}
                <div className="desktop-menu">
                    {currentUser ? (
                        <>
                            <Link to="/dashboard" style={navLinkStyle('/dashboard')}>Dashboard</Link>
                            <Link to="/chat" style={navLinkStyle('/chat')}>AI Chat</Link>
                            <Link to="/games" style={navLinkStyle('/games')}>Games</Link>
                            <Link to="/recommendations" style={navLinkStyle('/recommendations')}>Media</Link>
                            <Link to="/analytics" style={navLinkStyle('/analytics')}>Analytics</Link>
                            <Link to="/wallet" style={navLinkStyle('/wallet')}>Wallet</Link>
                            <Link to="/profile" style={navLinkStyle('/profile')}>Profile</Link>
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', marginLeft: '10px' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-primary">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="mobile-toggle"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle navigation menu"
                >
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    top: '70px',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'var(--bg-body)',
                    borderBottom: '1px solid var(--border)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    boxShadow: 'var(--shadow-lg)',
                    overflowY: 'auto',
                    zIndex: 100,
                    height: 'calc(100vh - 70px)',
                }}>
                    {currentUser ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)} style={navLinkStyle('/dashboard')}>Dashboard</Link>
                            <Link to="/chat" onClick={() => setIsOpen(false)} style={navLinkStyle('/chat')}>AI Chat</Link>
                            <Link to="/games" onClick={() => setIsOpen(false)} style={navLinkStyle('/games')}>Games</Link>
                            <Link to="/recommendations" onClick={() => setIsOpen(false)} style={navLinkStyle('/recommendations')}>Media</Link>
                            <Link to="/analytics" onClick={() => setIsOpen(false)} style={navLinkStyle('/analytics')}>Analytics</Link>
                            <Link to="/wallet" onClick={() => setIsOpen(false)} style={navLinkStyle('/wallet')}>Wallet</Link>
                            <Link to="/profile" onClick={() => setIsOpen(false)} style={navLinkStyle('/profile')}>Profile</Link>
                            <button onClick={() => { handleLogout(); setIsOpen(false); }} className="btn btn-secondary" style={{ width: '100%' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                            Login
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
