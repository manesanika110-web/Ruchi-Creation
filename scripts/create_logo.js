const sharp = require('sharp');
const path = require('path');

async function createCircularLogo() {
  const size = 512;
  const radius = size / 2;
  
  // Create an SVG circular mask
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="white" /></svg>`
  );

  // Source path of Image 1 uploaded by user
  const sourcePath = 'C:/Users/ECS/.gemini/antigravity/brain/096a5cf9-6fdf-41dc-846b-9482444250a7/.user_uploaded/media_1791967471124_c51f1204.png';

  // 1. Version 1: img 1 cropped exactly to the circle (164x164) and masked to transparent circle
  const cropped = await sharp(sourcePath)
    .extract({ left: 32, top: 23, width: 164, height: 164 })
    .resize(size, size, { kernel: 'lanczos3' })
    .toBuffer();

  await sharp(cropped)
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile(path.join(__dirname, '../public/logo.png'));

  console.log('Successfully generated public/logo.png from Image 1!');
}

createCircularLogo().catch(err => {
  console.error('Error generating logo:', err);
  process.exit(1);
});
