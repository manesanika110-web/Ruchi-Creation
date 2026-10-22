const { execSync } = require('child_process');
const path = require('path');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outShop = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\162b1676-82a3-467b-9988-25e0923699c5\\scratch\\shop_page.png';

const cmd = `"${edgePath}" --headless --disable-gpu --screenshot="${outShop}" --window-size=1200,1200 --virtual-time-budget=2000 http://localhost:5173/shop`;
try {
  execSync(cmd, { stdio: 'inherit' });
  console.log('Saved shop screenshot:', outShop);
} catch (e) {
  console.error(e.message);
}
