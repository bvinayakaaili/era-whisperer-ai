import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configure multer for file uploads (15MB limit)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to enhance prompts
async function enhancePrompt(originalPrompt, era) {
  if (process.env.ENHANCE_PROMPTS !== 'true') {
    return originalPrompt;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    const enhancePromptText = `Enhance this image generation prompt for the ${era}s era. Make it more detailed and era-specific while keeping the core idea: "${originalPrompt}"`;
    
    const result = await model.generateContent(enhancePromptText);
    return result.response.text();
  } catch (error) {
    console.log('Prompt enhancement failed, using original:', error.message);
    return originalPrompt;
  }
}

// Helper function to create era-aware prompt
function createEraPrompt(text, era) {
  const eraContext = {
    1900: "Industrial Revolution era with steam engines, Victorian architecture, horse-drawn carriages, gas lamps, and early photography aesthetics",
    1950: "Post-war 1950s with classic cars, diners, neon signs, suburban homes, and mid-century modern design",
    2000: "Modern early 2000s with digital technology, contemporary urban landscapes, and Y2K aesthetic",
    2050: "Futuristic 2050s with advanced technology, flying vehicles, sustainable architecture, holographic displays, and sci-fi elements"
  };
  
  return `Create a highly detailed image in the style and setting of the ${era}s. ${eraContext[era]}. The image should depict: ${text}. Ensure the styling, technology, architecture, clothing, and overall aesthetic authentically represents the ${era}s era.`;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Generate image endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { text, era } = req.body;
    
    if (!text || !era) {
      return res.status(400).json({ error: 'Text and era are required' });
    }
    
    if (![1900, 1950, 2000, 2050].includes(era)) {
      return res.status(400).json({ error: 'Era must be one of: 1900, 1950, 2000, 2050' });
    }
    
    // Create era-specific prompt
    const eraPrompt = createEraPrompt(text, era);
    const enhancedPrompt = await enhancePrompt(eraPrompt, era);
    
    // Generate image using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
    const result = await model.generateContent(enhancedPrompt);
    
    // Convert response to data URL
    const imageData = await result.response.blob();
    const buffer = await imageData.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    res.json({
      imageUrl: dataUrl,
      era,
      prompt: enhancedPrompt
    });
    
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({ 
      error: 'Failed to generate image', 
      details: error.message 
    });
  }
});

// Edit image endpoint
app.post('/api/edit', upload.single('image'), async (req, res) => {
  try {
    const { instruction } = req.body;
    const imageFile = req.file;
    
    if (!imageFile || !instruction) {
      return res.status(400).json({ error: 'Image file and instruction are required' });
    }
    
    // Convert uploaded image to base64
    const imageBase64 = imageFile.buffer.toString('base64');
    const imageMimeType = imageFile.mimetype;
    
    // Create edit prompt
    const editPrompt = `Edit this image based on the following instruction: ${instruction}. Maintain the overall composition while applying the requested changes.`;
    
    // Use Gemini to edit the image
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
    const result = await model.generateContent([
      editPrompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType,
        },
      },
    ]);
    
    // Convert response to data URL
    const imageData = await result.response.blob();
    const buffer = await imageData.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    res.json({ imageUrl: dataUrl });
    
  } catch (error) {
    console.error('Edit error:', error);
    res.status(500).json({ 
      error: 'Failed to edit image', 
      details: error.message 
    });
  }
});

// Blend images endpoint
app.post('/api/blend', upload.array('images', 3), async (req, res) => {
  try {
    const { instruction } = req.body;
    const imageFiles = req.files;
    
    if (!imageFiles || imageFiles.length < 2 || imageFiles.length > 3) {
      return res.status(400).json({ error: 'Please provide 2-3 images to blend' });
    }
    
    if (!instruction) {
      return res.status(400).json({ error: 'Instruction is required' });
    }
    
    // Prepare images for Gemini
    const imageInputs = imageFiles.map(file => ({
      inlineData: {
        data: file.buffer.toString('base64'),
        mimeType: file.mimetype,
      },
    }));
    
    // Create blend prompt
    const blendPrompt = `Blend and compose these ${imageFiles.length} images together based on this instruction: ${instruction}. Create a harmonious composition that combines elements from all provided images.`;
    
    // Use Gemini to blend the images
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image-preview' });
    const result = await model.generateContent([blendPrompt, ...imageInputs]);
    
    // Convert response to data URL
    const imageData = await result.response.blob();
    const buffer = await imageData.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    res.json({ imageUrl: dataUrl });
    
  } catch (error) {
    console.error('Blend error:', error);
    res.status(500).json({ 
      error: 'Failed to blend images', 
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 15MB.' });
    }
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Era Whisperer backend running on port ${PORT}`);
});