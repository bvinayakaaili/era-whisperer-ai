# Era Whisperer Backend

AI-powered image generation backend using Google's Gemini 2.5 Flash Image Preview model.

## Features

- **Image Generation**: Create era-specific images (1900s, 1950s, 2000s, 2050s)
- **Image Editing**: Edit existing images with text instructions
- **Image Blending**: Blend multiple images together
- **Prompt Enhancement**: Optional AI-powered prompt enhancement
- **Robust Error Handling**: Comprehensive error handling and validation
- **File Upload Limits**: 15MB upload limit with proper validation

## Prerequisites

- Node.js 20+ (ES modules support)
- Google Gemini API key

## Quick Start

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create or select a project
3. Generate an API key
4. Copy the API key for the next step

### 2. Setup Environment

```bash
cd server
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_actual_api_key_here
ENHANCE_PROMPTS=false
PORT=3001
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start on port 3001 (or your specified PORT).

## API Endpoints

### Health Check
```
GET /health
Response: { "status": "OK" }
```

### Generate Image
```
POST /api/generate
Content-Type: application/json

Body:
{
  "text": "A bustling marketplace",
  "era": 1900
}

Response:
{
  "imageUrl": "data:image/jpeg;base64,...",
  "era": 1900,
  "prompt": "Enhanced era-specific prompt..."
}
```

**Supported eras**: 1900, 1950, 2000, 2050

### Edit Image
```
POST /api/edit
Content-Type: multipart/form-data

Fields:
- image: Image file (max 15MB)
- instruction: Text instruction for editing

Response:
{
  "imageUrl": "data:image/jpeg;base64,..."
}
```

### Blend Images
```
POST /api/blend
Content-Type: multipart/form-data

Fields:
- images: 2-3 image files (max 15MB each)
- instruction: Text instruction for blending

Response:
{
  "imageUrl": "data:image/jpeg;base64,..."
}
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ | Your Google Gemini API key |
| `ENHANCE_PROMPTS` | ❌ | Enable prompt enhancement (true/false) |
| `PORT` | ❌ | Server port (default: 3001) |

## Prompt Enhancement

When `ENHANCE_PROMPTS=true`, the backend uses Gemini 2.0 Flash to enhance user prompts before generating images. This creates more detailed, era-specific descriptions.

## Error Handling

The API returns appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing fields, invalid era, etc.)
- `500`: Server error (Gemini API issues, etc.)

Error response format:
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## File Upload Limits

- Maximum file size: 15MB per image
- Supported formats: All image types (PNG, JPG, GIF, etc.)
- Blend endpoint: 2-3 images maximum

## Era-Specific Prompting

The backend automatically enhances prompts with era-appropriate context:

- **1900s**: Industrial Revolution, Victorian architecture, steam engines
- **1950s**: Post-war era, classic cars, diners, mid-century modern
- **2000s**: Modern technology, urban landscapes, Y2K aesthetic
- **2050s**: Futuristic technology, flying vehicles, holographic displays

## Development

The server uses ES modules. Make sure your `package.json` includes:
```json
{
  "type": "module"
}
```

For development with auto-reload:
```bash
npm run dev
```

## Troubleshooting

### "Invalid API Key" Error
- Verify your API key in `.env`
- Ensure the key has proper permissions
- Check Google AI Studio console

### "File too large" Error
- Images must be under 15MB
- Use image compression if needed

### "Model not found" Error
- Ensure you have access to Gemini 2.5 Flash Image Preview
- Check your Google Cloud project permissions

## Production Deployment

For production deployment:

1. Set environment variables securely
2. Use a process manager (PM2, systemd)
3. Configure reverse proxy (nginx)
4. Enable HTTPS
5. Set up monitoring and logging

## License

MIT License - see LICENSE file for details.