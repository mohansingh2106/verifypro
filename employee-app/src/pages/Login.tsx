// src/pages/login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Shield, Eye, EyeOff, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "@/lib/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    uid: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Authenticate employee
      const res = await API.post("/login", {
        uid: formData.uid,
        password: formData.password,
      });

      if (res.data && res.data.success) {
        localStorage.setItem("verifypro_uid", formData.uid);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${res.data.employee.full_name}`,
        });
        navigate("/home");
      } else {
        toast({
          title: "Login failed",
          description: res.data?.message || "Invalid UID or password",
          variant: "destructive",
        });
      }

    } catch (err: any) {
      console.error("Login error:", err);
      toast({ title: "Login failed", description: err?.response?.data?.error || "Server error", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    toast({
      title: "Guest Access Granted",
      description: "You now have read-only access to employee profiles.",
    });
    // For guest, we can clear any stored uid
    localStorage.removeItem("verifypro_uid");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* header and UI same as before */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              VerifyPro
            </h1>
            <p className="text-muted-foreground mt-2">Professional Employee Verification Platform</p>
          </div>
        </div>

        <Card className="border-border/50 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <p className="text-center text-muted-foreground">Sign in to your employee account</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="uid">Employee UID</Label>
                <Input id="uid" placeholder="EMP000123" value={formData.uid}
                  onChange={(e) => setFormData({ ...formData, uid: e.target.value })} className="bg-muted/30" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password (optional)</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password"
                    value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-muted/30 pr-10" />
                  <Button type="button" variant="ghost" size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary-hover" disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button variant="outline" onClick={handleGuestLogin} className="w-full border-primary/20 hover:bg-primary/10">
              <Users className="h-4 w-4 mr-2" />
              Continue as Guest
            </Button>

            <div className="text-center space-y-2">
              <Button variant="link" className="text-sm text-muted-foreground">Forgot your password?</Button>
              <div className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate("/register")}>Register here</Button>
              </div>
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

export default Login;
