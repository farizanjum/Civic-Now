import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export type AuthError = {
  message: string;
};

// Hardcoded credentials for quick login (for demo/hackathon purposes)
export const DEMO_CREDENTIALS = {
  email: "demo@civicnow.dev",
  password: "demo123456"
};

/**
 * Sign in a user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Object containing user data or error
 */
export const signIn = async (email: string, password: string) => {
  try {
    console.info("Login attempt with:", { email });
    
    // For demo purposes: If using demo credentials, bypass Supabase authentication
    if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
      console.log("Using demo credentials - bypassing Supabase auth");
      
      // Create a mock user/session for demo purposes
      const mockUser = {
        id: 'demo-user-id',
        email: DEMO_CREDENTIALS.email,
        user_metadata: {
          full_name: 'Demo User',
        },
        app_metadata: {
          role: 'admin' // Give admin role for full access
        }
      };
      
      const mockSession = {
        access_token: 'demo-token',
        refresh_token: 'demo-refresh-token',
        user: mockUser
      };
      
      toast({
        title: "Welcome to Demo Mode!",
        description: "You've successfully signed in with demo credentials.",
      });
      
      // Store mock session in localStorage to simulate persistent auth
      localStorage.setItem('civicnow_demo_user', JSON.stringify(mockUser));
      localStorage.setItem('civicnow_demo_session', JSON.stringify(mockSession));
      
      return { user: mockUser, session: mockSession };
    }
    
    // Normal authentication flow with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Authentication Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Welcome Back!",
      description: "You've successfully signed in to CivicNow.",
    });

    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Sign-in error:", error);
    toast({
      title: "Sign-in Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { error: { message: error.message || "Failed to sign in" } };
  }
};

/**
 * Sign up a new user with email and password
 * @param email User's email address
 * @param password User's password
 * @returns Object containing user data or error
 */
export const signUp = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Account Created",
      description: "Please check your email to verify your account.",
    });

    return { user: data.user, session: data.session };
  } catch (error: any) {
    console.error("Sign-up error:", error);
    toast({
      title: "Sign-up Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { error: { message: error.message || "Failed to sign up" } };
  }
};

/**
 * Sign out the current user
 * @returns Object indicating success or error
 */
export const signOut = async () => {
  try {
    // Check if user is demo user first
    if (localStorage.getItem('civicnow_demo_user')) {
      // Clear demo user data
      localStorage.removeItem('civicnow_demo_user');
      localStorage.removeItem('civicnow_demo_session');
      
      toast({
        title: "Signed Out",
        description: "You've been successfully signed out of demo mode.",
      });
      
      return { success: true };
    }
    
    // Regular sign out with Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Sign Out Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Signed Out",
      description: "You've been successfully signed out.",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Sign-out error:", error);
    toast({
      title: "Sign-out Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { error: { message: error.message || "Failed to sign out" } };
  }
};

/**
 * Get the current user session
 * @returns Current user session or null
 */
export const getCurrentSession = async () => {
  try {
    // Check for demo session first
    const demoSession = localStorage.getItem('civicnow_demo_session');
    if (demoSession) {
      return JSON.parse(demoSession);
    }
    
    // Otherwise use Supabase
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Get session error:", error);
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.error("Get session error:", error);
    return null;
  }
};

/**
 * Get the current user
 * @returns Current user or null
 */
export const getCurrentUser = async () => {
  try {
    // Check for demo user first
    const demoUser = localStorage.getItem('civicnow_demo_user');
    if (demoUser) {
      return JSON.parse(demoUser);
    }
    
    // Otherwise use Supabase
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error("Get user error:", error);
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error("Get user error:", error);
    return null;
  }
};

/**
 * Reset password for a user
 * @param email User's email address
 * @returns Object indicating success or error
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    
    if (error) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Password Reset Email Sent",
      description: "Check your email for a password reset link.",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Password reset error:", error);
    toast({
      title: "Password Reset Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { error: { message: error.message || "Failed to send password reset email" } };
  }
};

/**
 * Update password for the current user
 * @param newPassword New password
 * @returns Object indicating success or error
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      toast({
        title: "Password Update Failed",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }

    toast({
      title: "Password Updated",
      description: "Your password has been successfully updated.",
    });

    return { success: true };
  } catch (error: any) {
    console.error("Password update error:", error);
    toast({
      title: "Password Update Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
    return { error: { message: error.message || "Failed to update password" } };
  }
};
