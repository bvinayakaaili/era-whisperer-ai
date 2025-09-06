import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="border-b border-card-border bg-background/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-cosmic rounded-lg blur-lg opacity-30 animate-cosmic-pulse" />
              <div className="relative w-12 h-12 bg-gradient-cosmic rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold bg-cosmic bg-clip-text text-transparent">
                Era Whisperer
              </h1>
              <p className="text-sm text-foreground-muted">
                AI-Powered Time Travel Art Generator
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 px-4 py-2 bg-card/50 rounded-full border border-card-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">
                Powered by Gemini 2.5 Flash
              </span>
            </div>
            
            <Button 
              variant="outline"
              className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
            >
              Gallery
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;