const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    type: {
        type: String, // 'focus', 'break'
        default: 'focus'
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('FocusSession', focusSessionSchema);
