const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function buildAuthAssets() {
  const imgPath = 'C:/Users/ECS/.gemini/antigravity/brain/c8666b7c-bc4f-475f-ba0a-b3da427c78c1/.user_uploaded/media_1792136490404_05f91dfb.png';
  const outDir = path.join(__dirname, '../public/auth');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  // 1. High-resolution crops of the background elements
  // The left half of reference (Register) is 378x453.
  // The right half (Login) is 378x453.

  // Gift box corner (bottom-left)
  await sharp(imgPath)
    .extract({ left: 0, top: 220, width: 135, height: 233 })
    .resize(405, 699, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_giftbox.png'));

  // Bottom-right flowers
  await sharp(imgPath)
    .extract({ left: 320, top: 310, width: 58, height: 143 })
    .resize(174, 429, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_flowers_br.png'));

  // Top-left foliage
  await sharp(imgPath)
    .extract({ left: 0, top: 0, width: 75, height: 90 })
    .resize(225, 270, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_foliage_tl.png'));

  // Top-right foliage
  await sharp(imgPath)
    .extract({ left: 303, top: 0, width: 75, height: 90 })
    .resize(225, 270, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'decor_foliage_tr.png'));

  // 2. Also extract the full register background and login background upscaled
  await sharp(imgPath)
    .extract({ left: 0, top: 0, width: 378, height: 453 })
    .resize(1134, 1359, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'reference_register_hd.png'));

  await sharp(imgPath)
    .extract({ left: 378, top: 0, width: 378, height: 453 })
    .resize(1134, 1359, { kernel: 'lanczos3' })
    .sharpen()
    .toFile(path.join(outDir, 'reference_login_hd.png'));

  console.log('Successfully generated all auth decoration assets!');
}

buildAuthAssets().catch(console.error);
