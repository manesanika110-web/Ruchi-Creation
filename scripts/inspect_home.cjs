const { spawn } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function check() {
  const proc = spawn(edgePath, ['--headless', '--disable-gpu', '--window-size=1280,800', '--remote-debugging-port=9455', 'about:blank']);
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9455/json/new?about:blank', { method: 'PUT' });
  const tab = await res.json();
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

  let id = 1;
  const send = (m, p = {}) => new Promise(res => {
    const cur = ++id;
    const h = (evt) => {
      const d = JSON.parse(evt.data);
      if (d.id === cur) { ws.removeEventListener('message', h); res(d.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: cur, method: m, params: p }));
  });

  await new Promise(r => ws.onopen = r);
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 3000));

  const links = await send('Runtime.evaluate', {
    expression: 'Array.from(document.querySelectorAll("a, button")).map(el => ({ tag: el.tagName, text: el.innerText.trim(), href: el.getAttribute("href") }))',
    returnByValue: true
  });
  console.log('Found elements:', JSON.stringify(links.result.value, null, 2));

  ws.close();
  proc.kill();
}

check().catch(console.error);
