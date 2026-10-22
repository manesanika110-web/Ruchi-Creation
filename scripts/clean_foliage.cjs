const sharp = require('sharp');
const path = require('path');

async function cleanFoliage() {
  const authDir = path.join(__dirname, '../public/auth');

  // Top-left foliage: make background transparent, keep only dark branch lines
  const { data: tlData, info: tlInfo } = await sharp(path.join(authDir, 'decor_tl_pure.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = tlInfo.width, h = tlInfo.height;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = tlData[idx], g = tlData[idx+1], b = tlData[idx+2];
      // Brightness (0..255)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // If brightness > 210, it is light parchment background -> make transparent
      // Branch lines have brightness < 185
      if (brightness > 210) {
        tlData[idx + 3] = 0;
      } else if (brightness > 175) {
        // Smooth transition
        const factor = (210 - brightness) / 35;
        tlData[idx + 3] = Math.round(factor * 255);
      } else {
        tlData[idx + 3] = 255;
      }
    }
  }

  await sharp(tlData, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(path.join(authDir, 'foliage_tl_feathered.png'));
  console.log('Cleaned foliage_tl_feathered.png');

  // Top-right foliage
  const { data: trData, info: trInfo } = await sharp(path.join(authDir, 'decor_tr_pure.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  const trw = trInfo.width, trh = trInfo.height;
  for (let y = 0; y < trh; y++) {
    for (let x = 0; x < trw; x++) {
      const idx = (y * trw + x) * 4;
      const r = trData[idx], g = trData[idx+1], b = trData[idx+2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
      if (brightness > 210) {
        trData[idx + 3] = 0;
      } else if (brightness > 175) {
        const factor = (210 - brightness) / 35;
        trData[idx + 3] = Math.round(factor * 255);
      } else {
        trData[idx + 3] = 255;
      }
    }
  }

  await sharp(trData, { raw: { width: trw, height: trh, channels: 4 } })
    .png()
    .toFile(path.join(authDir, 'foliage_tr_feathered.png'));
  console.log('Cleaned foliage_tr_feathered.png');
}

cleanFoliage().catch(console.error);
