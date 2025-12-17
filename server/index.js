require('dotenv').config({ path: __dirname + '/.env' });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const cron = require('node-cron');
const User = require('./models/User');
const { sendReminderEmail } = require('./services/email');

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/recommendations', require('./routes/recommendations'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/history', require('./routes/history'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/sentiment', require('./routes/sentiment'));
app.use('/api/rewards', require('./routes/rewards'));
app.use('/api/badges', require('./routes/badges'));

console.log('Registered routes loaded');

// Cron Job for Daily Reminders
cron.schedule('* * * * *', async () => {
  const now = new Date();
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM

  try {
    const users = await User.find({
      'reminderSettings.emailNotifications': true,
      'reminderSettings.checkInTime': currentTime,
    });

    for (const user of users) {
      console.log(`Sending reminder to ${user.email}`);
      await sendReminderEmail(user.email, user.name || 'User');
    }
  } catch (error) {
    console.error('Error in cron job:', error);
  }
});

app.get('/', (req, res) => {
  res.send('Mental Wellness Platform API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
