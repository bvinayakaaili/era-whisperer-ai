import React, { useState } from 'react';
import Header from '@/components/Header';
import EraSlider from '@/components/EraSlider';
import ImageGenerator from '@/components/ImageGenerator';
import ImageGallery from '@/components/ImageGallery';
import { useToast } from '@/hooks/use-toast';
import heroImage from '@/assets/hero-cosmic-portal.jpg';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  era: number;
}

const Index = () => {
  const [selectedEra, setSelectedEra] = useState(2024);
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const { toast } = useToast();

  const handleImageGenerated = (image: GeneratedImage) => {
    setImages(prev => [image, ...prev]);
  };

  const handleEditImage = (image: GeneratedImage) => {
    toast({
      title: "Edit Mode",
      description: `Edit feature for ${image.era}s image coming soon!`,
    });
  };

  const handleBlendImage = (image: GeneratedImage) => {
    toast({
      title: "Blend Mode", 
      description: `Blend feature for ${image.era}s image coming soon!`,
    });
  };

  const handleDeleteImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast({
      title: "Image Deleted",
      description: "Image removed from your gallery",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="relative">
        {/* Hero Section with Background */}
        <div 
          className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `linear-gradient(rgba(34, 38, 47, 0.85), rgba(34, 38, 47, 0.85)), url(${heroImage})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-nebula" />
          
          <div className="relative z-10 container mx-auto px-6 text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-bold">
                <span className="bg-cosmic bg-clip-text text-transparent">
                  Journey Through
                </span>
                <br />
                <span className="bg-time bg-clip-text text-transparent">
                  Time & Imagination
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto leading-relaxed">
                Create, edit, and blend stunning AI-generated artwork from any era in human history. 
                From the Industrial Revolution to the far future beyond 2500.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-32 h-1 bg-gradient-cosmic rounded-full animate-cosmic-pulse" />
            </div>
          </div>
        </div>

        {/* Generation Interface */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <EraSlider 
              value={selectedEra}
              onChange={setSelectedEra}
            />
            <ImageGenerator 
              selectedEra={selectedEra}
              onImageGenerated={handleImageGenerated}
            />
          </div>

          {/* Gallery */}
          <ImageGallery 
            images={images}
            onEdit={handleEditImage}
            onBlend={handleBlendImage}
            onDelete={handleDeleteImage}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
