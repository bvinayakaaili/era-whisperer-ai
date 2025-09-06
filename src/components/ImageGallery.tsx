import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit3, Blend, Download, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  era: number;
}

interface ImageGalleryProps {
  images: GeneratedImage[];
  onEdit: (image: GeneratedImage) => void;
  onBlend: (image: GeneratedImage) => void;
  onDelete: (id: string) => void;
}

const ImageGallery = ({ images, onEdit, onBlend, onDelete }: ImageGalleryProps) => {
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDownload = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `era-whisperer-${image.era}s-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Complete",
        description: "Image saved to your downloads folder",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download image",
        variant: "destructive"
      });
    }
  };

  if (images.length === 0) {
    return (
      <Card className="p-12 bg-card/30 border-card-border backdrop-blur-sm shadow-card-cosmic">
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto bg-gradient-cosmic rounded-full flex items-center justify-center opacity-50">
            <Edit3 className="w-12 h-12 text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground-muted">
            Your Time Gallery Awaits
          </h3>
          <p className="text-foreground-muted">
            Generate your first era-specific image to begin your journey through time
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold bg-cosmic bg-clip-text text-transparent">
          Time Gallery
        </h3>
        <p className="text-foreground-muted">
          {images.length} {images.length === 1 ? 'creation' : 'creations'} from across the ages
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <Card
            key={image.id}
            className="group overflow-hidden bg-card/50 border-card-border backdrop-blur-sm shadow-card-cosmic hover:shadow-cosmic transition-all duration-300"
            onMouseEnter={() => setHoveredImage(image.id)}
            onMouseLeave={() => setHoveredImage(null)}
          >
            <div className="relative aspect-square">
              <img
                src={image.url}
                alt={image.prompt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              
              {/* Era Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-primary/90 text-primary-foreground rounded-full text-sm font-medium backdrop-blur-sm">
                {image.era}s
              </div>

              {/* Action Overlay */}
              <div className={`absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-2 transition-opacity duration-300 ${
                hoveredImage === image.id ? 'opacity-100' : 'opacity-0'
              }`}>
                <Button
                  size="sm"
                  onClick={() => onEdit(image)}
                  className="bg-accent/90 hover:bg-accent text-accent-foreground"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => onBlend(image)}
                  className="bg-secondary/90 hover:bg-secondary text-secondary-foreground"
                >
                  <Blend className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleDownload(image)}
                  className="bg-primary/90 hover:bg-primary text-primary-foreground"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(image.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-foreground-muted line-clamp-2">
                {image.prompt}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;