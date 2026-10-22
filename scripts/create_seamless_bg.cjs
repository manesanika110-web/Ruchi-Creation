const sharp = require('sharp');
const path = require('path');

async function createSeamlessBg() {
  const regPath = path.join(__dirname, '../public/auth/reference_register_hd.png');
  const loginPath = path.join(__dirname, '../public/auth/reference_login_hd.png');
  const outDir = path.join(__dirname, '../public/auth');

  // Let's inspect the natural parchment region in reference_register_hd.png:
  // x: 380 to 980 is where the card is.
  // x: 300 to 380 is parchment.
  // x: 980 to 1134 is parchment.
  // y: 0 to 105 is parchment.
  
  // We can sample a large texture block from y: 0..105, x: 200..900:
  // Or even better: we can fill the card area (minX: 380, maxX: 985, minY: 100, maxY: 1359)
  // with a horizontal mirror / smooth blend of the surrounding parchment!
  const { data, info } = await sharp(regPath).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;

  // Let's create a copy buffer
  const cleanData = Buffer.from(data);

  // For every pixel inside the card area (x between 380 and 990, y between 90 and 1359):
  // We sample parchment color based on y and x:
  // At (x, y), we can interpolate between the left parchment at x=370 and right parchment at x=1000!
  for (let y = 90; y < h; y++) {
    // Left reference pixel at x=365
    const leftIdx = (y * w + 365) * 4;
    const lr = data[leftIdx], lg = data[leftIdx+1], lb = data[leftIdx+2];

    // Right reference pixel at x=995 (or clamped if near bottom flowers)
    let rx = 1005;
    if (rx >= w) rx = w - 5;
    const rightIdx = (y * w + rx) * 4;
    const rr = data[rightIdx], rg = data[rightIdx+1], rb = data[rightIdx+2];

    for (let x = 370; x < 995; x++) {
      const t = (x - 370) / (995 - 370);
      const r = Math.round(lr * (1 - t) + rr * t);
      const g = Math.round(lg * (1 - t) + rg * t);
      const b = Math.round(lb * (1 - t) + rb * t);

      const idx = (y * w + x) * 4;
      cleanData[idx] = r;
      cleanData[idx+1] = g;
      cleanData[idx+2] = b;
      cleanData[idx+3] = 255;
    }
  }

  await sharp(cleanData, { raw: { width: w, height: h, channels: 4 } })
    .toFile(path.join(outDir, 'bg_register_clean.png'));
  console.log('Created bg_register_clean.png');

  // Now for Login:
  const { data: lData, info: lInfo } = await sharp(loginPath).raw().toBuffer({ resolveWithObject: true });
  const cleanLData = Buffer.from(lData);

  for (let y = 140; y < h; y++) {
    const leftIdx = (y * w + 365) * 4;
    const lr = lData[leftIdx], lg = lData[leftIdx+1], lb = lData[leftIdx+2];

    let rx = 1005;
    if (rx >= w) rx = w - 5;
    const rightIdx = (y * w + rx) * 4;
    const rr = lData[rightIdx], rg = lData[rightIdx+1], rb = lData[rightIdx+2];

    for (let x = 370; x < 995; x++) {
      const t = (x - 370) / (995 - 370);
      const r = Math.round(lr * (1 - t) + rr * t);
      const g = Math.round(lg * (1 - t) + rg * t);
      const b = Math.round(lb * (1 - t) + rb * t);

      const idx = (y * w + x) * 4;
      cleanLData[idx] = r;
      cleanLData[idx+1] = g;
      cleanLData[idx+2] = b;
      cleanLData[idx+3] = 255;
    }
  }

  await sharp(cleanLData, { raw: { width: w, height: h, channels: 4 } })
    .toFile(path.join(outDir, 'bg_login_clean.png'));
  console.log('Created bg_login_clean.png');
}

createSeamlessBg().catch(console.error);
