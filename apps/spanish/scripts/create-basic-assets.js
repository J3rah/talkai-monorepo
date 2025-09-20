#!/usr/bin/env node

/**
 * TalkAI Basic Asset Creator
 * Creates essential image assets from existing logos
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createBasicAssets() {
  console.log('🚀 Creating basic TalkAI image assets...');
  
  const publicDir = path.join(process.cwd(), 'public');
  const whiteLogo = path.join(publicDir, 'talkAI_white_letters.png');
  const darkLogo = path.join(publicDir, 'talkAI_dark_letters.png');
  
  // Check if source logos exist
  if (!fs.existsSync(whiteLogo)) {
    console.log('❌ talkAI_white_letters.png not found');
    return;
  }
  
  try {
    // Create favicon sizes from white logo on black background
    console.log('📱 Creating favicon assets...');
    
    // 16x16 favicon
    await sharp({
      create: {
        width: 16,
        height: 16,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(12, 12).png().toBuffer(),
      top: 2,
      left: 2
    }])
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'));
    
    // 32x32 favicon
    await sharp({
      create: {
        width: 32,
        height: 32,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(24, 24).png().toBuffer(),
      top: 4,
      left: 4
    }])
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
    
    // Apple touch icon (180x180)
    await sharp({
      create: {
        width: 180,
        height: 180,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(140, 140).png().toBuffer(),
      top: 20,
      left: 20
    }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    
    // Android icons
    await sharp({
      create: {
        width: 192,
        height: 192,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(150, 150).png().toBuffer(),
      top: 21,
      left: 21
    }])
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
    
    await sharp({
      create: {
        width: 512,
        height: 512,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(400, 400).png().toBuffer(),
      top: 56,
      left: 56
    }])
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
    
    console.log('✅ Favicon assets created');
    
    // Create Open Graph images
    console.log('🌐 Creating Open Graph images...');
    
    // Default OG image
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(400, 400).png().toBuffer(),
      top: 115,
      left: 400
    }])
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
    
    // Homepage OG image  
    await sharp({
      create: {
        width: 1200,
        height: 630,
        channels: 4,
        background: { r: 26, g: 46, b: 82, alpha: 1 } // Dark blue gradient
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(350, 350).png().toBuffer(),
      top: 140,
      left: 425
    }])
    .png()
    .toFile(path.join(publicDir, 'og-homepage.png'));
    
    // Square OG image
    await sharp({
      create: {
        width: 1200,
        height: 1200,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(800, 800).png().toBuffer(),
      top: 200,
      left: 200
    }])
    .png()
    .toFile(path.join(publicDir, 'og-image-square.png'));
    
    // Twitter images (copy OG images)
    await sharp(path.join(publicDir, 'og-image.png'))
      .toFile(path.join(publicDir, 'twitter-image.png'));
    
    await sharp(path.join(publicDir, 'og-homepage.png'))
      .toFile(path.join(publicDir, 'twitter-homepage.png'));
    
    console.log('✅ Open Graph images created');
    
    // Create app shortcut icons
    console.log('🔧 Creating app icons...');
    
    // Chat icon (simplified)
    await sharp({
      create: {
        width: 96,
        height: 96,
        channels: 4,
        background: { r: 0, g: 255, b: 136, alpha: 1 } // Accent green
      }
    })
    .composite([{
      input: await sharp(path.join(publicDir, 'talkAI_dark_letters.png')).resize(70, 70).png().toBuffer(),
      top: 13,
      left: 13
    }])
    .png()
    .toFile(path.join(publicDir, 'icon-chat.png'));
    
    // Dashboard icon
    await sharp({
      create: {
        width: 96,
        height: 96,
        channels: 4,
        background: { r: 74, g: 144, b: 226, alpha: 1 } // Blue
      }
    })
    .composite([{
      input: await sharp(whiteLogo).resize(70, 70).png().toBuffer(),
      top: 13,
      left: 13
    }])
    .png()
    .toFile(path.join(publicDir, 'icon-dashboard.png'));
    
    console.log('✅ App icons created');
    
    // Create main logo (500x500)
    await sharp(whiteLogo)
      .resize(500, 500, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'logo.png'));
    
    console.log('✅ Main logo created');
    
    // Create simple screenshot placeholders
    console.log('📸 Creating screenshot placeholders...');
    
    // Mobile screenshot
    await sharp({
      create: {
        width: 750,
        height: 1334,
        channels: 4,
        background: { r: 245, g: 245, b: 245, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(darkLogo).resize(300, 300).png().toBuffer(),
      top: 517,
      left: 225
    }])
    .png()
    .toFile(path.join(publicDir, 'screenshot-mobile-1.png'));
    
    // Desktop screenshot
    await sharp({
      create: {
        width: 1920,
        height: 1080,
        channels: 4,
        background: { r: 248, g: 249, b: 250, alpha: 1 }
      }
    })
    .composite([{
      input: await sharp(darkLogo).resize(400, 400).png().toBuffer(),
      top: 340,
      left: 760
    }])
    .png()
    .toFile(path.join(publicDir, 'screenshot-desktop-1.png'));
    
    console.log('✅ Screenshot placeholders created');
    
    console.log('\n🎉 All basic image assets created successfully!');
    console.log('📝 These are functional placeholders based on your existing logos');
    console.log('💡 For professional results, create custom designs using IMAGE_ASSETS_GUIDE.md');
    
  } catch (error) {
    console.error('❌ Error creating assets:', error.message);
  }
}

createBasicAssets(); 