import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ImageGeneratorProps {
  selectedEra: number;
  onImageGenerated: (image: { id: string; url: string; prompt: string; era: number }) => void;
}

const ImageGenerator = ({ selectedEra, onImageGenerated }: ImageGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a prompt",
        description: "Describe what you'd like to see in this era",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: prompt,
          era: selectedEra
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      }

      const result = await response.json();
      
      const generatedImage = {
        id: Date.now().toString(),
        url: result.imageUrl,
        prompt: result.prompt,
        era: result.era
      };
      
      onImageGenerated(generatedImage);
      setPrompt('');
      
      toast({
        title: "Image Generated!",
        description: `Created a stunning ${selectedEra}s era image`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unable to create image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="p-8 bg-card/50 border-card-border backdrop-blur-sm shadow-card-cosmic">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold bg-time bg-clip-text text-transparent">
            Era Generator
          </h3>
          <p className="text-foreground-muted">
            Describe your vision for the {selectedEra}s
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            placeholder={`Imagine the ${selectedEra}s... A bustling city street, ancient architecture, futuristic technology, or anything you envision from this era.`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] bg-input border-input-border focus:border-primary/50 resize-none"
          />

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full h-12 bg-cosmic hover:shadow-cosmic text-primary-foreground font-medium"
          >
            {isGenerating ? (
              <LoadingSpinner message="Generating Your Vision..." size="sm" />
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate {selectedEra}s Image
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImageGenerator;