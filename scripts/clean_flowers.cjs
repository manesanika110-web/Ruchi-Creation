const sharp = require('sharp');
const path = require('path');

async function cleanFlowers() {
  const authDir = path.join(__dirname, '../public/auth');
  const { data, info } = await sharp(path.join(authDir, 'decor_flowers_pure.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width, h = info.height;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      // Distance from bottom-right (w-1, h-1)
      const dx = (w - 1 - x) / w; // 0 at right, 1 at left
      const dy = (h - 1 - y) / h; // 0 at bottom, 1 at top
      const dist = Math.sqrt(dx * dx + dy * dy); // 0 at corner, up to 1.414

      let alpha = 1;
      if (dist > 0.8) {
        alpha = 0;
      } else if (dist > 0.45) {
        alpha = Math.cos(((dist - 0.45) / 0.35) * (Math.PI / 2));
      }

      // If background parchment (high brightness and low saturation)
      if (brightness > 215) {
        alpha *= 0.1;
      } else if (brightness > 205) {
        alpha *= 0.4;
      }

      data[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toFile(path.join(authDir, 'flowers_feathered.png'));
  console.log('Cleaned flowers_feathered.png');
}

cleanFlowers().catch(console.error);
