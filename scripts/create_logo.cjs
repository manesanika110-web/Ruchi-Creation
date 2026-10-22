const sharp = require('sharp');
const path = require('path');

async function createLogos() {
  const size = 512;
  const radius = size / 2;
  const sourcePath = 'C:/Users/ECS/.gemini/antigravity/brain/096a5cf9-6fdf-41dc-846b-9482444250a7/.user_uploaded/media_1791967471124_c51f1204.png';

  // 1. Version A: Direct crop of Image 1 (circle with Instagram-style vibrant outer ring)
  const circleMaskA = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="white" /></svg>`
  );

  const croppedA = await sharp(sourcePath)
    .extract({ left: 32, top: 23, width: 164, height: 164 })
    .resize(size, size, { kernel: 'lanczos3' })
    .toBuffer();

  await sharp(croppedA)
    .composite([{ input: circleMaskA, blend: 'dest-in' }])
    .png()
    .toFile(path.join(__dirname, '../public/logo-ring.png'));

  // 2. Version B: The Golden Emblem inside the Deep Burgundy Circle (matching Image 2)
  // Extract golden emblem tightly: left: 39, top: 30, width: 150, height: 150
  const emblemSize = 440;
  const emblem = await sharp(sourcePath)
    .extract({ left: 39, top: 30, width: 150, height: 150 })
    .resize(emblemSize, emblemSize, { kernel: 'lanczos3' })
    .toBuffer();

  // Create crisp background circle with Deep Burgundy border (#722F37)
  const ringSvg = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius - 6}" fill="white" stroke="#722F37" stroke-width="12" />
    </svg>
  `);

  const clipMask = Buffer.from(`
    <svg width="${size}" height="${size}">
      <circle cx="${radius}" cy="${radius}" r="${radius}" fill="white" />
    </svg>
  `);

  const offset = Math.round((size - emblemSize) / 2);

  await sharp(ringSvg)
    .composite([
      { input: emblem, top: offset, left: offset }
    ])
    .composite([
      { input: clipMask, blend: 'dest-in' }
    ])
    .png()
    .toFile(path.join(__dirname, '../public/logo-burgundy.png'));

  // Save the Burgundy circled logo as primary public/logo.png as requested by user!
  // "img 1 samge clear madhe 2nd cirle madhe logo add kar" (Add the logo in the 2nd circle clearly like img 1)
  await sharp(ringSvg)
    .composite([
      { input: emblem, top: offset, left: offset }
    ])
    .composite([
      { input: clipMask, blend: 'dest-in' }
    ])
    .png()
    .toFile(path.join(__dirname, '../public/logo.png'));

  console.log('Successfully generated public/logo.png, public/logo-burgundy.png, and public/logo-ring.png!');
}

createLogos().catch(err => {
  console.error(err);
  process.exit(1);
});
