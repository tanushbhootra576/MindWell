import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaBrain, FaSpa, FaWind, FaClock, FaCoins, FaFilm, FaGamepad, FaYinYang, FaHeartbeat, FaChartLine, FaRobot, FaLock, FaSmile, FaFire, FaAward, FaUser, FaArrowRight } from 'react-icons/fa';

const Landing = () => {
    const canvasRef = useRef(null);

    const initializeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let animationId;
        let rotation = 0;

        const drawCube = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.save();
            ctx.translate(canvas.width / 2, canvas.height / 2);

            // Draw rotating gradient circles
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
            gradient.addColorStop(0, 'rgba(88, 86, 214, 0.3)');
            gradient.addColorStop(0.5, 'rgba(88, 86, 214, 0.15)');
            gradient.addColorStop(1, 'rgba(88, 86, 214, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(-150, -150, 300, 300);

            // Draw rotating elements
            ctx.strokeStyle = 'rgba(88, 86, 214, 0.5)';
            ctx.lineWidth = 2;

            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.arc(0, 0, 50 + i * 40, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Draw rotating dots
            ctx.fillStyle = 'rgba(88, 86, 214, 0.7)';
            for (let i = 0; i < 8; i++) {
                const angle = (rotation + (i * Math.PI / 4));
                const x = Math.cos(angle) * 120;
                const y = Math.sin(angle) * 120;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
            }

            rotation += 0.01;
            ctx.restore();
            animationId = requestAnimationFrame(drawCube);
        };

        drawCube();

        return () => {
            if (animationId) cancelAnimationFrame(animationId);
        };
    };

    useEffect(() => {
        // Simple 3D effect using canvas
        initializeCanvas();
    }, []);

    const features = [
        {
            icon: <FaBrain />,
            title: 'Smart Mood Tracking',
            description: 'Log your emotions daily and visualize patterns with our intelligent analytics dashboard. Understand your mental wellness journey.',
            color: '#5856D6'
        },
        {
            icon: <FaSpa />,
            title: 'Wellness Games',
            description: 'Engage with therapeutic games like Memory Match, Breathing Exercises, and Zen Mode to improve focus and reduce stress.',
            color: '#00C7BE'
        },
        {
            icon: <FaRobot />,
            title: 'AI Companion',
            description: 'Chat with our AI wellness assistant powered by Google Gemini. Get instant support and personalized mental health guidance.',
            color: '#FF9500'
        },
        {
            icon: <FaFilm />,
            title: 'Mood-Based Recommendations',
            description: 'Get personalized music, videos, and books tailored to your current emotional state. Refresh content every time you check in.',
            color: '#FF3B30'
        },
        {
            icon: <FaClock />,
            title: 'Focus & Productivity Tools',
            description: 'Master the Pomodoro technique with our timer, manage tasks, and track focus sessions to boost productivity.',
            color: '#34C759'
        },


        {
            icon: <FaChartLine />,
            title: 'Advanced Analytics',
            description: 'Track mood trends, focus streaks, wellness activities, and emotional patterns with detailed visual insights and reports.',
            color: '#5AC8FA'
        }
    ];

    const stats = [
        { number: '10K+', label: 'Active Users', icon: <FaUser /> },

        { number: '100+', label: 'Wellness Games', icon: <FaGamepad /> },
        { number: '24/7', label: 'Crisis Support', icon: <FaSpa /> }
    ];

    const testimonials = [

        {
            name: 'James K.',
            role: 'Software Engineer',
            text: 'The Pomodoro timer and focus flow games have significantly improved my productivity. Best wellness app I\'ve tried!',
            avatar: '[Business Professional]'
        },
        {
            name: 'Emma L.',
            role: 'Therapist',
            text: 'I recommend MindWell to my clients. It\'s a perfect complement to therapy sessions and encourages daily wellness practices.',
            avatar: '[Doctor]'
        },
        {
            name: 'David P.',
            role: 'Fitness Coach',
            text: 'The gamification and coins system motivate my clients to maintain their wellness routine consistently.',
            avatar: '[Coach]'
        }
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
            <Navbar />
            <style>{`
                .landing-hero {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    padding: 80px 20px 60px;
                    background: linear-gradient(135deg, rgba(88, 86, 214, 0.05) 0%, rgba(52, 199, 137, 0.05) 100%);
                    position: relative;
                    overflow: hidden;
                }

                .hero-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    z-index: 2;
                }

                .hero-left h1 {
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    line-height: 1.2;
                    color: var(--text-main);
                }

                .hero-left .primary-text {
                    color: var(--primary);
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-left p {
                    font-size: 1.1rem;
                    color: var(--text-muted);
                    margin-bottom: 30px;
                    line-height: 1.8;
                }

                .hero-buttons {
                    display: flex;
                    gap: 20px;
                    margin-bottom: 40px;
                }

                .hero-buttons .btn {
                    padding: 14px 32px;
                    font-size: 1rem;
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    font-weight: 600;
                }

                .btn-primary {
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(88, 86, 214, 0.3);
                }

                .btn-secondary {
                    background: rgba(255, 255, 255, 0.1);
                    color: var(--text-main);
                    border: 2px solid var(--border);
                }

                .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.15);
                    border-color: var(--primary);
                }

                .hero-right {
                    position: relative;
                    height: 400px;
                }

                .canvas-3d {
                    width: 100%;
                    height: 100%;
                    border-radius: var(--radius-lg);
                }

                .feature-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 30px;
                    padding: 60px 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .feature-card {
                    background: var(--bg-card);
                    border: var(--glass-border);
                    border-radius: var(--radius-lg);
                    padding: 30px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                }

                .feature-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    transition: left 0.5s ease;
                }

                .feature-card:hover::before {
                    left: 100%;
                }

                .feature-card:hover {
                    transform: translateY(-10px);
                    border-color: var(--primary);
                    box-shadow: 0 20px 40px rgba(88, 86, 214, 0.15);
                }

                .feature-icon {
                    font-size: 2.5rem;
                    margin-bottom: 15px;
                }

                .feature-card h3 {
                    font-size: 1.3rem;
                    margin-bottom: 12px;
                    color: var(--text-main);
                }

                .feature-card p {
                    color: var(--text-muted);
                    font-size: 0.95rem;
                    line-height: 1.6;
                }

                .stats-section {
                    padding: 60px 20px;
                    background: linear-gradient(135deg, rgba(88, 86, 214, 0.05) 0%, rgba(52, 199, 137, 0.05) 100%);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .stat-card {
                    text-align: center;
                    padding: 30px;
                    animation: slideUp 0.6s ease-out forwards;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .stat-card .number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 10px;
                }

                .stat-card .icon {
                    font-size: 2rem;
                    margin-bottom: 10px;
                    color: var(--primary);
                }

                .stat-card p {
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .testimonials-section {
                    padding: 60px 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .testimonial-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 30px;
                }

                .testimonial-card {
                    background: var(--bg-card);
                    border: var(--glass-border);
                    border-radius: var(--radius-lg);
                    padding: 30px;
                    transition: all 0.3s ease;
                }

                .testimonial-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 20px 40px rgba(88, 86, 214, 0.15);
                }

                .testimonial-stars {
                    color: var(--primary);
                    margin-bottom: 15px;
                    font-size: 1.2rem;
                }

                .testimonial-text {
                    color: var(--text-muted);
                    margin-bottom: 20px;
                    font-style: italic;
                    line-height: 1.6;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .author-avatar {
                    font-size: 2rem;
                }

                .author-info h4 {
                    margin: 0;
                    color: var(--text-main);
                    font-size: 0.95rem;
                }

                .author-info p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 0.85rem;
                }

                .section-title {
                    text-align: center;
                    margin-bottom: 50px;
                }

                .section-title h2 {
                    font-size: 2.5rem;
                    margin-bottom: 15px;
                    color: var(--text-main);
                }

                .section-title p {
                    color: var(--text-muted);
                    font-size: 1.1rem;
                }

                .cta-section {
                    padding: 100px 20px;
                    text-align: center;
                    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
                    color: white;
                }

                .cta-section h2 {
                    font-size: 2.5rem;
                    margin-bottom: 20px;
                }

                .cta-section p {
                    font-size: 1.2rem;
                    margin-bottom: 40px;
                    opacity: 0.9;
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .cta-buttons {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .cta-buttons .btn {
                    padding: 14px 32px;
                    border-radius: var(--radius-md);
                    border: none;
                    cursor: pointer;
                    font-weight: 600;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .cta-primary {
                    background: white;
                    color: var(--primary);
                }

                .cta-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                .cta-secondary {
                    background: rgba(255,255,255,0.2);
                    color: white;
                    border: 2px solid white;
                }

                .cta-secondary:hover {
                    background: rgba(255,255,255,0.3);
                }

                @media (max-width: 900px) {
                    .hero-content {
                        grid-template-columns: 1fr;
                        gap: 40px;
                    }

                    .hero-left h1 {
                        font-size: 2.5rem;
                    }

                    .hero-buttons {
                        flex-direction: column;
                    }

                    .hero-right {
                        height: 300px;
                    }

                    .feature-grid {
                        grid-template-columns: 1fr;
                    }

                    .section-title h2 {
                        font-size: 2rem;
                    }

                    .cta-section h2 {
                        font-size: 2rem;
                    }

                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 600px) {
                    .hero-left h1 {
                        font-size: 1.8rem;
                    }

                    .section-title h2 {
                        font-size: 1.5rem;
                    }

                    .stats-grid {
                        grid-template-columns: 1fr;
                    }

                    .cta-buttons {
                        flex-direction: column;
                    }
                }
            `}</style>

            {/* Hero Section */}
            <div className="landing-hero">
                <div className="hero-content">
                    <div className="hero-left">
                        <h1>
                            Find Your <span className="primary-text">Balance</span>.<br />
                            Elevate Your <span className="primary-text">Mind</span>.
                        </h1>
                        <p>
                            MindWell is your comprehensive mental wellness companion. Track your mood, journal your thoughts,
                            engage with therapeutic games, and receive AI-powered guidance—all in one beautiful, secure platform.
                        </p>
                        <div className="hero-buttons">
                            <Link to="/login" className="btn btn-primary">
                                Get Started <FaArrowRight style={{ marginLeft: '8px' }} />
                            </Link>
                            <a href="#features" className="btn btn-secondary">
                                Learn More
                            </a>
                        </div>
                        <div style={{ display: 'flex', gap: '30px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                            <div>✓ Free & Secure</div>
                            <div>✓ 24/7 Support</div>
                            <div>✓ Science-Based</div>
                        </div>
                    </div>
                    <div className="hero-right">
                        <canvas ref={canvasRef} className="canvas-3d"></canvas>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features">
                <div className="section-title" style={{ paddingTop: '60px' }}>
                    <h2>Powerful Features for Your Wellness</h2>
                    <p>Everything you need to manage your mental health and emotional wellbeing</p>
                </div>
                <div className="feature-grid">
                    {features.map((feature, idx) => (
                        <div key={idx} className="feature-card">
                            <div className="feature-icon" style={{ color: feature.color }}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Section */}
            <div className="stats-section">
                <div className="stats-grid">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="stat-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                            <div className="icon">{stat.icon}</div>
                            <div className="number">{stat.number}</div>
                            <p>{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works */}
            <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div className="section-title">
                    <h2>How MindWell Works</h2>
                    <p>Start your wellness journey in 4 simple steps</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '30px' }}>
                    {[
                        { step: '1', title: 'Check In', desc: 'Log your mood and current emotional state' },
                        { step: '2', title: 'Get Recommendations', desc: 'Receive personalized wellness activities & content' },
                        { step: '3', title: 'Engage & Track', desc: 'Use tools, games, and journaling features' },
                        { step: '4', title: 'Grow & Celebrate', desc: 'Earn badges and track your wellness progress' }
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            background: 'var(--bg-card)',
                            border: 'var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '30px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                        }} onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.borderColor = 'var(--primary)';
                        }} onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = 'var(--border)';
                        }}>
                            <div style={{
                                width: '50px',
                                height: '50px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                margin: '0 auto 20px'
                            }}>
                                {item.step}
                            </div>
                            <h3 style={{ marginBottom: '10px', color: 'var(--text-main)' }}>{item.title}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Testimonials */}
            <div className="testimonials-section">
                <div className="section-title">
                    <h2>What Users Love About MindWell</h2>
                    <p>Join thousands of people on their wellness journey</p>
                </div>
                <div className="testimonial-grid">
                    {testimonials.map((testimonial, idx) => (
                        <div key={idx} className="testimonial-card">
                            <div className="testimonial-stars">★★★★★</div>
                            <p className="testimonial-text">"{testimonial.text}"</p>
                            <div className="testimonial-author">
                                <div className="author-avatar">{testimonial.avatar}</div>
                                <div className="author-info">
                                    <h4>{testimonial.name}</h4>
                                    <p>{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Premium Features */}
            <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <div className="section-title">
                    <h2>Premium Features</h2>
                    <p>Access advanced tools and insights</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    {[
                        { icon: <FaAward />, title: 'Badges & Streaks' },
                        { icon: <FaChartLine />, title: 'Analytics Dashboard' },
                        { icon: <FaRobot />, title: 'AI Chat Support' },

                        { icon: <FaCoins />, title: 'Wellness Coins' },
                        { icon: <FaHeartbeat />, title: 'Health Tracking' }
                    ].map((item, idx) => (
                        <div key={idx} style={{
                            background: 'var(--bg-card)',
                            border: 'var(--glass-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '20px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>{item.icon}</div>
                            <p style={{ color: 'var(--text-main)', fontWeight: '500', margin: 0 }}>{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <h2>Ready to Transform Your Mental Wellness?</h2>
                <p>Join thousands of users who are already experiencing positive changes in their lives</p>
                <div className="cta-buttons">
                    <Link to="/login" className="btn cta-primary">
                        Start Free Today
                    </Link>
                    <a href="#features" className="btn cta-secondary">
                        Learn More
                    </a>
                </div>
            </div>

            {/* Footer */}
            <footer style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: 'var(--text-muted)',
                borderTop: '1px solid var(--border)',
                fontSize: '0.9rem'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: '10px 0' }}>MindWell - Your Comprehensive Mental Wellness Platform</p>
                        <p style={{ margin: '10px 0' }}>Available 24/7 with Crisis Support and Professional Resources</p>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '20px 0' }} />
                    <p>&copy; {new Date().getFullYear()} MindWell. All rights reserved. | Privacy Policy | Terms of Service</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
