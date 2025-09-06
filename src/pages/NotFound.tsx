import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Clock } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="text-center p-12 bg-card/50 border-card-border backdrop-blur-sm shadow-card-cosmic max-w-md">
        <div className="space-y-6">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-cosmic rounded-full blur-lg opacity-30 animate-cosmic-pulse" />
            <div className="relative w-24 h-24 bg-gradient-cosmic rounded-full flex items-center justify-center">
              <Clock className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          
          <div className="space-y-3">
            <h1 className="text-6xl font-bold bg-cosmic bg-clip-text text-transparent">
              404
            </h1>
            <h2 className="text-2xl font-bold text-foreground">
              Lost in Time
            </h2>
            <p className="text-foreground-muted">
              This page seems to have drifted into another era. Let's get you back to the present.
            </p>
          </div>

          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-cosmic hover:shadow-cosmic text-primary-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            Return to Era Whisperer
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
