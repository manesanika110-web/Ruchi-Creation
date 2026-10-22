const { spawn } = require('child_process');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function check() {
  const proc = spawn(edgePath, ['--headless', '--disable-gpu', '--remote-debugging-port=9445', 'about:blank']);
  await new Promise(r => setTimeout(r, 2000));
  const res = await fetch('http://127.0.0.1:9445/json/new?http://localhost:5173/login', { method: 'PUT' });
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
  await new Promise(r => setTimeout(r, 2000));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const setVal = (sel, val) => {
        const el = document.querySelector(sel);
        const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        s.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };
      setVal('input[name="email"]', 'fakeuser999@test.com');
      setVal('input[name="password"]', 'fake12345');
      
      const submitBtn = document.querySelector('button[type="submit"]');
      submitBtn.click();
    })()`
  });

  await new Promise(r => setTimeout(r, 1200));
  const text = await send('Runtime.evaluate', { expression: 'document.body.innerText', returnByValue: true });
  console.log('Result text on invalid login:\n', text.result.value);
  ws.close();
  proc.kill();
}

check().catch(console.error);
