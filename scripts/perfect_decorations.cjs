const sharp = require('sharp');
const path = require('path');

async function processDecorations() {
  const refPath = 'C:/Users/ECS/.gemini/antigravity/brain/c8666b7c-bc4f-475f-ba0a-b3da427c78c1/.user_uploaded/media_1792136490404_05f91dfb.png';
  const outDir = path.join(__dirname, '../public/auth');

  // 1. Giftbox: left=0, top=272, width=125, height=181
  const gbRaw = await sharp(refPath)
    .extract({ left: 0, top: 272, width: 125, height: 181 })
    .resize(375, 543, { kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const gw = gbRaw.info.width, gh = gbRaw.info.height;
  const gbData = gbRaw.data;

  // Feather top (y < 70) and right (x > gw - 90)
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const idx = (y * gw + x) * 4;
      let a = 1.0;
      // top feather
      if (y < 70) {
        const t = y / 70;
        a *= t * t * (3 - 2 * t); // smoothstep
      }
      // right feather
      const distRight = gw - 1 - x;
      if (distRight < 90) {
        const t = distRight / 90;
        a *= t * t * (3 - 2 * t); // smoothstep
      }
      gbData[idx + 3] = Math.round(Math.min(255, Math.max(0, a * gbData[idx + 3])));
    }
  }

  await sharp(gbData, { raw: { width: gw, height: gh, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'giftbox_feathered.png'));
  console.log('Processed giftbox_feathered.png');

  // 2. Flowers: left=660, top=345, width=96, height=108
  const flRaw = await sharp(refPath)
    .extract({ left: 660, top: 345, width: 96, height: 108 })
    .resize(288, 324, { kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const fw = flRaw.info.width, fh = flRaw.info.height;
  const flData = flRaw.data;

  // Feather top (y < 70) and left (x < 90)
  for (let y = 0; y < fh; y++) {
    for (let x = 0; x < fw; x++) {
      const idx = (y * fw + x) * 4;
      let a = 1.0;
      if (y < 70) {
        const t = y / 70;
        a *= t * t * (3 - 2 * t); // smoothstep
      }
      if (x < 90) {
        const t = x / 90;
        a *= t * t * (3 - 2 * t); // smoothstep
      }
      flData[idx + 3] = Math.round(Math.min(255, Math.max(0, a * flData[idx + 3])));
    }
  }

  await sharp(flData, { raw: { width: fw, height: fh, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'flowers_feathered.png'));
  console.log('Processed flowers_feathered.png');
}

processDecorations().catch(console.error);
