const mongoose = require('mongoose');

const gameSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    gameId: {
        type: String,
        required: true, // e.g., 'stress-popper', 'focus-flow'
    },
    score: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number, // in seconds
        default: 0,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('GameSession', gameSessionSchema);
