const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\c8666b7c-bc4f-475f-ba0a-b3da427c78c1\\scratch';
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir, { recursive: true });

async function run() {
  const registerOut = path.join(scratchDir, 'screenshot_register.png');
  const loginOut = path.join(scratchDir, 'screenshot_login.png');

  // Desktop Register
  const cmdReg = `"${edgePath}" --headless --disable-gpu --screenshot="${registerOut}" --window-size=1280,820 --virtual-time-budget=3000 http://localhost:5173/register`;
  execSync(cmdReg, { stdio: 'inherit' });
  console.log('Captured register screenshot:', registerOut);

  // Desktop Login
  const cmdLog = `"${edgePath}" --headless --disable-gpu --screenshot="${loginOut}" --window-size=1280,820 --virtual-time-budget=3000 http://localhost:5173/login`;
  execSync(cmdLog, { stdio: 'inherit' });
  console.log('Captured login screenshot:', loginOut);
}

run().catch(console.error);
