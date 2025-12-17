import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import AuthProvider from './context/AuthContext';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

import Profile from './pages/Profile';

import GameHub from './pages/GameHub';
import Helpline from './pages/Helpline';
import Analytics from './pages/Analytics';
import Wallet from './pages/Wallet';
import StressGame from './components/StressGame'; // Reusing as a page for now
import FocusFlow from './components/FocusFlow';
import MemoryMatch from './components/MemoryMatch';
import BreathingExercise from './components/BreathingExercise';
import ThoughtSorter from './components/ThoughtSorter';
import ZenMode from './components/ZenMode';
import PomodoroTimer from './components/PomodoroTimer';
import CrisisSupport from './components/CrisisSupport';
import Chat from './pages/Chat';
import DataExport from './components/DataExport';
import Store from './pages/Store';
import Recommendations from './pages/Recommendations';
import Layout from './components/Layout'; // Assuming Layout is a component that needs to be imported
import ProfileCompleteRoute from './components/ProfileCompleteRoute';

// New game imports
import MindfulWalk from './components/MindfulWalk';
import EmotionWheel from './components/EmotionWheel';
import GratitudeJar from './components/GratitudeJar';
import ProgressTracker from './components/ProgressTracker';
import MoodQuiz from './components/MoodQuiz';
import PuzzleRelax from './components/PuzzleRelax';
import ColorTherapy from './components/ColorTherapy';
import RandomActs from './components/RandomActs';
import GoalBuilder from './components/GoalBuilder';
import SleepStories from './components/SleepStories';
import PositiveAffirmations from './components/PositiveAffirmations';

// Protected Route Component
const PrivateRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

// Profile Page Wrapper to handle setup mode and close modal
import { useNavigate } from 'react-router-dom';
const ProfilePageWrapper = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSetup = searchParams.get('setup') === 'true';
  const handleSetupComplete = () => {
    navigate('/profile');
  };
  return <Profile isInitialSetup={isSetup} onSetupComplete={handleSetupComplete} />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* Profile setup - accessible even if incomplete */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePageWrapper />
              </PrivateRoute>
            }
          />

          {/* Dashboard - requires complete profile */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <ProfileCompleteRoute>
                  <Dashboard />
                </ProfileCompleteRoute>
              </PrivateRoute>
            }
          />

          {/* All other routes require complete profile */}
          <Route path="/games" element={<PrivateRoute><ProfileCompleteRoute><GameHub /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/stress-popper" element={<PrivateRoute><ProfileCompleteRoute><Layout><StressGame /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/focus-flow" element={<PrivateRoute><ProfileCompleteRoute><Layout><FocusFlow /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/memory-match" element={<PrivateRoute><ProfileCompleteRoute><Layout><MemoryMatch /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/breathing" element={<PrivateRoute><ProfileCompleteRoute><Layout><BreathingExercise /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/thought-sorter" element={<PrivateRoute><ProfileCompleteRoute><Layout><ThoughtSorter /></Layout></ProfileCompleteRoute></PrivateRoute>} />

          {/* New Game Routes */}
          <Route path="/games/mindful-walk" element={<PrivateRoute><ProfileCompleteRoute><Layout><MindfulWalk /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/emotion-wheel" element={<PrivateRoute><ProfileCompleteRoute><Layout><EmotionWheel /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/gratitude-jar" element={<PrivateRoute><ProfileCompleteRoute><Layout><GratitudeJar /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/progress-tracker" element={<PrivateRoute><ProfileCompleteRoute><Layout><ProgressTracker /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/mood-quiz" element={<PrivateRoute><ProfileCompleteRoute><Layout><MoodQuiz /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/puzzle-relax" element={<PrivateRoute><ProfileCompleteRoute><Layout><PuzzleRelax /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/color-therapy" element={<PrivateRoute><ProfileCompleteRoute><Layout><ColorTherapy /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/random-acts" element={<PrivateRoute><ProfileCompleteRoute><Layout><RandomActs /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/goal-builder" element={<PrivateRoute><ProfileCompleteRoute><Layout><GoalBuilder /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/sleep-story" element={<PrivateRoute><ProfileCompleteRoute><Layout><SleepStories /></Layout></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/games/affirmations" element={<PrivateRoute><ProfileCompleteRoute><Layout><PositiveAffirmations /></Layout></ProfileCompleteRoute></PrivateRoute>} />

          <Route path="/tools/pomodoro" element={<PrivateRoute><ProfileCompleteRoute><PomodoroTimer /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/zen" element={<PrivateRoute><ProfileCompleteRoute><ZenMode /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/help" element={<PrivateRoute><ProfileCompleteRoute><Helpline /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/crisis" element={<PrivateRoute><ProfileCompleteRoute><CrisisSupport /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ProfileCompleteRoute><Chat /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><ProfileCompleteRoute><Analytics /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/wallet" element={<PrivateRoute><ProfileCompleteRoute><Wallet /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/store" element={<PrivateRoute><ProfileCompleteRoute><Store /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/recommendations" element={<PrivateRoute><ProfileCompleteRoute><Recommendations /></ProfileCompleteRoute></PrivateRoute>} />
          <Route path="/export" element={<PrivateRoute><ProfileCompleteRoute><DataExport /></ProfileCompleteRoute></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
