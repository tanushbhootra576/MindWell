import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Login = () => {
    const { loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
            navigate('/dashboard');
        } catch (error) {
            console.error("Failed to login", error);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="card" style={{ maxWidth: '450px', width: '100%', textAlign: 'center', padding: '40px' }}>
                    <h2 style={{ marginBottom: '10px', fontSize: '2rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>Sign in to continue your wellness journey</p>

                    <button
                        onClick={handleLogin}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'white',
                            border: '2px solid #e0e0e0',
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            padding: '15px'
                        }}
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
                        Sign in with Google
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
