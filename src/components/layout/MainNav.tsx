
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { 
  Home, 
  FileText, 
  Vote, 
  PieChart, 
  MessageSquare, 
  Lightbulb,
  Settings
} from "lucide-react";

const MainNav = () => {
  const { user } = useAuth();
  const location = useLocation();
  
  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Legislation",
      href: "/legislation",
      icon: FileText,
    },
    {
      title: "Voting",
      href: "/voting",
      icon: Vote,
    },
    {
      title: "Budget",
      href: "/budget",
      icon: PieChart,
    },
    {
      title: "Feedback",
      href: "/feedback",
      icon: MessageSquare,
    },
    {
      title: "Initiatives",
      href: "/initiatives",
      icon: Lightbulb,
    }
  ];

  // Create a new array with admin link for authenticated users
  const displayNavItems = [...navItems];
  
  // Only show Admin link for authenticated users with admin role
  if (user && user.role === "admin") {
    displayNavItems.push({
      title: "Admin",
      href: "/admin",
      icon: Settings,
    });
  }

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {displayNavItems.map((item) => {
        const isActive = location.pathname === item.href || 
                         (item.href !== '/' && location.pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center text-sm font-medium transition-colors hover:text-primary ${
              isActive
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 mr-2" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;
