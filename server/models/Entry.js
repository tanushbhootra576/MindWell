const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mood: {
        type: String, // e.g., 'Happy', 'Sad', 'Anxious', 'Neutral'
        required: true,
    },
    journalText: {
        type: String,
    },
    sentimentScore: {
        type: Number, // Analysis result
    },
    recommendations: [{
        type: String, // URLs or IDs of recommended content
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Entry', entrySchema);
