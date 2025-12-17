import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaCheck, FaTrash, FaRegCircle, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TaskList = () => {
    const { currentUser } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetchTasks();
        }
    }, [currentUser]);

    const fetchTasks = async () => {
        try {
            const token = await currentUser.getIdToken();
            const res = await fetch('http://localhost:5000/api/tasks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setTasks(data);
            }
        } catch (err) {
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const token = await currentUser.getIdToken();
            const res = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: newTask,
                    category: 'personal' // Default for now
                })
            });
            const data = await res.json();
            setTasks([data, ...tasks]);
            setNewTask('');
            toast.success('Task added!');
        } catch (err) {
            toast.error('Failed to add task');
        }
    };

    const toggleTask = async (id, currentStatus) => {
        try {
            // Optimistic update
            setTasks(tasks.map(t =>
                t._id === id ? { ...t, completed: !currentStatus } : t
            ));

            const token = await currentUser.getIdToken();
            await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ completed: !currentStatus })
            });
        } catch (err) {
            toast.error('Failed to update task');
            fetchTasks(); // Revert on error
        }
    };

    const deleteTask = async (id) => {
        try {
            setTasks(tasks.filter(t => t._id !== id));
            const token = await currentUser.getIdToken();
            await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success('Task deleted');
        } catch (err) {
            toast.error('Failed to delete task');
            fetchTasks();
        }
    };

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                My Tasks
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{tasks.filter(t => !t.completed).length} active</span>
            </h3>

            <form onSubmit={addTask} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="form-control"
                    style={{ flex: 1 }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '0 15px' }}>
                    <FaPlus />
                </button>
            </form>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {loading ? (
                    <p style={{ textAlign: 'center', opacity: 0.6 }}>Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <p style={{ textAlign: 'center', opacity: 0.6, marginTop: '20px' }}>No tasks yet. Add one above!</p>
                ) : (
                    tasks.map(task => (
                        <div
                            key={task._id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '10px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <button
                                onClick={() => toggleTask(task._id, task.completed)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: task.completed ? '#2A9D8F' : 'rgba(255,255,255,0.5)',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
                            </button>

                            <span style={{
                                flex: 1,
                                textDecoration: task.completed ? 'line-through' : 'none',
                                opacity: task.completed ? 0.5 : 1
                            }}>
                                {task.title}
                            </span>

                            <button
                                onClick={() => deleteTask(task._id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#E76F51',
                                    cursor: 'pointer',
                                    opacity: 0.6,
                                    fontSize: '0.9rem'
                                }}
                                className="delete-btn"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;
