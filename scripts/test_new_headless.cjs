const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\c8666b7c-bc4f-475f-ba0a-b3da427c78c1\\scratch';

function testHome() {
  const outPath = path.join(scratchDir, 'home_captured.png');
  const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outPath}" --window-size=1280,820 --virtual-time-budget=4000 "http://localhost:5173/"`;
  try {
    execSync(cmd, { stdio: 'inherit' });
    const size = fs.statSync(outPath).size;
    console.log(`home_captured size: ${size} bytes`);
  } catch (e) {
    console.error('Failed:', e.message);
  }
}

testHome();
