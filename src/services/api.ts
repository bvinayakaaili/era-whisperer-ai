export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  era: number;
}

export interface GenerateRequest {
  text: string;
  era: number;
}

export interface GenerateResponse {
  imageUrl: string;
  era: number;
  prompt: string;
}

export interface EditResponse {
  imageUrl: string;
}

export interface BlendResponse {
  imageUrl: string;
}

class ApiService {
  private baseUrl = '/api';

  async generateImage(request: GenerateRequest): Promise<GenerateResponse> {
    const response = await fetch(`${this.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    return response.json();
  }

  async generateMultipleImages(text: string): Promise<GeneratedImage[]> {
    const eras = [1900, 1950, 2000, 2050];
    
    const promises = eras.map(async (era) => {
      try {
        const result = await this.generateImage({ text, era });
        return {
          id: Date.now().toString() + era,
          url: result.imageUrl,
          prompt: result.prompt,
          era: result.era,
        };
      } catch (error) {
        console.error(`Failed to generate image for ${era}s:`, error);
        // Return a placeholder or skip this era
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((result): result is GeneratedImage => result !== null);
  }

  async editImage(imageFile: File, instruction: string): Promise<EditResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('instruction', instruction);

    const response = await fetch(`${this.baseUrl}/edit`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to edit image');
    }

    return response.json();
  }

  async blendImages(imageFiles: File[], instruction: string): Promise<BlendResponse> {
    const formData = new FormData();
    
    imageFiles.forEach((file, index) => {
      formData.append('images', file);
    });
    
    formData.append('instruction', instruction);

    const response = await fetch(`${this.baseUrl}/blend`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to blend images');
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string }> {
    const response = await fetch('/health');
    return response.json();
  }
}

export const apiService = new ApiService();