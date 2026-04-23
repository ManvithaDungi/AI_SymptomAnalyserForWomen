import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebaseService';

/**
 * useAuth - Firebase authentication state management hook
 * 
 * Wraps Firebase's onAuthStateChanged to provide reactive auth state
 * across the application.
 * 
 * @returns {Object} - { user: User | null, loading: boolean, isAdmin: boolean }
 * 
 * @example
 * const { user, loading, isAdmin } = useAuth();
 * if (loading) return <Spinner />;
 * if (!user) return <Navigate to="/login" />;
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      // Check admin role from custom claims
      if (currentUser) {
        try {
          const idTokenResult = await currentUser.getIdTokenResult();
          setIsAdmin(idTokenResult.claims.role === 'admin');
        } catch (error) {
          console.error('Error fetching custom claims:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, isAdmin };
};
