import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import SymptomScreen from './screens/SymptomScreen';
import ResultsScreen from './screens/ResultsScreen';
import ForumScreen from './screens/ForumScreen';
import RemedyScreen from './screens/RemedyScreen';
import JournalScreen from './screens/JournalScreen';
import { initializeAuth } from './services/firebaseService';

export default function App() {
  const [language, setLanguage] = useState('EN');
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Initialize Firebase anonymous auth on app load
    const initAuth = async () => {
      try {
        await initializeAuth();
        setAuthReady(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthReady(true); // Continue even if auth fails
      }
    };

    initAuth();
  }, []);

  if (!authReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-bold text-primary tracking-wide">Sahachari</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans text-text-primary">
        <Navbar language={language} setLanguage={setLanguage} />
        <main className="flex-grow pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={<ForumScreen />} />
            <Route path="/symptoms" element={<SymptomScreen />} />
            <Route path="/results" element={<ResultsScreen />} />
            <Route path="/forum" element={<ForumScreen />} />
            <Route path="/remedy" element={<RemedyScreen />} />
            <Route path="/journal" element={<JournalScreen />} />
          </Routes>
        </main>
        <div className="md:hidden">
          <BottomNav />
        </div>
      </div>
    </Router>
  );
}
