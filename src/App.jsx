import { useEffect, useState, lazy, Suspense } from 'react';
import { RouterProvider, createBrowserRouter, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import OfflineNotification from './components/OfflineNotification';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SymptomScreen from './screens/SymptomScreen';
import ResultsScreen from './screens/ResultsScreen';
import ForumScreen from './screens/ForumScreen';
import ThreadScreen from './screens/ThreadScreen';
import NewPostScreen from './screens/NewPostScreen';
import RemedyScreen from './screens/RemedyScreen';
import JournalScreen from './screens/JournalScreen';
import NearbyHelpScreen from './screens/NearbyHelpScreen';
import ModerationScreen from './screens/ModerationScreen';
import LandingScreen from './screens/LandingScreen';

// Dev-only admin screen - only imported in development
const AdminSeedScreen = import.meta.env.DEV ? lazy(() => import('./screens/AdminSeedScreen')) : null;

import { auth } from './services/firebaseService';
import { Heart, BookOpen, MessageSquare, Wind, Map, LogOut, Menu, X } from 'lucide-react';

function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Health', href: '/home', icon: Heart },
    { label: 'Community', href: '/forum', icon: MessageSquare },
    { label: 'Symptoms', href: '/symptoms', icon: Heart },
    { label: 'Remedies', href: '/remedy', icon: Wind },
    { label: 'Journal', href: '/journal', icon: BookOpen },
    { label: 'Nearby', href: '/nearby', icon: Map },
  ];

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="glass-nav px-4 md:px-6 py-4 flex items-center justify-between">
      <Link to="/home" className="flex items-center gap-2 flex-shrink-0">
        <Heart className="w-6 h-6 text-copper" />
        <span className="font-serif italic text-2xl text-copper hidden sm:inline">Sahachari</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`nav-link flex items-center gap-2 transition-all ${
                isActive(item.href) ? 'text-copper' : ''
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 nav-link hover:text-copper"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-copper"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 glass-card m-4 rounded-[12px] md:hidden">
          <div className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`nav-link flex items-center gap-2 p-2 rounded hover:bg-copper/10 ${
                    isActive(item.href) ? 'text-copper bg-copper/5' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="nav-link flex items-center gap-2 p-2 rounded hover:bg-copper/10 mt-2 border-t border-copper/20 pt-4"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

function MobileNav({ user }) {
  const location = useLocation();

  const navItems = [
    { label: 'Health', href: '/home', icon: Heart },
    { label: 'Community', href: '/forum', icon: MessageSquare },
    { label: 'Symptoms', href: '/symptoms', icon: Heart },
    { label: 'Remedies', href: '/remedy', icon: Wind },
    { label: 'Journal', href: '/journal', icon: BookOpen },
    { label: 'Nearby', href: '/nearby', icon: Map },
  ];

  const isActive = (href) => location.pathname === href || location.pathname.startsWith(href + '/');

  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 md:hidden px-2 py-3 flex items-center justify-between">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex flex-col items-center gap-1 flex-1 py-2 rounded-lg transition-all ${
              isActive(item.href)
                ? 'text-copper'
                : 'text-ivory/60 hover:text-ivory/70'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-mono">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function AppLayout({ user, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-kurobeni">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-copper/20 border-t-copper rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-serif italic text-copper">Sahachari</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-kurobeni text-ivory">
      <OfflineNotification />
      {user && <Navbar user={user} />}
      <main className="flex-grow pt-20 pb-24 md:pb-0 overflow-y-auto">
        <Outlet />
      </main>
      {user && (
        <div className="md:hidden">
          <MobileNav user={user} />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const router = createBrowserRouter(
    [
      {
        element: <AppLayout user={user} loading={loading} />,
        children: [
          { path: '/', element: !user ? <LoginScreen /> : <Navigate to="/home" /> },
          { path: '/login', element: !user ? <LoginScreen /> : <Navigate to="/home" /> },
          { path: '/home', element: user ? <ErrorBoundary><HomeScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/forum', element: user ? <ErrorBoundary><ForumScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/forum/new', element: user ? <ErrorBoundary><NewPostScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/forum/:postId', element: user ? <ErrorBoundary><ThreadScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/symptoms', element: user ? <ErrorBoundary><SymptomScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/results', element: user ? <ErrorBoundary><ResultsScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/remedy', element: user ? <ErrorBoundary><RemedyScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/journal', element: user ? <ErrorBoundary><JournalScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/nearby', element: user ? <ErrorBoundary><NearbyHelpScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          { path: '/admin/moderation', element: user ? <ErrorBoundary><ModerationScreen /></ErrorBoundary> : <Navigate to="/login" /> },
          ...(import.meta.env.DEV && AdminSeedScreen ? [{ path: '/admin-seed', element: <ErrorBoundary><Suspense fallback={<div>Loading...</div>}><AdminSeedScreen /></Suspense></ErrorBoundary> }] : []),
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

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </ThemeProvider>
  );
}
