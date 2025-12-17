import React, { useState, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I'm your AI wellness companion. How are you feeling today?", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { id: Date.now(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const token = await currentUser.getIdToken();

            // Prepare user profile context
            const userContext = {
                name: currentUser.name,
                age: currentUser.age,
                gender: currentUser.gender,
                goals: currentUser.goals || [],
                mentalHealthFocus: currentUser.mentalHealthFocus || [],
                healthInterests: currentUser.healthInterests || [],
                contentPreferences: currentUser.contentPreferences || []
            };

            const res = await fetch('http://localhost:5000/api/ai/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    message: input,
                    userContext: userContext
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || data.error || 'Failed to get response');
            }

            const botResponse = {
                id: Date.now() + 1,
                text: data.reply,
                sender: 'bot'
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chat error", error);
            toast.error(`Error: ${error.message}`);

            // Fallback message
            const fallbackResponse = {
                id: Date.now() + 1,
                text: "I'm having trouble connecting right now. Please try again later.",
                sender: 'bot'
            };
            setMessages(prev => [...prev, fallbackResponse]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', maxWidth: '800px', margin: '0 auto' }}>
                <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>

                    {/* Chat Header */}
                    <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <FaRobot />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>MindWell AI</h3>
                            <span style={{ fontSize: '0.8rem', color: '#4CAF50' }}>Online</span>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                    maxWidth: '70%',
                                    display: 'flex',
                                    gap: '10px',
                                    flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                                }}
                            >
                                <div style={{
                                    width: '30px', height: '30px', borderRadius: '50%',
                                    background: msg.sender === 'user' ? 'var(--secondary)' : 'var(--primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.8rem', flexShrink: 0
                                }}>
                                    {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
                                </div>
                                <div style={{
                                    background: msg.sender === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    borderTopRightRadius: msg.sender === 'user' ? '2px' : '12px',
                                    borderTopLeftRadius: msg.sender === 'bot' ? '2px' : '12px',
                                    lineHeight: '1.5'
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div style={{ alignSelf: 'flex-start', marginLeft: '40px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                Typing...
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} style={{ padding: '20px', borderTop: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)', display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            style={{ flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ borderRadius: '50%', width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            disabled={loading || !input.trim()}
                        >
                            <FaPaperPlane />
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Chat;
