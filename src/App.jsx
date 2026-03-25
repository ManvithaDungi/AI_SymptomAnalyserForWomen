import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth'; // Import this
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import LoginScreen from './screens/LoginScreen'; // Import LoginScreen
import HomeScreen from './screens/HomeScreen';
import SymptomScreen from './screens/SymptomScreen';
import ResultsScreen from './screens/ResultsScreen';
import ForumScreen from './screens/ForumScreen';
import ThreadScreen from './screens/ThreadScreen';
import NewPostScreen from './screens/NewPostScreen';
import RemedyScreen from './screens/RemedyScreen';
import JournalScreen from './screens/JournalScreen';
import { auth } from './services/firebaseService'; // Import auth instance
import AdminSeedScreen from './screens/AdminSeedScreen';
import NearbyHelpScreen from './screens/NearbyHelpScreen';

function AppLayout({ user, language, setLanguage, loading }) {
  if (loading) {
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
    <div className="min-h-screen flex flex-col font-sans text-text-primary">
      {user && <Navbar language={language} setLanguage={setLanguage} />}
      <main className="flex-grow pb-20 md:pb-0">
        <Outlet />
      </main>
      {user && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState('EN');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const router = createBrowserRouter(
    [
      {
        element: <AppLayout user={user} language={language} setLanguage={setLanguage} loading={loading} />,
        children: [
          { path: '/', element: !user ? <LoginScreen /> : <Navigate to="/forum" /> },
          { path: '/home', element: user ? <HomeScreen /> : <Navigate to="/" /> },
          { path: '/forum', element: user ? <ForumScreen /> : <Navigate to="/" /> },
          { path: '/forum/new', element: user ? <NewPostScreen /> : <Navigate to="/" /> },
          { path: '/forum/:postId', element: user ? <ThreadScreen /> : <Navigate to="/" /> },
          { path: '/symptoms', element: user ? <SymptomScreen /> : <Navigate to="/" /> },
          { path: '/results', element: user ? <ResultsScreen /> : <Navigate to="/" /> },
          { path: '/remedy', element: user ? <RemedyScreen /> : <Navigate to="/" /> },
          { path: '/journal', element: user ? <JournalScreen /> : <Navigate to="/" /> },
          { path: '/nearby', element: user ? <NearbyHelpScreen /> : <Navigate to="/" /> },
          { path: '/admin-seed', element: <AdminSeedScreen /> },
        ]
      }
    ],
    {
      future: {
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }
    }
  );

  return <RouterProvider router={router} />;
}
