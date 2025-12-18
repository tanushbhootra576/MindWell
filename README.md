# MindWell - Mental Wellness Platform

A comprehensive mental wellness SaaS platform featuring mood tracking, journaling, AI chat support, focus tools, and gamified wellness activities designed to help users maintain consistent mental health practices and achieve their wellness goals.

## Features

### Core Features

- **Smart Dashboard**: Track daily mood check-ins, maintain streaks, view personalized insights, and access quick wellness actions
- **AI-Powered Chat**: Intelligent companion providing personalized support and guidance based on your wellness profile
- **Mood Tracking & Analytics**: Track mood patterns over time with visual analytics, mood distribution charts, and trend analysis
- **Dynamic Recommendations**: AI-curated content including YouTube videos, Spotify music, and book suggestions based on current mood
- **Journal & Reflections**: Daily journaling with AI-generated prompts focused on emotional awareness and somatic experiences
- **Wellness Games**: Memory match, breathing exercises, thought sorter, zen mode, and stress relief games
- **Focus Tools**: Pomodoro timer, task management, and focus flow timer for productivity
- **Crisis Support**: Emergency helpline links and immediate mental health resources
- **Gamification System**: Earn coins through daily check-ins, activities, and challenges; unlock badges for streaks and milestones
- **Wallet System**: Manage earned coins and track all transactions
- **User Profile**: Personalized profile with wellness goals, mental health focus areas, and health interests

### Gamification Features

- **Dynamic Streaks**: Current and longest streaks based on daily check-ins
- **Badge System**: Unlock 7 unique badges including:
  - First Step (first check-in)
  - Week Warrior (7-day streak)
  - Month Master (30-day streak)
  - Century Club (100-day streak)
  - Peak Performance (30+ day longest streak)
  - Golden Achievement (100+ coins)
  - Wellness Champion (500+ coins)
- **Coin Rewards**: Earn coins for check-ins, activities, and completing daily challenges
- **Real-time Updates**: All stats update instantly after check-ins and activities

## Tech Stack

### Frontend

- React 19 with Vite for fast development and optimized builds
- React Router for client-side navigation
- Axios for API communication
- React Hot Toast for notifications
- React Icons for UI iconography
- Firebase Authentication for secure user login
- CSS-in-JS for dynamic styling and theming

### Backend

- Node.js & Express for server and REST API
- MongoDB with Mongoose for data persistence
- Firebase Admin SDK for authentication verification
- Groq API (LLaMA 3.3-70B) for AI chat responses
- YouTube API for video recommendations
- Spotify API for music recommendations
- Google Books API for book suggestions
- Nodemailer for email communications
- JWT & Token-based authentication for API security

### DevOps & Tools

- MongoDB Atlas for cloud database
- Firebase Hosting for authentication backend
- Environment variables for secure configuration management

## Project Structure

```
MindWell/
├── client/                          # React frontend application
│   ├── src/
│   │   ├── pages/                  # Page components (Dashboard, Profile, Analytics, etc.)
│   │   ├── components/             # Reusable React components
│   │   ├── context/                # Context API for state management (Auth)
│   │   ├── firebase.js             # Firebase configuration
│   │   └── App.jsx                 # Main app component
│   └── package.json
│
└── server/                          # Node.js/Express backend
    ├── routes/                     # API endpoints
    │   ├── auth.js                 # Authentication routes
    │   ├── entries.js              # Mood check-in routes
    │   ├── badges.js               # Badge system routes
    │   ├── analytics.js            # Analytics/insights routes
    │   ├── recommendations.js      # Content recommendations
    │   ├── ai.js                   # AI chat routes
    │   └── ...
    ├── models/                     # MongoDB schemas
    │   ├── User.js
    │   ├── Entry.js
    │   ├── History.js
    │   └── ...
    ├── services/                   # External service integrations
    │   ├── spotify.js
    │   ├── youtube.js
    │   └── email.js
    ├── middleware/                 # Express middleware
    │   └── auth.js
    ├── index.js                    # Server entry point
    └── package.json
```

## Installation & Setup

### Prerequisites

- Node.js v16 or higher
- MongoDB (local or MongoDB Atlas)
- Firebase project with authentication enabled
- Google Cloud API key (for Gemini/LLM and YouTube API)
- Spotify API credentials (Client ID and Secret)
- Groq API key (for LLaMA 3.3 model)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MindWell
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```dotenv
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindwell

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_service_account_email

# AI Services
GROQ_API_KEY=your_groq_api_key
GOOGLE_API_KEY=your_google_api_key

# Media APIs
YOUTUBE_API_KEY=your_youtube_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

# Email Service
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

Start the backend server:

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal in the project root:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```dotenv
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The client will start on `http://localhost:5173`

## Key Features Explained

### Streak System

- Current Streak: Active consecutive days of check-ins
- Longest Streak: Highest streak achieved
- Automatic Reset: Resets if a day is skipped
- Real-time Update: Updates immediately after each check-in

### Dynamic Recommendations

- AI fetches real YouTube videos based on mood
- Spotify music tracks with full player controls
- Personalized activity suggestions
- Books from Google Books API

### AI Chat System

- Powered by LLaMA 3.3-70B model via Groq API
- Context-aware responses based on user profile
- Personality-driven to match wellness goals
- Fast inference for real-time chat

### Gamification Strategy

- Daily check-ins reward 5 coins
- Completed challenges reward 5 coins
- Different badges for different milestones
- Visual progress in profile and dashboard

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (git checkout -b feature/AmazingFeature)
3. Make your changes and commit (git commit -m 'Add AmazingFeature')
4. Push to your fork (git push origin feature/AmazingFeature)
5. Open a Pull Request with a clear description

## Support & Contact

For issues, feature requests, or general support:

- Open an issue on GitHub
- Contact: Rakshith Ganjimut | Tanush Bhootra

## Acknowledgments

- Google Generative AI (Gemini and LLaMA models)
- Spotify API for music recommendations
- YouTube API for video recommendations
- Google Books API for book suggestions
- Firebase for authentication infrastructure
- Grok API for Chat

---

Built with care for mental wellness and personal growth.
