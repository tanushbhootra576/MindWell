import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaChartBar, FaChartLine, FaChartPie, FaFire, FaSmile, FaTrophy } from 'react-icons/fa';

const Analytics = () => {
    const { currentUser } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('week'); // week, month, all

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = await currentUser.getIdToken();
                const res = await axios.get(`http://localhost:5000/api/analytics?range=${timeRange}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnalytics(res.data);
            } catch (error) {
                console.error("Error fetching analytics", error);
            }
            setLoading(false);
        };
        if (currentUser) fetchAnalytics();
    }, [currentUser, timeRange]);

    if (loading) return <Layout><div style={{ padding: '40px', textAlign: 'center' }}>Loading your analytics...</div></Layout>;

    return (
        <Layout>
            <div className="header">
                <h2>Your Mental Wellness Analytics</h2>
                <p style={{ color: 'var(--text-muted)' }}>Track your progress and mood patterns</p>
            </div>

            {/* Time Range Selector */}
            <div className="card" style={{ marginBottom: '30px' }}>
                <h3>Time Period</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                    {['week', 'month', 'all'].map(range => (
                        <button
                            key={range}
                            onClick={() => {
                                setTimeRange(range);
                                setLoading(true);
                            }}
                            className={`btn ${timeRange === range ? 'btn-primary' : 'btn-secondary'}`}
                        >
                            {range === 'week' ? 'This Week' : range === 'month' ? 'This Month' : 'All Time'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>
                            <FaSmile />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Avg Mood Score</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics?.averageMood || '--'}</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem', color: 'var(--success)' }}>
                            <FaFire />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Streak</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics?.currentStreak || 0} days</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem', color: 'var(--primary)' }}>
                            <FaTrophy />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Longest Streak</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics?.longestStreak || 0} days</div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ fontSize: '2.5rem', color: 'var(--warning)' }}>
                            <FaChartBar />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-ins</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{analytics?.checkins || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mood Distribution Chart */}
            {analytics?.moodDistribution && (
                <div className="card" style={{ marginTop: '30px' }}>
                    <h3><FaChartPie style={{ marginRight: '10px', color: 'var(--primary)' }} />Mood Distribution</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginTop: '20px' }}>
                        {Object.entries(analytics.moodDistribution).map(([mood, count]) => (
                            <div key={mood} style={{ padding: '15px', background: 'var(--bg-main)', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border)' }}>
                                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '5px' }}>{count}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{mood}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Activity Distribution */}
            {analytics?.activityBreakdown && Object.keys(analytics.activityBreakdown).length > 0 && (
                <div className="card" style={{ marginTop: '30px' }}>
                    <h3><FaChartLine style={{ marginRight: '10px', color: 'var(--secondary)' }} />Activity Breakdown</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '40px', marginTop: '20px' }}>
                        {/* Pie Chart */}
                        <div style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: `conic-gradient(${(() => {
                                const total = Object.values(analytics.activityBreakdown).reduce((a, b) => a + b, 0);
                                let current = 0;
                                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                                return Object.entries(analytics.activityBreakdown).map(([key, value], index) => {
                                    const start = current;
                                    const percentage = (value / total) * 100;
                                    current += percentage;
                                    return `${colors[index % colors.length]} ${start}% ${current}%`;
                                }).join(', ')
                            })()
                                })`,
                            position: 'relative'
                        }}>
                            {/* Inner circle for Donut effect */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '120px',
                                height: '120px',
                                background: 'var(--bg-card)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}>
                                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {Object.values(analytics.activityBreakdown).reduce((a, b) => a + b, 0)}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total</div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {Object.entries(analytics.activityBreakdown).map(([activity, count], index) => {
                                const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
                                const total = Object.values(analytics.activityBreakdown).reduce((a, b) => a + b, 0);
                                const percentage = ((count / total) * 100).toFixed(1);
                                return (
                                    <div key={activity} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: colors[index % colors.length] }}></div>
                                        <div style={{ textTransform: 'capitalize', minWidth: '100px' }}>{activity}</div>
                                        <div style={{ fontWeight: 'bold' }}>{count}</div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>({percentage}%)</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Mood Trend Chart */}
            {analytics?.moodTrend && analytics.moodTrend.length > 0 && (
                <div className="card" style={{ marginTop: '30px' }}>
                    <h3><FaChartLine style={{ marginRight: '10px', color: 'var(--accent)' }} />Mood Trend</h3>
                    <div style={{ marginTop: '20px', overflowX: 'auto' }}>
                        <div style={{ display: 'flex', gap: '10px', minWidth: 'fit-content', paddingBottom: '10px' }}>
                            {analytics.moodTrend.map((item, index) => (
                                <div key={index} style={{ textAlign: 'center', minWidth: '80px' }}>
                                    <div
                                        style={{
                                            height: `${Math.max(item.score * 20, 30)}px`,
                                            width: '50px',
                                            background: `linear-gradient(to top, var(--primary), var(--accent))`,
                                            borderRadius: '4px',
                                            margin: '0 auto 10px',
                                            opacity: 0.8
                                        }}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.date}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Insights */}
            {analytics?.insights && (
                <div className="card" style={{ marginTop: '30px', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                    <h3>[Lightbulb] Your Insights</h3>
                    <div style={{ marginTop: '15px' }}>
                        {analytics.insights.map((insight, index) => (
                            <div key={index} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)', display: 'flex', gap: '15px' }}>
                                <div style={{ fontSize: '1.5rem' }}>✓</div>
                                <div style={{ color: 'var(--text-main)' }}>{insight}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {!analytics || (Object.keys(analytics).length === 0) && (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ color: 'var(--text-muted)' }}>No data available for this period. Start tracking your mood to see analytics!</p>
                </div>
            )}
        </Layout>
    );
};

export default Analytics;
