
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Legislation from "./pages/Legislation";
import LegislationDetail from "./pages/LegislationDetail";
import Voting from "./pages/Voting";
import Budget from "./pages/Budget";
import Feedback from "./pages/Feedback";
import Initiatives from "./pages/Initiatives";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/legislation" element={<Legislation />} />
              <Route path="/legislation/:id" element={<LegislationDetail />} />
              <Route path="/voting" element={<Voting />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/initiatives" element={<Initiatives />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
