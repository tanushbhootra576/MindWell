const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
    userId: {
        type: String, // Storing firebaseUid for easy linking
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['checkin', 'game', 'video', 'music', 'feedback', 'journal', 'login', 'reward']
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Flexible payload
        default: {}
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true // Index for sorting by time
    }
});

module.exports = mongoose.model('History', historySchema);
