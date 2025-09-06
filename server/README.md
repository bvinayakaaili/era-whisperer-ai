# Era Whisperer Backend

Express.js backend for AI-powered era-specific image generation using Google Gemini.

## Quick Setup

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Add your GEMINI_API_KEY to .env

# Start development server
npm run dev
```

## Environment Variables

```env
GEMINI_API_KEY=your_key_here    # Required: Get from https://aistudio.google.com/app/apikey
ENHANCE_PROMPTS=false           # Optional: Enable prompt enhancement
PORT=3001                       # Optional: Server port
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/generate` - Generate era image  
- `POST /api/edit` - Edit image with instructions
- `POST /api/blend` - Blend multiple images

See main README.md for detailed API documentation.