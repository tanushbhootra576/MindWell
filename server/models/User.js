const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firebaseUid: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
    },
    bio: {
        type: String,
    },
    age: {
        type: Number,
    },
    language: {
        type: String,
        default: 'en', // 'en' or 'hi'
    },
    gender: {
        type: String,
    },
    location: {
        type: String,
    },
    occupation: {
        type: String,
    },
    coins: {
        type: Number,
        default: 0,
    },
    streaks: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastCheckInDate: { type: Date }
    },
    onboarding: {
        ageRange: String,
        sleepPattern: String,
        stressLevel: String,
        preferences: [String],
        completed: { type: Boolean, default: false }
    },
    // New Features
    goals: [String], // e.g., 'sleep', 'stress', 'focus'
    healthInterests: [String], // e.g., 'meditation', 'exercise', 'nutrition'
    mentalHealthFocus: [String], // e.g., 'anxiety', 'depression', 'stress'
    reminderSettings: {
        enabled: { type: Boolean, default: false },
        checkInTime: String, // "09:00"
        frequency: { type: String, default: 'daily' }, // 'daily', 'weekly'
        emailNotifications: { type: Boolean, default: false }
    },
    contentPreferences: [String], // 'music', 'video', 'game', 'book'
    badges: [{
        id: String,
        name: String,
        dateEarned: Date,
        icon: String
    }],
    accessibility: {
        theme: { type: String, default: 'dark' },
        textSize: { type: String, default: 'medium' },
        colorBlindMode: { type: Boolean, default: false }
    },
    photoURL: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
    ,
    // Welcome email delivery tracking
    welcomeEmailSent: { type: Boolean, default: false },
    welcomeEmailSentAt: { type: Date },
    // transient flag to avoid race conditions when sending
    welcomeEmailSending: { type: Boolean, default: false }
});

userSchema.index({ firebaseUid: 1 });

module.exports = mongoose.model('User', userSchema);
