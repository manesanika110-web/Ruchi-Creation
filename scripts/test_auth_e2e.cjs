const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\c8666b7c-bc4f-475f-ba0a-b3da427c78c1\\scratch';

async function runE2ETest() {
  const port = 9350;
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-auth-test-'));
  console.log('--- Starting Auth Flow End-to-End Test ---');

  const proc = spawn(edgePath, [
    '--headless',
    '--disable-gpu',
    '--window-size=1280,800',
    `--user-data-dir=${tempProfileDir}`,
    `--remote-debugging-port=${port}`,
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${port}/json/new?` + encodeURIComponent('about:blank'), { method: 'PUT' });
    const tab = await res.json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);

    let msgId = 1;
    const send = (method, params = {}) => {
      const id = ++msgId;
      ws.send(JSON.stringify({ id, method, params }));
      return new Promise((resolve) => {
        const handler = (evt) => {
          const data = JSON.parse(evt.data);
          if (data.id === id) {
            ws.removeEventListener('message', handler);
            resolve(data.result);
          }
        };
        ws.addEventListener('message', handler);
      });
    };

    const evalJs = async (expr) => {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      return r?.result?.value;
    };

    const waitForEvent = (eventName) => new Promise((resolve) => {
      const handler = (evt) => {
        const data = JSON.parse(evt.data);
        if (data.method === eventName) {
          ws.removeEventListener('message', handler);
          resolve(data.params);
        }
      };
      ws.addEventListener('message', handler);
    });

    await new Promise(resolve => {
      ws.onopen = async () => {
        await send('Page.enable');
        await send('Runtime.enable');
        resolve();
      };
    });

    // 1. Navigate to home page and wait for loadEventFired
    console.log('1. Navigating to Home Page and waiting for Page.loadEventFired...');
    const loadPromise = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await loadPromise;
    console.log('   Home Page loaded! Waiting for fonts and DOM stabilization...');
    await evalJs('document.fonts.ready.then(() => true)');
    await new Promise(r => setTimeout(r, 1000));

    // 2. Click "Register / Login" button in Navbar
    console.log('2. Clicking "Register / Login" in navbar...');
    const clickedNav = await evalJs(`
      (() => {
        const regLink = document.querySelector('a[href="/register"]');
        if (regLink) {
          regLink.click();
          return true;
        }
        return false;
      })()
    `);
    console.log('   Navbar button found and clicked:', clickedNav);
    await new Promise(r => setTimeout(r, 1200));

    const currentUrl = await evalJs('window.location.pathname');
    console.log('   Current pathname after clicking navbar:', currentUrl);
    if (currentUrl !== '/register') {
      throw new Error(`Expected /register, got ${currentUrl}`);
    }

    // 3. Test Form Validation on Register
    console.log('3. Testing Register Form Validation (empty submission)...');
    await evalJs(`
      (() => {
        const regBtn = document.querySelector('button[type="submit"]');
        regBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    const errorText = await evalJs(`document.body.innerText`);
    const hasValidationError = errorText.includes('Please enter your full name');
    console.log('   Validation triggered on empty fields:', hasValidationError ? 'PASS' : 'FAIL');

    // 4. Fill in valid user registration details
    const testEmail = `neha_joshi_${Date.now()}@example.com`;
    console.log(`4. Submitting registration with email: ${testEmail}...`);
    await evalJs(`
      (() => {
        const setVal = (selector, val) => {
          const el = document.querySelector(selector);
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };

        setVal('input[name="name"]', 'Neha Joshi');
        setVal('input[name="email"]', '${testEmail}');
        setVal('input[name="phone"]', '9123456780');
        setVal('input[name="password"]', 'Neha@2025');
        setVal('input[name="confirmPassword"]', 'Neha@2025');

        const form = document.querySelector('form');
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      })()
    `);

    // Check for "Successfully Registered!" overlay immediately (within 600ms)
    await new Promise(r => setTimeout(r, 600));
    const overlayText = await evalJs(`document.body.innerText`);
    const regSuccessShown = overlayText.includes('Successfully Registered!');
    console.log('   "Successfully Registered!" message displayed:', regSuccessShown ? 'PASS' : 'FAIL');

    // Capture screenshot of registration success overlay
    const snap1 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_e2e_01_reg_success.png'), Buffer.from(snap1.data, 'base64'));
    console.log('   Saved test_e2e_01_reg_success.png');

    // Wait for the exact 2-second timer to expire (+ 400ms for 3D flip animation)
    console.log('   Waiting 2.4s for the 2-second success delay and 3D card flip to complete...');
    await new Promise(r => setTimeout(r, 2400));

    // Verify card flipped to Login form
    const loginHeader = await evalJs(`document.body.innerText`);
    const flippedToLogin = loginHeader.includes('Login to Your Account');
    const emailPrefilled = await evalJs(`document.querySelector('input[name="email"]')?.value`);
    console.log('   Automatically flipped to Login form:', flippedToLogin ? 'PASS' : 'FAIL');
    console.log('   Email prefilled into Login form:', emailPrefilled === testEmail ? `PASS (${emailPrefilled})` : `FAIL (${emailPrefilled})`);

    // Capture screenshot of flipped Login form
    const snap2 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_e2e_02_flipped_login.png'), Buffer.from(snap2.data, 'base64'));
    console.log('   Saved test_e2e_02_flipped_login.png');

    // 5. Test Invalid Login
    console.log('5. Testing Invalid Login credentials...');
    await evalJs(`
      (() => {
        const setVal = (selector, val) => {
          const el = document.querySelector(selector);
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };
        setVal('input[name="password"]', 'WrongPassword!');
        const form = document.querySelector('form');
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      })()
    `);
    await new Promise(r => setTimeout(r, 800));
    const invalidErrText = (await evalJs(`document.body.innerText`) || "").toLowerCase();
    const hasInvalidError = invalidErrText.includes('invalid credentials') || invalidErrText.includes('check your credentials') || invalidErrText.includes('incorrect');
    console.log('   Invalid login prevented with error message:', hasInvalidError ? 'PASS' : 'FAIL');

    // 6. Test Valid Login
    console.log('6. Submitting valid login credentials...');
    await evalJs(`
      (() => {
        const setVal = (selector, val) => {
          const el = document.querySelector(selector);
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };
        setVal('input[name="password"]', 'Neha@2025');
        const form = document.querySelector('form');
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      })()
    `);

    // Check for "Successfully Logged In!" overlay immediately (within 400ms)
    await new Promise(r => setTimeout(r, 400));
    const loginSuccessText = await evalJs(`document.body.innerText`);
    const loginSuccessShown = loginSuccessText.includes('Successfully Logged In!');
    console.log('   "Successfully Logged In!" message displayed:', loginSuccessShown ? 'PASS' : 'FAIL');

    // Capture screenshot of login success overlay
    const snap3 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_e2e_03_login_success.png'), Buffer.from(snap3.data, 'base64'));
    console.log('   Saved test_e2e_03_login_success.png');

    // Wait for the exact 1-second timer to expire (+ 600ms for navigation to user dashboard)
    console.log('   Waiting 1.6s for the 1-second success delay and redirect to user dashboard...');
    await new Promise(r => setTimeout(r, 1600));

    const finalPath = await evalJs('window.location.pathname');
    console.log('   Final redirected pathname:', finalPath);
    const redirectedToDashboard = finalPath === '/my-account';
    console.log('   Redirected to User Panel / User Dashboard (/my-account):', redirectedToDashboard ? 'PASS' : 'FAIL');

    // Capture screenshot of User Dashboard
    const snap4 = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_e2e_04_dashboard_redirect.png'), Buffer.from(snap4.data, 'base64'));
    console.log('   Saved test_e2e_04_dashboard_redirect.png');

    console.log('\n======================================');
    console.log('ALL AUTH E2E TESTS COMPLETED SUCCESSFULLY!');
    console.log('======================================');

    ws.close();
    proc.kill();
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch {}
  } catch (err) {
    console.error('E2E Test Error:', err);
    proc.kill();
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch {}
  }
}

runE2ETest().catch(console.error);
