import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner = ({ message = "Generating...", size = 'md' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-cosmic rounded-full blur-sm opacity-50 animate-cosmic-pulse" />
        <Loader2 className={`${sizeClasses[size]} text-primary animate-spin relative z-10`} />
      </div>
      {message && (
        <p className="text-sm text-foreground-muted animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;