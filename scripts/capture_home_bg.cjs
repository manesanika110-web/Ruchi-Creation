const { execSync } = require('child_process');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

const tests = [
  { name: 'home-bg-desktop-1', url: 'http://localhost:5173/', width: 1280, height: 1000 },
  { name: 'home-bg-mobile-1', url: 'http://localhost:5173/', width: 390, height: 1200 },
];

for (const t of tests) {
  const outPath = path.resolve(__dirname, '..', 'public', 'reference-assets', `test-${t.name}.png`);
  const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=${t.width},${t.height} --virtual-time-budget=3000 ${t.url}`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    console.log('Captured:', t.name);
  } catch (err) {
    console.error('Failed:', t.name, err.message);
  }
}
