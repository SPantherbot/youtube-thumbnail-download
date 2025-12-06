#!/bin/bash
# Build script that replaces SITE_URL with actual domain
# This runs during Netlify deployment

# Get the site URL from Netlify environment variable or use provided domain
SITE_URL="${DEPLOY_URL:-${URL:-https://localhost:3000}}"

# Remove trailing slash if present
SITE_URL="${SITE_URL%/}"

echo "Building site for domain: $SITE_URL"

# Build the Vite app
npm run build

# Replace SITE_URL placeholder in sitemap.xml
sed -i "s|SITE_URL|$SITE_URL|g" dist/sitemap.xml

# Replace SITE_URL placeholder in robots.txt
sed -i "s|SITE_URL|$SITE_URL|g" dist/robots.txt

echo "✅ Domain URLs updated successfully!"
echo "Sitemap: $SITE_URL/sitemap.xml"
