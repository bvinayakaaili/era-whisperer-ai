import React, { useState } from 'react';
import Header from '@/components/Header';
import EraSlider from '@/components/EraSlider';
import ImageGenerator from '@/components/ImageGenerator';
import ImageGallery from '@/components/ImageGallery';
import ImageUploader from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Edit3, Blend, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';
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
  const [multiGenPrompt, setMultiGenPrompt] = useState('');
  const [isGeneratingMultiple, setIsGeneratingMultiple] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [uploaderMode, setUploaderMode] = useState<'edit' | 'blend'>('edit');
  const { toast } = useToast();

  const handleImageGenerated = (image: GeneratedImage) => {
    setImages(prev => [image, ...prev]);
  };

  const handleGenerateMultiple = async () => {
    if (!multiGenPrompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what you'd like to see across different eras",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingMultiple(true);
    
    try {
      const generatedImages = await apiService.generateMultipleImages(multiGenPrompt);
      setImages(prev => [...generatedImages, ...prev]);
      setMultiGenPrompt('');
      
      toast({
        title: "Images Generated!",
        description: `Created ${generatedImages.length} stunning images across different eras`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unable to create images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingMultiple(false);
    }
  };

  const handleEditImage = (image: GeneratedImage) => {
    setUploaderMode('edit');
    setShowImageUploader(true);
  };

  const handleBlendImage = (image: GeneratedImage) => {
    setUploaderMode('blend');
    setShowImageUploader(true);
  };

  const handleImageProcessed = (imageUrl: string) => {
    const processedImage: GeneratedImage = {
      id: Date.now().toString(),
      url: imageUrl,
      prompt: `${uploaderMode === 'edit' ? 'Edited' : 'Blended'} image`,
      era: selectedEra,
    };
    
    setImages(prev => [processedImage, ...prev]);
    setShowImageUploader(false);
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
          {/* Multi-Era Generation */}
          <div className="mb-12">
            <Card className="p-8 bg-card/50 border-card-border backdrop-blur-sm shadow-card-cosmic">
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold bg-cosmic bg-clip-text text-transparent">
                    Multi-Era Generator
                  </h3>
                  <p className="text-foreground-muted">
                    Generate images across all eras (1900s, 1950s, 2000s, 2050s) simultaneously
                  </p>
                </div>

                <div className="space-y-4">
                  <Textarea
                    placeholder="Describe your vision that will be adapted to each era... (e.g., 'A bustling marketplace', 'Transportation hub', 'City skyline')"
                    value={multiGenPrompt}
                    onChange={(e) => setMultiGenPrompt(e.target.value)}
                    className="min-h-[120px] bg-input border-input-border focus:border-primary/50 resize-none"
                  />

                  <Button
                    onClick={handleGenerateMultiple}
                    disabled={isGeneratingMultiple || !multiGenPrompt.trim()}
                    className="w-full h-12 bg-gradient-cosmic hover:shadow-cosmic text-primary-foreground font-medium"
                  >
                    {isGeneratingMultiple ? (
                      <LoadingSpinner message="Generating Across All Eras..." size="sm" />
                    ) : (
                      <>
                        <Wand2 className="w-5 h-5 mr-2" />
                        Generate 4 Era Images
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Single Era Generation */}
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

          {/* Edit/Blend Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => {
                setUploaderMode('edit');
                setShowImageUploader(true);
              }}
              variant="outline"
              className="h-12 px-6"
            >
              <Edit3 className="w-5 h-5 mr-2" />
              Edit Images
            </Button>
            <Button
              onClick={() => {
                setUploaderMode('blend');
                setShowImageUploader(true);
              }}
              variant="secondary"
              className="h-12 px-6"
            >
              <Blend className="w-5 h-5 mr-2" />
              Blend Images
            </Button>
          </div>

          {/* Image Uploader Modal */}
          {showImageUploader && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="w-full max-w-2xl">
                <ImageUploader
                  mode={uploaderMode}
                  onImageGenerated={handleImageProcessed}
                  onClose={() => setShowImageUploader(false)}
                />
              </div>
            </div>
          )}

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
