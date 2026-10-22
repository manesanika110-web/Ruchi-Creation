const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createCleanBackgrounds() {
  const upscaledPath = path.join(__dirname, '../public/auth/reference_upscaled.png');
  const outDir = path.join(__dirname, '../public/auth');

  // Let's inspect the upscaled image: 2268 x 1359
  // Register side: left: 0 to 1134
  // Login side: left: 1134 to 2268

  // We can sample a clean patch of background parchment:
  // e.g. from x: 180 to 340, y: 15 to 95 in the upscaled image
  const patch = await sharp(upscaledPath)
    .extract({ left: 450, top: 10, width: 300, height: 80 })
    .toBuffer();

  console.log('Clean patch extracted');

  // Let's create a smooth parchment background of size 1134 x 1359:
  // Using radial gradient matching the reference:
  // Center is #E8D8C5, edge is #DEC7B0
  const svgParchment = Buffer.from(`
    <svg width="1134" height="1359" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pGrad" cx="45%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#EEDDC9" />
          <stop offset="50%" stop-color="#E5D3BD" />
          <stop offset="85%" stop-color="#DEC6AD" />
          <stop offset="100%" stop-color="#D7BEA2" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#pGrad)" />
    </svg>
  `);

  const parchmentBase = await sharp(svgParchment).png().toBuffer();

  // Extract pure decorations from the upscaled reference:
  // 1. Gift box with tag (x: 0..420, y: 720..1359)
  // Let's extract without the card edge: width 380
  const giftBoxBuffer = await sharp(upscaledPath)
    .extract({ left: 0, top: 700, width: 380, height: 659 })
    .toBuffer();

  // 2. Flowers bottom-right (x: 960..1134, y: 920..1359)
  const flowersBRBuffer = await sharp(upscaledPath)
    .extract({ left: 960, top: 920, width: 174, height: 439 })
    .toBuffer();

  // 3. Foliage top-left (x: 0..260, y: 0..270)
  const foliageTLBuffer = await sharp(upscaledPath)
    .extract({ left: 0, top: 0, width: 260, height: 270 })
    .toBuffer();

  // 4. Foliage top-right (x: 874..1134, y: 0..270)
  const foliageTRBuffer = await sharp(upscaledPath)
    .extract({ left: 874, top: 0, width: 260, height: 270 })
    .toBuffer();

  // 5. Left side calligraphy for Register (x: 0..380, y: 180..680)
  const textRegisterBuffer = await sharp(upscaledPath)
    .extract({ left: 0, top: 180, width: 380, height: 500 })
    .toBuffer();

  // 6. Left side calligraphy for Login (x: 1134..1514, y: 180..680)
  const textLoginBuffer = await sharp(upscaledPath)
    .extract({ left: 1134, top: 180, width: 380, height: 500 })
    .toBuffer();

  // Now compose a full Register background plate (1134 x 1359):
  // parchmentBase + foliageTL + foliageTR + textRegister + giftBox + flowersBR
  await sharp(parchmentBase)
    .composite([
      { input: foliageTLBuffer, top: 0, left: 0 },
      { input: foliageTRBuffer, top: 0, left: 874 },
      { input: textRegisterBuffer, top: 180, left: 0 },
      { input: giftBoxBuffer, top: 700, left: 0 },
      { input: flowersBRBuffer, top: 920, left: 960 }
    ])
    .toFile(path.join(outDir, 'scene_register_hd.png'));
  console.log('Created scene_register_hd.png');

  // Compose full Login background plate (1134 x 1359):
  await sharp(parchmentBase)
    .composite([
      { input: foliageTLBuffer, top: 0, left: 0 },
      { input: foliageTRBuffer, top: 0, left: 874 },
      { input: textLoginBuffer, top: 180, left: 0 },
      { input: giftBoxBuffer, top: 700, left: 0 },
      { input: flowersBRBuffer, top: 920, left: 960 }
    ])
    .toFile(path.join(outDir, 'scene_login_hd.png'));
  console.log('Created scene_login_hd.png');
}

createCleanBackgrounds().catch(console.error);
