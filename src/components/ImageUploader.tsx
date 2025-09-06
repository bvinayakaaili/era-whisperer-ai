import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Edit3, Blend } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiService } from '@/services/api';
import LoadingSpinner from '@/components/LoadingSpinner';

interface ImageUploaderProps {
  mode: 'edit' | 'blend';
  onImageGenerated: (imageUrl: string) => void;
  onClose: () => void;
}

const ImageUploader = ({ mode, onImageGenerated, onClose }: ImageUploaderProps) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const maxFiles = mode === 'edit' ? 1 : 3;
  const minFiles = mode === 'edit' ? 1 : 2;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload up to ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'} for ${mode}ing`,
        variant: "destructive"
      });
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not an image file`,
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > 15 * 1024 * 1024) { // 15MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 15MB limit`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, maxFiles));
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (selectedFiles.length < minFiles) {
      toast({
        title: "Not enough files",
        description: `Please select at least ${minFiles} ${minFiles === 1 ? 'file' : 'files'}`,
        variant: "destructive"
      });
      return;
    }

    if (!instruction.trim()) {
      toast({
        title: "Instruction required",
        description: `Please provide instructions for ${mode}ing the ${selectedFiles.length === 1 ? 'image' : 'images'}`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      let result;
      
      if (mode === 'edit') {
        result = await apiService.editImage(selectedFiles[0], instruction);
      } else {
        result = await apiService.blendImages(selectedFiles, instruction);
      }

      onImageGenerated(result.imageUrl);
      
      toast({
        title: `${mode === 'edit' ? 'Edit' : 'Blend'} Complete!`,
        description: `Successfully ${mode === 'edit' ? 'edited' : 'blended'} your ${selectedFiles.length === 1 ? 'image' : 'images'}`,
      });

      onClose();
    } catch (error) {
      toast({
        title: `${mode === 'edit' ? 'Edit' : 'Blend'} Failed`,
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 bg-card/95 border-card-border backdrop-blur-sm shadow-card-cosmic">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {mode === 'edit' ? (
              <Edit3 className="w-6 h-6 text-primary" />
            ) : (
              <Blend className="w-6 h-6 text-secondary" />
            )}
            <h3 className="text-xl font-bold">
              {mode === 'edit' ? 'Edit Image' : 'Blend Images'}
            </h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className="border-2 border-dashed border-border hover:border-primary/50 rounded-lg p-8 text-center cursor-pointer transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto text-foreground-muted mb-4" />
            <p className="text-foreground-muted mb-2">
              Click to upload {mode === 'edit' ? 'an image' : '2-3 images'}
            </p>
            <p className="text-sm text-foreground-muted">
              PNG, JPG up to 15MB each
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple={mode === 'blend'}
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected files:</p>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center">
                      <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-foreground-muted">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Instruction Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {mode === 'edit' ? 'Edit' : 'Blend'} Instructions
            </label>
            <Textarea
              placeholder={
                mode === 'edit'
                  ? "Describe how you want to edit the image (e.g., 'Add a sunset background', 'Change to night time', 'Add flying cars')"
                  : "Describe how you want to blend the images (e.g., 'Combine the architecture from the first image with the landscape from the second')"
              }
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="min-h-[100px] bg-input border-input-border focus:border-primary/50 resize-none"
            />
          </div>

          {/* Action Button */}
          <Button
            onClick={handleProcess}
            disabled={isProcessing || selectedFiles.length < minFiles || !instruction.trim()}
            className="w-full h-12"
            variant={mode === 'edit' ? 'default' : 'secondary'}
          >
            {isProcessing ? (
              <LoadingSpinner 
                message={`${mode === 'edit' ? 'Editing' : 'Blending'} images...`} 
                size="sm" 
              />
            ) : (
              <>
                {mode === 'edit' ? (
                  <Edit3 className="w-5 h-5 mr-2" />
                ) : (
                  <Blend className="w-5 h-5 mr-2" />
                )}
                {mode === 'edit' ? 'Edit Image' : 'Blend Images'}
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ImageUploader;