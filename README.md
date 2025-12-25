
# 🎅 Live 3D Santa Platform

An interactive, AI-powered 3D Santa experience with community wish-tracking features.

## 🚀 Quick Start

### Local Development
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env` file in the root and add your Gemini API Key:
   ```
   API_KEY=your_gemini_api_key_here
   ```
4. Run `npm run dev`.

## 🌐 Deployment

### Deploy to Netlify (Recommended)
1. **Push your code** to a GitHub repository.
2. **Login to Netlify** and click "Add new site" > "Import an existing project".
3. Select your GitHub repository.
4. **Site Settings**:
   - Build Command: `npm run build`
   - Publish directory: `dist`
5. **Environment Variables**:
   - Go to Site Configuration > Environment Variables.
   - Add a variable named `API_KEY` with your Gemini API Key.
6. Click **Deploy**.

### Deploy to GitHub Pages
1. Install the gh-pages package: `npm install gh-pages --save-dev`.
2. Add a `homepage` field to your `package.json` pointing to your site URL.
3. Add `"predeploy": "npm run build", "deploy": "gh-pages -d dist"` to your scripts.
4. Run `npm run deploy`.
*Note: Since GitHub Pages is fully static, ensure your API Key is handled securely via build-time secrets in GitHub Actions.*

## 🛠 Tech Stack
- **AI**: Google Gemini API (2.5 Flash Native Audio)
- **3D Engine**: Three.js + React Three Fiber
- **Styling**: Tailwind CSS
- **Framework**: React 19 + Vite
