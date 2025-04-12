import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      
      try {
        // Check for demo user first
        const demoUser = localStorage.getItem('civicnow_demo_user');
        const demoSession = localStorage.getItem('civicnow_demo_session');
        
        if (demoUser && demoSession) {
          console.log("Demo user found, using demo session");
          setUser(JSON.parse(demoUser) as User);
          setSession(JSON.parse(demoSession) as Session);
          setIsLoading(false);
          return;
        }
        
        // Otherwise get the current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const handleAuthChange = (event: string, session: Session | null) => {
      console.log(`Supabase auth event: ${event}`);
      
      // If signing out, also check if we need to clear demo user
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('civicnow_demo_user');
        localStorage.removeItem('civicnow_demo_session');
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    // Set up auth state listener for Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Also listen for storage changes (for demo user)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'civicnow_demo_user' || e.key === 'civicnow_demo_session') {
        fetchSession();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);

    // Cleanup subscriptions
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value = {
    session,
    user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
