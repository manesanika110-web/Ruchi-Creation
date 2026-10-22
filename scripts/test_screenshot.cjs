const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\162b1676-82a3-467b-9988-25e0923699c5\\scratch';
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });
const outPath = path.join(scratchDir, 'full_home.png');

const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=1200,1600 --virtual-time-budget=2000 http://localhost:5173/`;
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Successfully captured screenshot:', outPath);
} catch (e) {
  console.error('Error capturing screenshot:', e.message);
}
