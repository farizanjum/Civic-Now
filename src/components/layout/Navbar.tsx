import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, UserCircle, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { signOut } from "@/lib/auth";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await logout(() => {
      navigate('/login');
    });
  };

  return (
    <nav className="bg-background border-b border-border py-4">
      <div className="civic-container">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-civic-blue flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-display font-bold text-civic-blue">CivicNow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/legislation" className="nav-link">Legislation</Link>
            <Link to="/voting" className="nav-link">Community Voting</Link>
            <Link to="/initiatives" className="nav-link">Initiatives</Link>
            <Link to="/budget" className="nav-link">Civic Impact</Link>
            <Link to="/feedback" className="nav-link">Feedback</Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <UserCircle size={18} />
                      <span>{user.email?.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-500">
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Link to="/admin">
                  <Button size="sm" className="bg-civic-blue hover:bg-civic-blue-dark">Admin Panel</Button>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <UserCircle size={18} />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-3">
              <Link to="/legislation" className="nav-link py-2 px-3 rounded hover:bg-accent" onClick={() => setIsOpen(false)}>
                Legislation
              </Link>
              <Link to="/voting" className="nav-link py-2 px-3 rounded hover:bg-accent" onClick={() => setIsOpen(false)}>
                Community Voting
              </Link>
              <Link to="/initiatives" className="nav-link py-2 px-3 rounded hover:bg-accent" onClick={() => setIsOpen(false)}>
                Initiatives
              </Link>
              <Link to="/budget" className="nav-link py-2 px-3 rounded hover:bg-accent" onClick={() => setIsOpen(false)}>
                Civic Impact
              </Link>
              <Link to="/feedback" className="nav-link py-2 px-3 rounded hover:bg-accent" onClick={() => setIsOpen(false)}>
                Feedback
              </Link>
              {user && (
                <Link to="/admin" className="nav-link py-2 px-3 rounded hover:bg-accent" onClick={() => setIsOpen(false)}>
                  Admin Panel
                </Link>
              )}
              <hr className="border-border" />
              <div className="flex space-x-2 pt-2">
                {user ? (
                  <Button onClick={handleSignOut} variant="outline" className="w-full text-red-500">
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link to="/login" className="flex-1">
                      <Button variant="outline" className="w-full">Sign In</Button>
                    </Link>
                    <Link to="/signup" className="flex-1">
                      <Button className="w-full bg-civic-blue hover:bg-civic-blue-dark">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
