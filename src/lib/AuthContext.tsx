import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { signIn, signUp, signOut, getCurrentUser, DEMO_CREDENTIALS } from "./auth";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, callback?: () => void) => Promise<void>;
  signup: (email: string, password: string, name: string, callback?: () => void) => Promise<void>;
  logout: (callback?: () => void) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user for testing
const DEMO_USER: User = {
  id: "demo-user-1",
  email: DEMO_CREDENTIALS.email,
  name: "Demo User",
  role: "admin"
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on initial load
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // Check localStorage first for demo user
        const storedUser = localStorage.getItem("civicnow_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        }
        
        // Then try to get user from auth system
        const currentUser = await getCurrentUser();
        if (currentUser) {
          const userData = {
            id: currentUser.id,
            email: currentUser.email || "",
            name: currentUser.name,
            role: currentUser.role || "user"
          };
          setUser(userData);
          // Store in localStorage for persistence
          localStorage.setItem("civicnow_user", JSON.stringify(userData));
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string, callback?: () => void) => {
    setLoading(true);
    try {
      // For demo purposes, we'll use hardcoded credentials
      if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
        // Store in localStorage
        localStorage.setItem("civicnow_user", JSON.stringify(DEMO_USER));
        setUser(DEMO_USER);
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        if (callback) callback();
        return;
      }
      
      // Normal login with auth system
      const result = await signIn({ email, password });
      if (result.user) {
        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', result.user.id)
          .single();
          
        const userData = {
          id: result.user.id,
          email: result.user.email || "",
          name: profile?.name || result.user.user_metadata?.name,
          role: profile?.role || "user"
        };
        
        setUser(userData);
        localStorage.setItem("civicnow_user", JSON.stringify(userData));
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        if (callback) callback();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, callback?: () => void) => {
    setLoading(true);
    try {
      await signUp({ email, password, name });
      
      toast({
        title: "Account created",
        description: "Please login with your new account",
      });
      
      if (callback) callback();
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: "Could not create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async (callback?: () => void) => {
    try {
      await signOut();
      localStorage.removeItem("civicnow_user");
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      if (callback) callback();
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if signOut fails
      localStorage.removeItem("civicnow_user");
      setUser(null);
      if (callback) callback();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
