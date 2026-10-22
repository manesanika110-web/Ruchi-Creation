const sharp = require('sharp');
const path = require('path');

async function cleanLogo() {
  const size = 512;
  const radius = size / 2;
  const circleMask = Buffer.from(
    `<svg width="${size}" height="${size}"><circle cx="${radius}" cy="${radius}" r="${radius}" fill="white" /></svg>`
  );

  await sharp(path.join(__dirname, '../public/user-logo.png'))
    .trim()
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .composite([{ input: circleMask, blend: 'dest-in' }])
    .png()
    .toFile(path.join(__dirname, '../public/logo-masked.png'));

  // Copy over public/logo.png
  const fs = require('fs');
  fs.copyFileSync(
    path.join(__dirname, '../public/logo-masked.png'),
    path.join(__dirname, '../public/logo.png')
  );
  console.log('Cleaned and masked public/logo.png successfully!');
}

cleanLogo().catch(console.error);
