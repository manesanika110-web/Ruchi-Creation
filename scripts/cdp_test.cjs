const { spawn } = require('child_process');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const proc = spawn(edgePath, [
  '--headless',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'http://localhost:5173/register'
]);

setTimeout(async () => {
  try {
    const res = await fetch('http://127.0.0.1:9222/json');
    const tabs = await res.json();
    const targetTab = tabs.find(t => t.url && t.url.includes('localhost:5173'));
    
    if (targetTab && targetTab.webSocketDebuggerUrl) {
      const ws = new WebSocket(targetTab.webSocketDebuggerUrl);
      ws.onopen = () => {
        ws.send(JSON.stringify({ id: 1, method: 'Network.enable' }));
        ws.send(JSON.stringify({ id: 2, method: 'Runtime.enable' }));
        ws.send(JSON.stringify({ id: 3, method: 'Log.enable' }));
        ws.send(JSON.stringify({ id: 4, method: 'Page.enable' }));
        // Reload to capture all requests from start
        ws.send(JSON.stringify({ id: 5, method: 'Page.reload' }));
      };
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Network.loadingFailed') {
          console.log('Network loadingFailed:', msg.params.errorText, msg.params.requestId);
        }
        if (msg.method === 'Network.responseReceived') {
          console.log('Response:', msg.params.response.status, msg.params.response.url);
        }
        if (msg.method === 'Runtime.consoleAPICalled') {
          console.log('Console:', msg.params.type, msg.params.args.map(a => a.value || a.description));
        }
        if (msg.method === 'Runtime.exceptionThrown') {
          console.log('Exception thrown:', msg.params.exceptionDetails.text, msg.params.exceptionDetails.exception?.description);
        }
      };

      setTimeout(() => {
        ws.send(JSON.stringify({
          id: 10,
          method: 'Runtime.evaluate',
          params: { expression: 'document.getElementById("root").innerHTML.length' }
        }));
      }, 3500);

      setTimeout(() => {
        proc.kill();
        process.exit(0);
      }, 5000);
    }
  } catch (e) {
    console.error('Error:', e);
    proc.kill();
    process.exit(1);
  }
}, 3000);
