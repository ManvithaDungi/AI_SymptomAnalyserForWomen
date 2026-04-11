import { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
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
import AdminSeedScreen from './screens/AdminSeedScreen';
import SahachariJournalScreen from './screens/SahachariJournalScreen';
import SahachariCommunityScreen from './screens/SahachariCommunityScreen';
import { auth } from './services/firebaseService';
import { Heart, BookOpen, MessageSquare, Wind, BarChart3, Map, LogOut, Menu, X } from 'lucide-react';

function Navbar({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Health', href: '/home', icon: Heart },
    { label: 'Community', href: '/forum', icon: MessageSquare },
    { label: 'Symptoms', href: '/symptoms', icon: Heart },
    { label: 'Remedies', href: '/remedy', icon: Wind },
    { label: 'SA Remedies', href: '/sahachari-remedies', icon: Wind },
    { label: 'SA Community', href: '/sahachari-community', icon: MessageSquare },
    { label: 'Journal', href: '/journal', icon: BookOpen },
    { label: 'SA Journal', href: '/sahachari-journal', icon: BookOpen },
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
    { label: 'Sahachari', href: '/sahachari-home', icon: BookOpen },
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
                : 'text-ivory/40 hover:text-ivory/60'
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
          { path: '/', element: !user ? <LoginScreen /> : <Navigate to="/forum" /> },
          { path: '/home', element: user ? <ErrorBoundary><HomeScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/sahachari-community', element: user ? <ErrorBoundary><SahachariCommunityScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/sahachari-journal', element: user ? <ErrorBoundary><SahachariJournalScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/forum', element: user ? <ErrorBoundary><ForumScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/forum/new', element: user ? <ErrorBoundary><NewPostScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/forum/:postId', element: user ? <ErrorBoundary><ThreadScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/symptoms', element: user ? <ErrorBoundary><SymptomScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/results', element: user ? <ErrorBoundary><ResultsScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/remedy', element: user ? <ErrorBoundary><RemedyScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/journal', element: user ? <ErrorBoundary><JournalScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/nearby', element: user ? <ErrorBoundary><NearbyHelpScreen /></ErrorBoundary> : <Navigate to="/" /> },
          { path: '/admin-seed', element: <ErrorBoundary><AdminSeedScreen /></ErrorBoundary> },
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
