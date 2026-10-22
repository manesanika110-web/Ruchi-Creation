const { execSync } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

try {
  const out = execSync(`"${edgePath}" --headless --disable-gpu --virtual-time-budget=5000 --dump-dom "http://localhost:5173/register"`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
  console.log('DOM length:', out.length);
  console.log('Has Create Your Account:', out.includes('Create Your Account'));
  console.log('Has Ruchi Creation:', out.includes('Ruchi Creation'));
  const rootIdx = out.indexOf('<div id="root">');
  console.log('Root snippet:', out.slice(rootIdx, rootIdx + 300));
} catch (e) {
  console.error('Error:', e.message);
}
