import React, { useState } from 'react';
import Layout from '../components/Layout';

const ZenMode = () => {
    const [activeSound, setActiveSound] = useState(null);
    const [audio, setAudio] = useState(null);

    const sounds = [
        { id: 'rain', name: 'Rain', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-1253.mp3' },
        { id: 'forest', name: 'Forest', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-ambience-1210.mp3' },
        { id: 'waves', name: 'Waves', url: 'https://assets.mixkit.co/sfx/preview/mixkit-sea-waves-loop-1196.mp3' }
    ];

    const toggleSound = (sound) => {
        if (activeSound === sound.id) {
            audio.pause();
            setActiveSound(null);
            setAudio(null);
        } else {
            if (audio) audio.pause();
            const newAudio = new Audio(sound.url);
            newAudio.loop = true;
            newAudio.play();
            setAudio(newAudio);
            setActiveSound(sound.id);
        }
    };

    return (
        <Layout>
            <div className="header">
                <h2>Zen Mode</h2>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <h3 style={{ marginBottom: '30px' }}>Choose your ambiance</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    {sounds.map(sound => (
                        <button
                            key={sound.id}
                            onClick={() => toggleSound(sound)}
                            className={`btn ${activeSound === sound.id ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ width: '120px', height: '120px', borderRadius: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                        >
                            <span style={{ fontSize: '2rem' }}>{sound.id === 'rain' ? '[Rain]' : sound.id === 'forest' ? '[Forest]' : '[Ocean]'}</span>
                            {sound.name}
                        </button>
                    ))}
                </div>
                <div style={{ marginTop: '40px' }}>
                    <textarea
                        placeholder="Write freely without distractions..."
                        style={{ width: '100%', maxWidth: '600px', height: '300px', padding: '20px', border: 'none', background: 'var(--bg-main)', borderRadius: '12px', resize: 'none', fontSize: '1.1rem', fontFamily: 'inherit' }}
                    ></textarea>
                </div>
            </div>
        </Layout>
    );
};

export default ZenMode;
