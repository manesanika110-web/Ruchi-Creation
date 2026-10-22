const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const refPath = 'C:/Users/ECS/.gemini/antigravity/brain/096a5cf9-6fdf-41dc-846b-9482444250a7/.user_uploaded/media_1791971258277_c6348298.jpg';

async function extract() {
  const assetsDir = path.join(__dirname, '../public/reference-assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Home Hero Banner:
  // In Home panel (left 0-418, top 0-500)
  // Hero is from y: ~27 to ~180, x: ~4 to ~416
  await sharp(refPath)
    .extract({ left: 4, top: 27, width: 412, height: 153 })
    .toFile(path.join(assetsDir, 'hero-banner.jpg'));
  console.log('Extracted hero-banner.jpg');

  // 2. Home About Us image (kraft box with hands tying ribbon):
  // Located at x: ~100 to ~150, y: ~200 to ~275
  await sharp(refPath)
    .extract({ left: 101, top: 201, width: 51, height: 75 })
    .toFile(path.join(assetsDir, 'about-home.jpg'));
  console.log('Extracted about-home.jpg');

  // 3. Categories (6 items): y: ~213 to ~247
  // x starts around 167: each is ~26x26, gap ~11
  await sharp(refPath)
    .extract({ left: 167, top: 213, width: 33, height: 32 })
    .toFile(path.join(assetsDir, 'cat-wedding.jpg'));
  await sharp(refPath)
    .extract({ left: 208, top: 213, width: 33, height: 32 })
    .toFile(path.join(assetsDir, 'cat-birthday.jpg'));
  await sharp(refPath)
    .extract({ left: 247, top: 213, width: 33, height: 32 })
    .toFile(path.join(assetsDir, 'cat-mehendi.jpg'));
  await sharp(refPath)
    .extract({ left: 286, top: 213, width: 33, height: 32 })
    .toFile(path.join(assetsDir, 'cat-diwali.jpg'));
  await sharp(refPath)
    .extract({ left: 325, top: 213, width: 33, height: 32 })
    .toFile(path.join(assetsDir, 'cat-rakshabandhan.jpg'));
  await sharp(refPath)
    .extract({ left: 366, top: 213, width: 33, height: 32 })
    .toFile(path.join(assetsDir, 'cat-pooja.jpg'));
  console.log('Extracted categories');

  // 4. Customize Gifts image (couple photo frame + mug):
  // Located at left: ~111, top: ~312, width: ~78, height: ~60
  await sharp(refPath)
    .extract({ left: 111, top: 312, width: 78, height: 60 })
    .toFile(path.join(assetsDir, 'customize-home.jpg'));
  console.log('Extracted customize-home.jpg');

  // 5. Featured Products (4 items): y: ~308 to ~342
  await sharp(refPath)
    .extract({ left: 206, top: 308, width: 37, height: 34 })
    .toFile(path.join(assetsDir, 'prod-custom-mug.jpg'));
  await sharp(refPath)
    .extract({ left: 256, top: 308, width: 37, height: 34 })
    .toFile(path.join(assetsDir, 'prod-fresh-bouquet.jpg'));
  await sharp(refPath)
    .extract({ left: 306, top: 308, width: 37, height: 34 })
    .toFile(path.join(assetsDir, 'prod-gift-hamper.jpg'));
  await sharp(refPath)
    .extract({ left: 356, top: 308, width: 37, height: 34 })
    .toFile(path.join(assetsDir, 'prod-photo-frame.jpg'));
  console.log('Extracted featured products');

  // 6. Home My Orders teaser image:
  await sharp(refPath)
    .extract({ left: 297, top: 395, width: 104, height: 42 })
    .toFile(path.join(assetsDir, 'orders-home.jpg'));
  console.log('Extracted orders-home.jpg');

  // 7. About page main story photo (box with flowers & tag "Handmade with Love"):
  // Located in panel 2 (About Us): left: ~601, top: ~163, width: ~116, height: ~160
  await sharp(refPath)
    .extract({ left: 601, top: 163, width: 117, height: 160 })
    .toFile(path.join(assetsDir, 'about-story.jpg'));
  console.log('Extracted about-story.jpg');

  // 8. Shop page products (Our Collection):
  // Panel 3 (left: 739 to 1020, top: 0 to 370)
  // Product 1 (Wedding Hamper): left: 800, top: 194, width: 56, height: 55
  await sharp(refPath)
    .extract({ left: 801, top: 194, width: 56, height: 55 })
    .toFile(path.join(assetsDir, 'shop-wedding-hamper.jpg'));
  // Product 2 (Birthday Mug): left: 869, top: 194, width: 56, height: 55
  await sharp(refPath)
    .extract({ left: 869, top: 194, width: 56, height: 55 })
    .toFile(path.join(assetsDir, 'shop-birthday-mug.jpg'));
  // Product 3 (Mehendi Gift Box): left: 933, top: 194, width: 56, height: 55
  await sharp(refPath)
    .extract({ left: 933, top: 194, width: 56, height: 55 })
    .toFile(path.join(assetsDir, 'shop-mehendi-box.jpg'));
  // Product 4 (Diwali Gift Set): left: 801, top: 354, width: 56, height: 55
  await sharp(refPath)
    .extract({ left: 801, top: 354, width: 56, height: 55 })
    .toFile(path.join(assetsDir, 'shop-diwali-set.jpg'));
  // Product 5 (Rakhi Hamper): left: 869, top: 354, width: 56, height: 55
  await sharp(refPath)
    .extract({ left: 869, top: 354, width: 56, height: 55 })
    .toFile(path.join(assetsDir, 'shop-rakhi-hamper.jpg'));
  // Product 6 (Pooja Thali): left: 933, top: 354, width: 56, height: 55
  await sharp(refPath)
    .extract({ left: 933, top: 354, width: 56, height: 55 })
    .toFile(path.join(assetsDir, 'shop-pooja-thali.jpg'));
  console.log('Extracted shop products');

  // 9. Product Details Page Main Mug image:
  // Panel bottom-left (left: 31, top: 542, width: 75, height: 80)
  await sharp(refPath)
    .extract({ left: 31, top: 542, width: 75, height: 80 })
    .toFile(path.join(assetsDir, 'detail-mug.jpg'));
  console.log('Extracted detail-mug.jpg');
}

extract().catch(console.error);
