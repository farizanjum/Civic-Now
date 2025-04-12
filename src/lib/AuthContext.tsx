
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { signIn, signOut, getCurrentUser } from "./auth";

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
  email: "demo@example.com",
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
            name: currentUser.user_metadata?.full_name,
            role: currentUser.app_metadata?.role || "user"
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
      if (email === "demo@example.com" && password === "password") {
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
      const result = await signIn(email, password);
      if (result.user) {
        const userData = {
          id: result.user.id,
          email: result.user.email || "",
          name: result.user.user_metadata?.full_name,
          role: result.user.app_metadata?.role || "user"
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
      // In a demo app, we'll just pretend to create an account
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
