const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String, // 'work', 'personal', 'wellness'
        default: 'personal'
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: Date,
    moodAssociation: String, // e.g., 'Anxious' -> Suggests this task helps with anxiety
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema);
