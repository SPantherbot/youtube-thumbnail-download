// Node.js script to replace SITE_URL with actual domain during build
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get site URL from environment variables (Netlify provides these)
const SITE_URL = (
  process.env.URL ||                    // Netlify production URL
  process.env.DEPLOY_PRIME_URL ||      // Netlify deploy preview URL
  process.env.DEPLOY_URL ||            // Netlify deploy URL
  'http://localhost:3000'              // Fallback for local dev
).replace(/\/$/, ''); // Remove trailing slash

console.log(`🌐 Building for domain: ${SITE_URL}`);

const distPath = path.join(__dirname, '..', 'dist');

// Files to update
const filesToUpdate = [
  path.join(distPath, 'sitemap.xml'),
  path.join(distPath, 'robots.txt')
];

filesToUpdate.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all instances of SITE_URL with actual domain
    content = content.replace(/SITE_URL/g, SITE_URL);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated: ${path.basename(filePath)}`);
  } else {
    console.log(`⚠️  File not found: ${path.basename(filePath)}`);
  }
});

console.log(`\n✨ Domain URLs updated successfully!`);
console.log(`📍 Sitemap: ${SITE_URL}/sitemap.xml`);
console.log(`🤖 Robots: ${SITE_URL}/robots.txt`);
