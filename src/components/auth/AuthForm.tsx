
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AtSign, Lock, UserPlus, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      toast({
        title: "Sign In Successful",
        description: "Welcome back to CivicNow!"
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account Created",
        description: "Please check your email to confirm your account."
      });
      
      // Switch to login tab
      setActiveTab("login");
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "There was a problem creating your account.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <Card className="drop-shadow-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display text-civic-blue">
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </CardTitle>
          <CardDescription>
            {activeTab === "login" 
              ? "Welcome back! Sign in to continue your civic journey."
              : "Join CivicNow to engage with your local democracy."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="flex items-center justify-center gap-2">
                <LogIn size={16} />
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="flex items-center justify-center gap-2">
                <UserPlus size={16} />
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <AtSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray" />
                    <Input 
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <a href="#" className="text-xs text-civic-blue hover:underline">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray" />
                    <Input 
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-civic-blue hover:bg-civic-blue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <AtSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray" />
                    <Input 
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Create Password</Label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-civic-gray" />
                    <Input 
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-civic-gray-dark mt-1">
                    Password must be at least 8 characters long.
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-civic-blue hover:bg-civic-blue-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-civic-gray-dark">
          By continuing, you agree to CivicNow's{" "}
          <a href="/terms" className="text-civic-blue hover:underline mx-1">Terms of Service</a>
          and
          <a href="/privacy" className="text-civic-blue hover:underline ml-1">Privacy Policy</a>.
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
