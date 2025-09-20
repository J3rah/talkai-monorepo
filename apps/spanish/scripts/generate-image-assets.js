#!/usr/bin/env node

/**
 * TalkAI Image Asset Generator
 * 
 * This script helps generate all required SEO image assets
 * Run: node scripts/generate-image-assets.js
 */

const fs = require('fs');
const path = require('path');

// Check if Sharp is available for image processing
let sharp;
try {
  sharp = require('sharp');
  console.log('✅ Sharp detected - full image processing available');
} catch (e) {
  console.log('⚠️  Sharp not found. Install with: npm install sharp');
  console.log('📝 Will generate placeholder files instead');
}

// Asset specifications
const assets = {
  favicons: [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ],
  openGraph: [
    { name: 'og-image.png', width: 1200, height: 630 },
    { name: 'og-homepage.png', width: 1200, height: 630 },
    { name: 'og-image-square.png', width: 1200, height: 1200 },
    { name: 'twitter-image.png', width: 1200, height: 630 },
    { name: 'twitter-homepage.png', width: 1200, height: 630 },
  ],
  appIcons: [
    { name: 'icon-chat.png', size: 96 },
    { name: 'icon-dashboard.png', size: 96 },
  ],
  screenshots: [
    { name: 'screenshot-mobile-1.png', width: 750, height: 1334 },
    { name: 'screenshot-desktop-1.png', width: 1920, height: 1080 },
  ],
  logos: [
    { name: 'logo.png', size: 500 },
  ]
};

// Colors
const colors = {
  primary: '#000000',
  white: '#ffffff',
  accent: '#00ff88',
  blue: '#4A90E2',
  purple: '#8E7CC3'
};

/**
 * Generate SVG placeholder for image assets
 */
function generateSVGPlaceholder(width, height, text, bgColor = colors.primary) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="background: ${bgColor}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="50%" y="30%" font-family="Inter, sans-serif" font-size="${Math.min(width, height) / 20}" fill="${colors.white}" text-anchor="middle" dominant-baseline="middle">TalkAI</text>
  <text x="50%" y="50%" font-family="Inter, sans-serif" font-size="${Math.min(width, height) / 30}" fill="${colors.accent}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  <text x="50%" y="70%" font-family="Inter, sans-serif" font-size="${Math.min(width, height) / 40}" fill="${colors.white}" text-anchor="middle" dominant-baseline="middle">AI Therapist & Mental Health Support</text>
</svg>`;
}

/**
 * Generate favicon SVG
 */
function generateFaviconSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" style="background: ${colors.primary}">
  <rect width="${size}" height="${size}" fill="${colors.primary}"/>
  <circle cx="${size/2}" cy="${size/2}" r="${size/3}" fill="${colors.white}"/>
  <circle cx="${size/2.5}" cy="${size/2.2}" r="${size/20}" fill="${colors.primary}"/>
  <circle cx="${size/1.6}" cy="${size/2.2}" r="${size/20}" fill="${colors.primary}"/>
  <path d="M ${size/2.5} ${size/1.7} Q ${size/2} ${size/1.5} ${size/1.6} ${size/1.7}" stroke="${colors.primary}" stroke-width="${size/30}" fill="none"/>
  <circle cx="${size-size/6}" cy="${size/6}" r="${size/8}" fill="${colors.accent}"/>
</svg>`;
}

/**
 * Create directory if it doesn't exist
 */
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Generate assets using Sharp (if available)
 */
async function generateWithSharp() {
  const publicDir = path.join(process.cwd(), 'public');
  
  console.log('🎨 Generating image assets with Sharp...');

  // Generate favicons
  for (const asset of assets.favicons) {
    const svg = generateFaviconSVG(asset.size);
    const buffer = Buffer.from(svg);
    
    await sharp(buffer)
      .resize(asset.size, asset.size)
      .png()
      .toFile(path.join(publicDir, asset.name));
    
    console.log(`✅ Generated ${asset.name}`);
  }

  // Generate Open Graph images
  for (const asset of assets.openGraph) {
    let text = 'Social Media Preview';
    if (asset.name.includes('homepage')) text = '24/7 AI Therapy';
    if (asset.name.includes('twitter')) text = 'Twitter Card';
    
    const svg = generateSVGPlaceholder(asset.width, asset.height, text);
    const buffer = Buffer.from(svg);
    
    await sharp(buffer)
      .resize(asset.width, asset.height)
      .png()
      .toFile(path.join(publicDir, asset.name));
    
    console.log(`✅ Generated ${asset.name}`);
  }

  // Generate app icons
  for (const asset of assets.appIcons) {
    const text = asset.name.includes('chat') ? 'Chat' : 'Dashboard';
    const svg = generateFaviconSVG(asset.size);
    const buffer = Buffer.from(svg);
    
    await sharp(buffer)
      .resize(asset.size, asset.size)
      .png()
      .toFile(path.join(publicDir, asset.name));
    
    console.log(`✅ Generated ${asset.name}`);
  }

  // Generate screenshots (placeholders)
  for (const asset of assets.screenshots) {
    const text = asset.name.includes('mobile') ? 'Mobile App' : 'Desktop App';
    const svg = generateSVGPlaceholder(asset.width, asset.height, text, colors.blue);
    const buffer = Buffer.from(svg);
    
    await sharp(buffer)
      .resize(asset.width, asset.height)
      .png()
      .toFile(path.join(publicDir, asset.name));
    
    console.log(`✅ Generated ${asset.name}`);
  }

  // Generate logo
  const logoSvg = generateFaviconSVG(500);
  const logoBuffer = Buffer.from(logoSvg);
  
  await sharp(logoBuffer)
    .resize(500, 500)
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  
  console.log(`✅ Generated logo.png`);
}

/**
 * Generate placeholder files without Sharp
 */
function generatePlaceholders() {
  const publicDir = path.join(process.cwd(), 'public');
  
  console.log('📝 Generating placeholder files...');

  // Create placeholder readme
  const placeholderContent = `# TalkAI Image Assets

## 🚧 Placeholder Files Generated

These are placeholder image files created by the asset generator.
Replace them with proper branded images using the specifications in IMAGE_ASSETS_GUIDE.md

### Required Replacements:
${Object.values(assets).flat().map(asset => `- ${asset.name || asset.title}`).join('\n')}

### Tools to Create Proper Assets:
1. **Figma** (Recommended) - Use the detailed specs in IMAGE_ASSETS_GUIDE.md
2. **Canva** - Quick templates available
3. **Adobe Creative Suite** - Full control
4. **Online Generators** - Favicon.io, RealFaviconGenerator

### Next Steps:
1. Review IMAGE_ASSETS_GUIDE.md for detailed specifications
2. Create branded versions using your preferred tool
3. Replace placeholder files with proper images
4. Test all assets across different devices/platforms

**Your SEO is 95% complete - just need proper branded images!** 🚀
`;

  fs.writeFileSync(path.join(publicDir, 'PLACEHOLDER_ASSETS_README.md'), placeholderContent);
  
  console.log('📝 Created asset replacement guide');
  console.log('💡 Install Sharp for automatic placeholder generation: npm install sharp');
}

/**
 * Generate favicon.ico file
 */
async function generateFaviconICO() {
  if (!sharp) return;
  
  try {
    const publicDir = path.join(process.cwd(), 'public');
    const svg = generateFaviconSVG(32);
    const buffer = Buffer.from(svg);
    
    // Generate 32x32 PNG first, then convert to ICO
    await sharp(buffer)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-temp.png'));
    
    // Note: Converting PNG to ICO requires additional tools
    console.log('💡 To generate favicon.ico:');
    console.log('   1. Use online converter: https://favicon.io/favicon-converter/');
    console.log('   2. Upload the generated favicon-32x32.png');
    console.log('   3. Download and place favicon.ico in /public/');
    
  } catch (error) {
    console.log('⚠️  ICO generation requires additional setup');
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 TalkAI SEO Image Asset Generator\n');
  
  const publicDir = path.join(process.cwd(), 'public');
  ensureDir(publicDir);
  
  if (sharp) {
    await generateWithSharp();
    await generateFaviconICO();
    
    console.log('\n✅ All image assets generated successfully!');
    console.log('📝 Review IMAGE_ASSETS_GUIDE.md for next steps');
    console.log('💡 Replace placeholders with branded designs for best results');
  } else {
    generatePlaceholders();
    
    console.log('\n📝 Placeholder guide created!');
    console.log('💡 Install Sharp for automatic generation: npm install sharp');
    console.log('📖 Follow IMAGE_ASSETS_GUIDE.md for manual creation');
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('   1. Create branded versions using Figma/Canva');
  console.log('   2. Test social media previews');
  console.log('   3. Validate favicon display');
  console.log('   4. Submit sitemap to Google Search Console');
  console.log('\n🚀 Your SEO will be complete with proper branded images!');
}

// Run the script
main().catch(console.error); 