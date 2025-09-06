import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

interface EraSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const EraSlider = ({ value, onChange }: EraSliderProps) => {
  const eraLabels = {
    1800: "Industrial Revolution",
    1850: "Victorian Era", 
    1900: "Belle Époque",
    1950: "Atomic Age",
    2000: "Digital Dawn",
    2050: "Neo-Future",
    2100: "Quantum Era",
    2150: "Stellar Age",
    2200: "Cosmic Renaissance",
    2250: "Transcendent Era",
    2300: "Infinity Epoch",
    2350: "Beyond Time",
    2400: "Dimensional Shift",
    2450: "Ethereal Age",
    2500: "Singularity"
  };

  const getCurrentEra = (year: number) => {
    const nearestKey = Object.keys(eraLabels).reduce((prev, curr) => 
      Math.abs(Number(curr) - year) < Math.abs(Number(prev) - year) ? curr : prev
    );
    return eraLabels[Number(nearestKey) as keyof typeof eraLabels];
  };

  return (
    <Card className="p-8 bg-card/50 border-card-border backdrop-blur-sm shadow-card-cosmic">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold bg-cosmic bg-clip-text text-transparent">
            Time Portal
          </h3>
          <p className="text-foreground-muted">
            Navigate through the ages of humanity
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-era-glow rounded-lg opacity-30 animate-cosmic-pulse" />
            <Slider
              value={[value]}
              onValueChange={(values) => onChange(values[0])}
              min={1800}
              max={2500}
              step={50}
              className="relative z-10"
            />
          </div>

          <div className="flex justify-between text-xs text-foreground-muted">
            <span>1800s</span>
            <span>2500s</span>
          </div>

          <div className="text-center space-y-2">
            <div className="text-4xl font-bold text-primary animate-era-glow">
              {value}s
            </div>
            <div className="text-lg font-medium text-secondary">
              {getCurrentEra(value)}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EraSlider;