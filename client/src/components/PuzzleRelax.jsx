import React, { useState, useCallback } from 'react';
import { FaCheck, FaRedoAlt } from 'react-icons/fa';

const PuzzleRelax = () => {
    const [tiles, setTiles] = useState(() => {
        const colors = ['#ec4899', '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#14b8a6'];
        const shuffled = colors.sort(() => Math.random() - 0.5);
        return shuffled.map((color, idx) => ({ id: idx, color, correctPosition: idx }));
    });
    const [moves, setMoves] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const generatePuzzle = useCallback(() => {
        const colors = ['#ec4899', '#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#14b8a6'];
        const shuffled = colors.sort(() => Math.random() - 0.5);
        setTiles(shuffled.map((color, idx) => ({ id: idx, color, correctPosition: idx })));
        setMoves(0);
        setIsCompleted(false);
    }, []);

    // No useEffect needed - tiles are initialized in state

    const swapTiles = useCallback((idx1, idx2) => {
        setTiles(prev => {
            const newTiles = [...prev];
            [newTiles[idx1], newTiles[idx2]] = [newTiles[idx2], newTiles[idx1]];

            // Check if puzzle is complete
            const isComplete = newTiles.every((tile, idx) => tile.correctPosition === idx);
            if (isComplete) {
                setIsCompleted(true);
            }

            return newTiles;
        });
        setMoves(m => m + 1);
    }, []);

    const getRandomTileIndex = useCallback(() => {
        return Math.floor(Math.random() * tiles.length);
    }, [tiles.length]);

    const handleTileClick = useCallback((idx) => {
        if (tiles[idx].correctPosition !== idx) {
            const randomIdx = getRandomTileIndex();
            if (randomIdx !== idx) {
                swapTiles(idx, randomIdx);
            }
        }
    }, [tiles, getRandomTileIndex, swapTiles]);

    return (
        <div style={styles.container}>
            <h2>Puzzle Relax</h2>
            <p style={styles.description}>Arrange the tiles in order. A simple, meditative puzzle game.</p>

            <div style={styles.stats}>
                <div>Moves: {moves}</div>
                {isCompleted && <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Puzzle Complete! [Celebration]</div>}
            </div>

            <div style={styles.puzzle}>
                {tiles.map((tile, idx) => (
                    <button
                        key={tile.id}
                        onClick={() => handleTileClick(idx)}
                        style={{
                            ...styles.tile,
                            background: tile.color,
                            opacity: tile.correctPosition === idx ? 1 : 0.8,
                            transform: tile.correctPosition === idx ? 'scale(1)' : 'scale(0.95)',
                        }}
                    >
                        {tile.correctPosition === idx && <FaCheck style={{ color: 'white' }} />}
                    </button>
                ))}
            </div>

            <button onClick={generatePuzzle} style={styles.resetBtn}>
                <FaRedoAlt /> New Puzzle
            </button>

            <div style={styles.tips}>
                <h4>How to Play:</h4>
                <ul>
                    <li>Click tiles to rearrange them</li>
                    <li>Match each tile to its correct position</li>
                    <li>Focus on the colors and patterns</li>
                    <li>No time limit - just relax and enjoy</li>
                </ul>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '40px 20px',
        maxWidth: '600px',
        margin: '0 auto',
    },
    description: {
        color: 'var(--text-muted)',
        marginBottom: '20px',
        textAlign: 'center',
    },
    stats: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '16px',
        background: 'rgba(99, 102, 241, 0.1)',
        borderRadius: '8px',
    },
    puzzle: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '30px',
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.05))',
        borderRadius: '12px',
        border: '1px solid var(--border)',
    },
    tile: {
        aspectRatio: '1',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        transition: 'all 0.3s ease',
        fontWeight: '600',
    },
    resetBtn: {
        width: '100%',
        padding: '12px',
        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginBottom: '20px',
        transition: 'all 0.3s ease',
    },
    tips: {
        background: 'rgba(99, 102, 241, 0.05)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
    },
};

export default PuzzleRelax;
