const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const tests = [
  { name: 'home-desktop', url: 'http://localhost:5173/', width: 1280, height: 800 },
  { name: 'home-mobile', url: 'http://localhost:5173/', width: 390, height: 844 },
  { name: 'about-desktop', url: 'http://localhost:5173/about', width: 1280, height: 800 },
  { name: 'shop-desktop', url: 'http://localhost:5173/shop', width: 1280, height: 800 },
  { name: 'customize-desktop', url: 'http://localhost:5173/customize-gifts', width: 1280, height: 800 },
  { name: 'customize-mobile', url: 'http://localhost:5173/customize-gifts', width: 390, height: 844 }
];

const path = require('path');

for (const t of tests) {
  const outPath = path.resolve(__dirname, '..', 'public', 'reference-assets', `screenshot-${t.name}.png`);
  const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=${t.width},${t.height} --virtual-time-budget=3000 ${t.url}`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('Captured:', t.name, '->', outPath);
  } catch (err) {
    console.error('Failed to capture:', t.name, err.message);
  }
}
