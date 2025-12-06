# Domain Auto-Configuration Setup

## 🎯 Problem Solved
Your sitemap.xml and robots.txt now **automatically adapt** to any domain you deploy to:
- ✅ `localhost:3000` during development
- ✅ `your-app.netlify.app` on Netlify
- ✅ `www.ytthumbgrabber.com` when you add custom domain

## 🚀 How It Works

### During Development
- Sitemap and robots.txt use placeholder `SITE_URL`
- No real URLs are hardcoded

### During Build/Deployment
1. Run `npm run build`
2. Vite builds your app to `dist/` folder
3. Script `scripts/update-domain.js` runs automatically
4. It replaces all `SITE_URL` with actual domain from environment variables
5. Netlify provides these variables automatically:
   - `URL` = your production domain
   - `DEPLOY_PRIME_URL` = preview deploy URL
   - `DEPLOY_URL` = any deploy URL

## 📦 Files Modified

### `public/sitemap.xml`
```xml
<loc>SITE_URL/</loc>          <!-- Will become: https://www.ytthumbgrabber.com/ -->
<loc>SITE_URL/privacy</loc>   <!-- Will become: https://www.ytthumbgrabber.com/privacy -->
```

### `public/robots.txt`
```
Sitemap: SITE_URL/sitemap.xml  <!-- Will become: https://www.ytthumbgrabber.com/sitemap.xml -->
```

### `scripts/update-domain.js`
Node.js script that:
- Reads Netlify environment variables
- Replaces `SITE_URL` with actual domain
- Updates sitemap.xml and robots.txt in dist/ folder

### `package.json`
```json
"build": "vite build && node scripts/update-domain.js"
```

### `netlify.toml`
Netlify configuration (optional, for extra control)

## 🔧 Netlify Deployment

### Option 1: Connect GitHub Repository (Recommended)
1. Push code to GitHub
2. Connect repository in Netlify
3. Build command: `npm run build` (already configured)
4. Publish directory: `dist`
5. Done! Domain URLs auto-update

### Option 2: Manual Deployment
```bash
# Build locally
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

### Option 3: Custom Domain
1. Add custom domain in Netlify settings
2. Point DNS to Netlify
3. Netlify automatically sets `URL` environment variable to your custom domain
4. Next build will use your custom domain everywhere

## 🧪 Testing

### Test Local Build
```bash
npm run build
cat dist/sitemap.xml    # Check if SITE_URL is replaced
cat dist/robots.txt     # Check if SITE_URL is replaced
```

### Verify on Deployed Site
```
https://your-domain.com/sitemap.xml
https://your-domain.com/robots.txt
```

## 🌐 Environment Variables on Netlify

Netlify automatically provides:
- `URL` - Your production URL (e.g., `https://www.ytthumbgrabber.com`)
- `DEPLOY_PRIME_URL` - Deploy preview URL
- `DEPLOY_URL` - Current deploy URL

No manual configuration needed!

## ✨ Benefits

✅ **No hardcoded domains** - Works on any deployment
✅ **Automatic updates** - Changes with your domain
✅ **SEO-friendly** - Always points to correct URLs
✅ **Zero maintenance** - Set it and forget it
✅ **Multi-environment** - Works for dev, staging, production

## 📝 Example Flow

1. **Development**: 
   - `npm run dev` → localhost:3000
   - sitemap.xml shows `SITE_URL` placeholder

2. **Deploy to Netlify**:
   - `npm run build` triggers automatically
   - Script detects: `URL=https://amazing-site-123.netlify.app`
   - Replaces: `SITE_URL` → `https://amazing-site-123.netlify.app`
   - Result: `https://amazing-site-123.netlify.app/sitemap.xml` works!

3. **Add Custom Domain**:
   - You add `www.ytthumbgrabber.com` in Netlify
   - Next deploy detects: `URL=https://www.ytthumbgrabber.com`
   - Replaces: `SITE_URL` → `https://www.ytthumbgrabber.com`
   - Result: All URLs now use your custom domain!

## 🎉 That's It!

You don't need to touch sitemap.xml or robots.txt ever again. They automatically adapt to any domain you use!
