# Era Whisperer 🎨

**AI-Powered Time-Era Image Generator** built with React + Express + Google Gemini 2.5 Flash

Journey through time and create stunning AI artwork from any era in human history. From the Industrial Revolution (1900s) to the far future (2050s+).

## ✨ Features

- 🎨 **Multi-Era Generation**: Create images for 1900s, 1950s, 2000s, and 2050s simultaneously
- 🔧 **Image Editing**: Edit any generated image with text instructions
- 🎭 **Image Blending**: Combine multiple images into artistic compositions
- 🎯 **Era-Specific Prompting**: AI automatically adapts prompts for historical accuracy
- ⚡ **Real-time Preview**: See your creations instantly in a beautiful gallery
- 📱 **Responsive Design**: Perfect on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

### 1. Setup Backend
```bash
# Install backend dependencies
cd server
npm install

# Setup environment
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_actual_api_key_here

# Start backend server (port 3001)
npm run dev
```

### 2. Setup Frontend (New Terminal)
```bash
# Go back to project root
cd ..

# Install frontend dependencies  
npm install

# Start frontend dev server (port 8080)
npm run dev
```

### 3. Start Creating! 
Visit `http://localhost:8080` and start generating era-specific artwork!

## 🎯 How to Use

### Generate Images Across Eras
1. Enter a creative prompt (e.g., "A bustling marketplace")
2. Click "Generate 4 Era Images" 
3. Watch AI create versions for all eras

### Edit Images
1. Click "Edit Images" button
2. Upload an image and describe changes
3. Get an AI-edited version instantly

### Blend Images  
1. Click "Blend Images" button
2. Upload 2-3 images with blending instructions
3. Create unique artistic compositions

## 🛠️ Tech Stack

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + shadcn/ui  
**Backend**: Node.js 20 + Express + Google Generative AI  
**API**: Google Gemini 2.5 Flash Image Preview

## 📁 Project Structure

```
era-whisperer/
├── src/                    # React frontend
│   ├── components/         # UI components  
│   ├── services/          # API service layer
│   └── pages/             # App pages
├── server/                # Express backend
│   ├── index.js          # Main server
│   └── package.json      # Backend deps
└── README.md            # This file
```

## 🔧 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/generate` | POST | Generate era-specific image |
| `/api/edit` | POST | Edit existing image |
| `/api/blend` | POST | Blend multiple images |

## 🐛 Troubleshooting

**"API Key Invalid"**: Check `.env` has correct `GEMINI_API_KEY`  
**"Connection Refused"**: Ensure backend runs on port 3001  
**"File Too Large"**: Images must be under 15MB

## 📄 Environment Setup

Create `server/.env`:
```env
GEMINI_API_KEY=your_key_here    # Required  
ENHANCE_PROMPTS=false           # Optional
PORT=3001                       # Optional  
```

---

## Project Info

**Lovable URL**: https://lovable.dev/projects/2ad4c4b8-2d12-4e4c-9005-b2e63ee2ded8

## How to edit this code?

**Use Lovable**: Visit the [project link](https://lovable.dev/projects/2ad4c4b8-2d12-4e4c-9005-b2e63ee2ded8) and start prompting!

**Use your IDE**: Clone, install deps, and push changes.
```sh
git clone <YOUR_GIT_URL>
cd <PROJECT_NAME>
npm i
npm run dev
```

**Use GitHub Codespaces**: Click Code > Codespaces > New codespace

## Deployment

**Frontend**: Use Lovable's Share > Publish or deploy to Vercel  
**Backend**: Deploy to Railway, Render, or Heroku with environment variables

Ready to create art across time? 🕰️ Start your journey!
