const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const sentiment = require('../services/sentimentService');

async function run() {
    try {
        await connectDB();
        const res = await sentiment.trainFromData({ save: true, minExamples: 5 });
        console.log('Training result:', res);
        process.exit(res.success ? 0 : 2);
    } catch (err) {
        console.error('Training failed:', err);
        process.exit(1);
    }
}

run();
