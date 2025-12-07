<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/9e85a0b5-d981-44b6-874d-76b61a5c3451" />




This contains everything you need to run your app locally.

View : https://youtubethumbkit.netlify.app/ AI GENARTED USING GOOGLE AI STUDIO.

## Run Locally or deploy on netlify

requirments:  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

you can buid this app using prompt ( CURSOR, GOOGLE AI STDIO, LOVABLE, GETMOCHA....)

# HERE IS THE PROMPT 

'# ThumbnailPro - YouTube Thumbnail Tool

## Overview
A comprehensive SaaS platform for downloading and editing YouTube thumbnails with AI-powered features.

## Features
- **Download Thumbnails**: Extract YouTube thumbnails in multiple sizes (Max, High, Medium, Standard)
- **AI Cleaning**: Automatically remove logos, text, and watermarks using AI
- **Smart Brush Tool**: Paint over areas to mark for removal
- **No Signup Required**: Free to use without account creation

## Technical Stack
- React 18 for UI components
- TailwindCSS for styling
- Lucide icons for UI elements
- AI integration via invokeAIAgent

## Project Structure
- `index.html` - Main landing page
- `editor.html` - AI editor page
- `components/` - Reusable React components
- `app.js` - Main application logic
- `editor-app.js` - Editor application logic

## Pages
1. **Home Page** (`index.html`)
   - Hero section with value proposition
   - Thumbnail downloader
   - Features showcase
   - How it works guide

2. **Editor Page** (`editor.html`)
   - Image upload interface
   - AI cleaning tools
   - Brush tool for manual selection
   - Canvas for editing

## Color Scheme
- Primary: #FF0000 (YouTube Red)
- Secondary: #FEF2F2 (Light Red)
- Accent: #DC2626 (Dark Red)

## Last Updated
December 2025'



