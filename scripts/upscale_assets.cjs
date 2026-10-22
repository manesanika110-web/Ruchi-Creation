const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function upscaleAssets() {
  const dir = path.join(__dirname, '../public/reference-assets');
  const files = fs.readdirSync(dir);

  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
      const fullPath = path.join(dir, file);
      const inputBuffer = fs.readFileSync(fullPath);
      const meta = await sharp(inputBuffer).metadata();
      if (meta.width < 400) {
        const newWidth = Math.round(meta.width * 3);
        const newHeight = Math.round(meta.height * 3);
        const buf = await sharp(inputBuffer)
          .resize(newWidth, newHeight, { kernel: 'lanczos3' })
          .sharpen()
          .jpeg({ quality: 95 })
          .toBuffer();
        fs.writeFileSync(fullPath, buf);
        console.log(`Upscaled ${file} to ${newWidth}x${newHeight}`);
      }
    }
  }
}

upscaleAssets().catch(console.error);
