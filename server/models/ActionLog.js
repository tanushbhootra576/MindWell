const mongoose = require('mongoose');

const actionLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    actionType: {
        type: String,
        required: true, // e.g., 'LOGIN', 'CHECK_IN', 'GAME_PLAYED', 'RECOMMENDATION_CLICK'
    },
    details: {
        type: Object, // Flexible field for storing related data (e.g., game score, mood value)
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('ActionLog', actionLogSchema);
