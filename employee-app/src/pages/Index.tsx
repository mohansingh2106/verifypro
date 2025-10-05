import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-8">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            
            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  VerifyPro
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Professional Employee Verification Platform
              </p>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with verified professionals, showcase your work history, and generate beautiful resumes with our KYC-verified platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary-hover text-lg px-8"
                onClick={() => navigate('/register')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="text-lg px-8 border-primary/20 hover:bg-primary/10"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Why Choose VerifyPro?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Built for professionals who value trust, verification, and seamless networking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center bg-card/50 border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-success/10 rounded-full mx-auto mb-4">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <CardTitle>Verified Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                CNIC and selfie verification ensures authentic professional profiles with trust badges.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/50 border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Professional Network</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with verified employees, search by skills, and discover professional opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center bg-card/50 border-border/50 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-full mx-auto mb-4">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <CardTitle>Resume Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Generate beautiful PDF resumes from your verified work history and professional data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                VerifyPro
              </span>
            </div>
            <p className="text-muted-foreground">
              © 2024 VerifyPro. Secure employee verification platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
