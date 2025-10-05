// src/pages/register.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Shield, Eye, EyeOff, UserPlus, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          dateOfBirth: formData.dateOfBirth,
          address: formData.address,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast({
          title: "Registration Successful!",
          description: `Your Employee UID is: ${data.employee_uid}. Please save it for login.`,
        });

        // redirect to login page automatically after success
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast({
          title: "Error",
          description: data.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Server Error",
        description: "Unable to connect to backend.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    
    }
  };

    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-lg space-y-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VerifyPro
              </h1>
              <p className="text-muted-foreground mt-2">Join our verified professional network</p>
            </div>
          </div>

          <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
                <UserPlus className="h-6 w-6" />
                Create Account
              </CardTitle>
              <p className="text-center text-muted-foreground">Register as a verified employee</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input id="fullName" placeholder="John Doe" value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="bg-muted/30" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-muted/30" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"}
                      placeholder="Create a secure password" value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="bg-muted/30 pr-10" required />
                    <Button type="button" variant="ghost" size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password" value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="bg-muted/30 pr-10" required />
                    <Button type="button" variant="ghost" size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <div className="relative">
                    <Input id="dateOfBirth" type="date" value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} className="bg-muted/30" required />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea id="address" placeholder="Enter your complete address" value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="bg-muted/30 min-h-[80px]" required />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate("/login")}>
                  Sign in here
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-muted-foreground">
            © 2024 VerifyPro. Secure employee verification platform.
          </div>
        </div>
      </div>
    );
  };

  export default Register;
