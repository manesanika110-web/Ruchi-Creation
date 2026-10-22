const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function extractCleanDecorations() {
  const imgPath = 'C:/Users/ECS/.gemini/antigravity/brain/c8666b7c-bc4f-475f-ba0a-b3da427c78c1/.user_uploaded/media_1792136490404_05f91dfb.png';
  const outDir = path.join(__dirname, '../public/auth');

  // 1. Giftbox: strictly below y=270 so NO text is included!
  // In the 378x453 left half, text ends around y=245.
  // Giftbox starts around y=275.
  await sharp(imgPath)
    .extract({ left: 0, top: 275, width: 135, height: 178 })
    .resize(405, 534, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_giftbox_pure.png'));
  console.log('Extracted decor_giftbox_pure.png');

  // Feather the edges of the giftbox (top and right edges fade to transparent)
  const gMeta = await sharp(path.join(outDir, 'decor_giftbox_pure.png')).metadata();
  const gw = gMeta.width, gh = gMeta.height;
  const { data: gData } = await sharp(path.join(outDir, 'decor_giftbox_pure.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < gh; y++) {
    for (let x = 0; x < gw; x++) {
      const idx = (y * gw + x) * 4;
      let alpha = gData[idx + 3] / 255;
      if (y < 60) alpha *= Math.max(0, y / 60);
      const distFromRight = gw - 1 - x;
      if (distFromRight < 60) alpha *= Math.max(0, distFromRight / 60);
      gData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(gData, { raw: { width: gw, height: gh, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'giftbox_feathered.png'));
  console.log('Created clean giftbox_feathered.png with ZERO text');

  // 2. Flowers bottom-right
  await sharp(imgPath)
    .extract({ left: 325, top: 325, width: 53, height: 128 })
    .resize(159, 384, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_flowers_pure.png'));

  const fMeta = await sharp(path.join(outDir, 'decor_flowers_pure.png')).metadata();
  const fw = fMeta.width, fh = fMeta.height;
  const { data: fData } = await sharp(path.join(outDir, 'decor_flowers_pure.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < fh; y++) {
    for (let x = 0; x < fw; x++) {
      const idx = (y * fw + x) * 4;
      let alpha = fData[idx + 3] / 255;
      if (y < 50) alpha *= Math.max(0, y / 50);
      if (x < 50) alpha *= Math.max(0, x / 50);
      fData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(fData, { raw: { width: fw, height: fh, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'flowers_feathered.png'));
  console.log('Created clean flowers_feathered.png');

  // 3. Foliage top-left
  await sharp(imgPath)
    .extract({ left: 0, top: 0, width: 68, height: 75 })
    .resize(204, 225, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_tl_pure.png'));

  const tlMeta = await sharp(path.join(outDir, 'decor_tl_pure.png')).metadata();
  const tlw = tlMeta.width, tlh = tlMeta.height;
  const { data: tlData } = await sharp(path.join(outDir, 'decor_tl_pure.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < tlh; y++) {
    for (let x = 0; x < tlw; x++) {
      const idx = (y * tlw + x) * 4;
      let alpha = tlData[idx + 3] / 255;
      const distFromBottom = tlh - 1 - y;
      if (distFromBottom < 40) alpha *= Math.max(0, distFromBottom / 40);
      const distFromRight = tlw - 1 - x;
      if (distFromRight < 40) alpha *= Math.max(0, distFromRight / 40);
      tlData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(tlData, { raw: { width: tlw, height: tlh, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'foliage_tl_feathered.png'));
  console.log('Created clean foliage_tl_feathered.png');

  // 4. Foliage top-right
  await sharp(imgPath)
    .extract({ left: 310, top: 0, width: 68, height: 75 })
    .resize(204, 225, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_tr_pure.png'));

  const trMeta = await sharp(path.join(outDir, 'decor_tr_pure.png')).metadata();
  const trw = trMeta.width, trh = trMeta.height;
  const { data: trData } = await sharp(path.join(outDir, 'decor_tr_pure.png'))
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < trh; y++) {
    for (let x = 0; x < trw; x++) {
      const idx = (y * trw + x) * 4;
      let alpha = trData[idx + 3] / 255;
      const distFromBottom = trh - 1 - y;
      if (distFromBottom < 40) alpha *= Math.max(0, distFromBottom / 40);
      if (x < 40) alpha *= Math.max(0, x / 40);
      trData[idx + 3] = Math.round(Math.min(255, Math.max(0, alpha * 255)));
    }
  }

  await sharp(trData, { raw: { width: trw, height: trh, channels: 4 } })
    .png()
    .toFile(path.join(outDir, 'foliage_tr_feathered.png'));
  console.log('Created clean foliage_tr_feathered.png');
}

extractCleanDecorations().catch(console.error);
