const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createFeatheredAssets() {
  const authDir = path.join(__dirname, '../public/auth');

  // 1. Feather decor_giftbox.png:
  // Dimensions of decor_giftbox.png: 405 x 699
  // The gift box is anchored at bottom=699, left=0.
  // The top edge and right edge need a smooth fade to transparent.
  const giftMeta = await sharp(path.join(authDir, 'decor_giftbox.png')).metadata();
  const gw = giftMeta.width, gh = giftMeta.height;
  const { data: gData, info: gInfo } = await sharp(path.join(authDir, 'decor_giftbox.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Modify alpha channel in raw buffer
  // Fade out towards right edge (last 60px) and towards top edge (top 70px)
  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const idx = (y * gw + x) * 4;
      let alpha = gData[idx + 3] / 255;

      // Distance from top
      if (y < 80) {
        alpha *= Math.max(0, y / 80);
      }
      // Distance from right
      const distFromRight = gw - 1 - x;
      if (distFromRight < 80) {
        alpha *= Math.max(0, distFromRight / 80);
      }

      gData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(gData, { raw: { width: gw, height: gh, channels: 4 } })
    .png()
    .toFile(path.join(authDir, 'giftbox_feathered.png'));
  console.log('Created giftbox_feathered.png');

  // 2. Feather decor_flowers_br.png:
  // Flowers anchored at bottom-right. Top and left edges fade out.
  const flMeta = await sharp(path.join(authDir, 'decor_flowers_br.png')).metadata();
  const fw = flMeta.width, fh = flMeta.height;
  const { data: flData } = await sharp(path.join(authDir, 'decor_flowers_br.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < fh; y++) {
    for (let x = 0; x < fw; x++) {
      const idx = (y * fw + x) * 4;
      let alpha = flData[idx + 3] / 255;

      // Top fade
      if (y < 60) {
        alpha *= Math.max(0, y / 60);
      }
      // Left fade
      if (x < 60) {
        alpha *= Math.max(0, x / 60);
      }
      flData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(flData, { raw: { width: fw, height: fh, channels: 4 } })
    .png()
    .toFile(path.join(authDir, 'flowers_feathered.png'));
  console.log('Created flowers_feathered.png');

  // 3. Foliage top-left: fade bottom & right
  const tlMeta = await sharp(path.join(authDir, 'decor_foliage_tl.png')).metadata();
  const tlw = tlMeta.width, tlh = tlMeta.height;
  const { data: tlData } = await sharp(path.join(authDir, 'decor_foliage_tl.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < tlh; y++) {
    for (let x = 0; x < tlw; x++) {
      const idx = (y * tlw + x) * 4;
      let alpha = tlData[idx + 3] / 255;
      const distFromBottom = tlh - 1 - y;
      if (distFromBottom < 50) alpha *= Math.max(0, distFromBottom / 50);
      const distFromRight = tlw - 1 - x;
      if (distFromRight < 50) alpha *= Math.max(0, distFromRight / 50);
      tlData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(tlData, { raw: { width: tlw, height: tlh, channels: 4 } })
    .png()
    .toFile(path.join(authDir, 'foliage_tl_feathered.png'));
  console.log('Created foliage_tl_feathered.png');

  // 4. Foliage top-right: fade bottom & left
  const trMeta = await sharp(path.join(authDir, 'decor_foliage_tr.png')).metadata();
  const trw = trMeta.width, trh = trMeta.height;
  const { data: trData } = await sharp(path.join(authDir, 'decor_foliage_tr.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < trh; y++) {
    for (let x = 0; x < trw; x++) {
      const idx = (y * trw + x) * 4;
      let alpha = trData[idx + 3] / 255;
      const distFromBottom = trh - 1 - y;
      if (distFromBottom < 50) alpha *= Math.max(0, distFromBottom / 50);
      if (x < 50) alpha *= Math.max(0, x / 50);
      trData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(trData, { raw: { width: trw, height: trh, channels: 4 } })
    .png()
    .toFile(path.join(authDir, 'foliage_tr_feathered.png'));
  console.log('Created foliage_tr_feathered.png');
}

createFeatheredAssets().catch(console.error);
