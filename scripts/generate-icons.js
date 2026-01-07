import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');
const iconSvg = path.join(publicDir, 'icon.svg');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
  try {
    // Check if SVG exists
    if (!fs.existsSync(iconSvg)) {
      console.error('Error: icon.svg not found in public folder');
      process.exit(1);
    }

    console.log('Generating PWA icons...');

    for (const size of sizes) {
      const outputPath = path.join(publicDir, `icon-${size}x${size}.png`);
      
      await sharp(iconSvg)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✓ Generated icon-${size}x${size}.png`);
    }

    console.log('\n✅ All icons generated successfully!');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
