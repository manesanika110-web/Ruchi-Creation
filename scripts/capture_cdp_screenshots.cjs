const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\c8666b7c-bc4f-475f-ba0a-b3da427c78c1\\scratch';

async function takeCDPScreenshot(url, outFileName, width = 1280, height = 800) {
  const port = 9225 + Math.floor(Math.random() * 100);
  const proc = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    `--window-size=${width},${height}`,
    `--remote-debugging-port=${port}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1800));

  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURIComponent('about:blank'), { method: 'PUT' });
    const tab = await res.json();
    console.log('Opened new tab:', tab.id);

    await new Promise((resolve, reject) => {
      const ws = new WebSocket(tab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Page.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({
          id: 3,
          method: 'Emulation.setDeviceMetricsOverride',
          params: { width, height, deviceScaleFactor: 1, mobile: width < 600 }
        }));
        ws.send(JSON.stringify({ id: 4, method: 'Page.navigate', params: { url } }));
      };

      ws.onmessage = async (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Page.loadEventFired') {
          console.log('Page loaded! Waiting for document.fonts.ready...');
          // Evaluate document.fonts.ready
          ws.send(JSON.stringify({
            id: 20,
            method: 'Runtime.evaluate',
            params: {
              expression: 'document.fonts.ready.then(() => true)',
              awaitPromise: true
            }
          }));
        }
        if (msg.id === 20) {
          console.log('Fonts ready! Waiting extra 1s for layout stabilization...');
          setTimeout(() => {
            ws.send(JSON.stringify({
              id: 30,
              method: 'Page.captureScreenshot',
              params: { format: 'png' }
            }));
          }, 1000);
        }
        if (msg.id === 30) {
          const outPath = path.join(scratchDir, outFileName);
          fs.writeFileSync(outPath, Buffer.from(msg.result.data, 'base64'));
          console.log(`Successfully captured ${outFileName}: ${fs.statSync(outPath).size} bytes`);
          ws.close();
          proc.kill();
          resolve();
        }
      };

      ws.onerror = (e) => {
        proc.kill();
        reject(e);
      };
    });
  } catch (err) {
    console.error('Error taking screenshot:', err);
    proc.kill();
  }
}

async function run() {
  console.log('Capturing Register Page...');
  await takeCDPScreenshot('http://localhost:5173/register', 'screen_register_actual.png', 1280, 800);
  console.log('Capturing Login Page...');
  await takeCDPScreenshot('http://localhost:5173/login', 'screen_login_actual.png', 1280, 800);
}

run().catch(console.error);
