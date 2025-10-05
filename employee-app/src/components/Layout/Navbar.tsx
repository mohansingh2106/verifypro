import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Bell, Settings, LogOut, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
  user?: {
    name?: string;
    fullName?: string;
    full_name?: string;
    uid?: string;
    employee_uid?: string; // support backend variations
    avatar?: string;
    verified?: boolean;
    available?: boolean;
  };
  onLogout?: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear both UID and full user object (if stored)
    localStorage.removeItem("verifypro_uid");
    localStorage.removeItem("verifypro_user");
    if (onLogout) onLogout();
    navigate("/login");
  };

  // Robust display name (try multiple fields)
  const displayName =
    user?.name || user?.fullName || user?.full_name || user?.uid || user?.employee_uid || "User";

  const uid = user?.uid || user?.employee_uid || "";

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <span
                className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent cursor-pointer"
                onClick={() => navigate("/home")}
              >
                VerifyPro
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search employees, companies, skills..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {/* clicking name opens own profile */}
                      <button
                        onClick={() => navigate("/profile")}
                        className="text-sm font-medium hover:underline focus:outline-none"
                        title="Open my profile"
                      >
                        {displayName}
                      </button>

                      {/* verified / available badges */}
                      {user.verified && (
                        <Badge
                          variant="outline"
                          className="bg-success/10 text-success border-success/20"
                        >
                          Verified
                        </Badge>
                      )}

                      {user.available && (
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          Available
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{uid}</p>
                  </div>

                  {/* clickable avatar */}
                  <button
                    onClick={() => navigate("/profile")}
                    title="Open my profile"
                    className="rounded-full focus:outline-none"
                  >
                    <Avatar className="h-8 w-8 cursor-pointer">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={displayName} />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Login</Button>
                <Button size="sm" onClick={() => navigate("/register")}>Register</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
