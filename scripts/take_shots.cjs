const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\c8666b7c-bc4f-475f-ba0a-b3da427c78c1\\scratch';
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

function capture(url, filename, width = 1280, height = 800) {
  const outPath = path.join(scratchDir, filename);
  // Using user-data-dir in a temp scratch folder avoids Edge identity fetch failure
  const userDataDir = path.join(scratchDir, 'edge_profile_' + Date.now());
  const cmd = `"${edgePath}" --headless --disable-gpu --user-data-dir="${userDataDir}" --screenshot="${outPath}" --window-size=${width},${height} --virtual-time-budget=3000 "${url}"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    const size = fs.statSync(outPath).size;
    console.log(`Captured ${filename}: ${size} bytes`);
  } catch (e) {
    console.error(`Failed ${filename}:`, e.message);
  }
}

capture('http://localhost:4173/register', 'screen_register_preview.png', 1280, 800);
capture('http://localhost:4173/login', 'screen_login_preview.png', 1280, 800);
