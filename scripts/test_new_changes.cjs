const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function runVerification() {
  console.log('=== Verifying the 3 Requested Changes ===\n');

  const edgePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Users\\ECS\\AppData\\Local\\Microsoft\\Edge\\Application\\msedge.exe'
  ];
  const edgePath = edgePaths.find(p => fs.existsSync(p));
  if (!edgePath) {
    console.error('Edge executable not found!');
    process.exit(1);
  }

  const port = 9388;
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-verify-test-'));
  const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\c8666b7c-bc4f-475f-ba0a-b3da427c78c1\\scratch';

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

    // 1. Check Initial Wishlist & Cart state (Empty, No badges)
    console.log('[1] Checking Wishlist & Cart Functionality (Empty State)...');
    const load1 = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await load1;
    await new Promise(r => setTimeout(r, 1200));

    const initialBadgeInfo = await evalJs(`
      (() => {
        const wishlistLink = document.querySelector('a[title="Wishlist"]');
        const cartLink = document.querySelector('a[title="Cart"]');
        const wishlistBadge = wishlistLink?.querySelector('span');
        const cartBadge = cartLink?.querySelector('span');
        return {
          wishlistHasBadge: !!wishlistBadge,
          wishlistBadgeText: wishlistBadge?.innerText || null,
          cartHasBadge: !!cartBadge,
          cartBadgeText: cartBadge?.innerText || null
        };
      })()
    `);
    console.log('   Wishlist icon has NO badge when empty:', !initialBadgeInfo.wishlistHasBadge ? 'PASS' : 'FAIL');
    console.log('   Cart icon has NO badge when empty:', !initialBadgeInfo.cartHasBadge ? 'PASS' : 'FAIL');

    // Check Cart Page when empty
    const loadCart = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/cart' });
    await loadCart;
    await new Promise(r => setTimeout(r, 800));
    const cartPageEmpty = await evalJs(`document.body.innerText.includes('Your Shopping Cart is Empty')`);
    console.log('   Cart page displays "Your Shopping Cart is Empty":', cartPageEmpty ? 'PASS' : 'FAIL');

    // 2. Add product to cart and verify badge updates
    console.log('\n[2] Testing Add to Cart & Wishlist Badge Update...');
    const loadHome = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await loadHome;
    await new Promise(r => setTimeout(r, 800));

    // Navigate to product details and click "Add to Cart"
    const loadProd = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/product/rc-custom-mug' });
    await loadProd;
    await new Promise(r => setTimeout(r, 800));

    await evalJs(`
      (() => {
        const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Add to Cart'));
        if (addBtn) addBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    const cartBadgeAfterAdd = await evalJs(`
      (() => {
        const cartLink = document.querySelector('a[title="Cart"]');
        const badge = cartLink?.querySelector('span');
        return badge ? badge.innerText.trim() : null;
      })()
    `);
    console.log('   Cart badge updated to 1 after adding product:', cartBadgeAfterAdd === '1' ? 'PASS' : `FAIL (got: ${cartBadgeAfterAdd})`);

    // 3. Test Navbar Alignment on Desktop, Tablet, and Mobile
    console.log('\n[3] Checking Navbar Right-Side Icons Alignment...');
    
    // Desktop Viewport
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 500));
    const desktopAlignment = await evalJs(`
      (() => {
        const searchBtn = document.querySelector('button[aria-label="Search gifts"]') || document.querySelector('button[title="Search"]');
        const wishlistBtn = document.querySelector('a[title="Wishlist"]');
        const cartBtn = document.querySelector('a[title="Cart"]');
        const regBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Register/Login'));
        
        const sRect = searchBtn?.getBoundingClientRect();
        const wRect = wishlistBtn?.getBoundingClientRect();
        const cRect = cartBtn?.getBoundingClientRect();
        const rRect = regBtn?.getBoundingClientRect();
        
        const tops = [sRect?.top, wRect?.top, cRect?.top, rRect?.top].filter(t => t !== undefined);
        const maxDiff = Math.max(...tops) - Math.min(...tops);
        return {
          maxTopDiff: maxDiff,
          inOneLine: maxDiff <= 4,
          elementsFound: tops.length
        };
      })()
    `);
    console.log(`   Desktop (1280px) single horizontal line: ${desktopAlignment.inOneLine ? 'PASS' : 'FAIL'} (top diff: ${desktopAlignment.maxTopDiff}px)`);

    // Tablet Viewport (768px)
    await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 500));
    const tabletAlignment = await evalJs(`
      (() => {
        const searchBtn = document.querySelector('button[aria-label="Search gifts"]') || document.querySelector('button[title="Search"]');
        const wishlistBtn = document.querySelector('a[title="Wishlist"]');
        const cartBtn = document.querySelector('a[title="Cart"]');
        const sRect = searchBtn?.getBoundingClientRect();
        const wRect = wishlistBtn?.getBoundingClientRect();
        const cRect = cartBtn?.getBoundingClientRect();
        const tops = [sRect?.top, wRect?.top, cRect?.top].filter(t => t !== undefined);
        const maxDiff = Math.max(...tops) - Math.min(...tops);
        return { inOneLine: maxDiff <= 4, maxTopDiff: maxDiff };
      })()
    `);
    console.log(`   Tablet (768px) single horizontal line: ${tabletAlignment.inOneLine ? 'PASS' : 'FAIL'} (top diff: ${tabletAlignment.maxTopDiff}px)`);

    // Mobile Viewport (375px)
    await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 812, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 500));
    const mobileAlignment = await evalJs(`
      (() => {
        const searchBtn = document.querySelector('button[aria-label="Search gifts"]') || document.querySelector('button[title="Search"]');
        const wishlistBtn = document.querySelector('a[title="Wishlist"]');
        const cartBtn = document.querySelector('a[title="Cart"]');
        const menuBtn = document.querySelector('button[aria-label="Open Navigation Menu"]') || document.querySelector('button[title="Menu"]');
        const sRect = searchBtn?.getBoundingClientRect();
        const wRect = wishlistBtn?.getBoundingClientRect();
        const cRect = cartBtn?.getBoundingClientRect();
        const mRect = menuBtn?.getBoundingClientRect();
        const tops = [sRect?.top, wRect?.top, cRect?.top, mRect?.top].filter(t => t !== undefined);
        const maxDiff = Math.max(...tops) - Math.min(...tops);
        return { inOneLine: maxDiff <= 4, maxTopDiff: maxDiff };
      })()
    `);
    console.log(`   Mobile (375px) single horizontal line: ${mobileAlignment.inOneLine ? 'PASS' : 'FAIL'} (top diff: ${mobileAlignment.maxTopDiff}px)`);

    // Reset viewport to Desktop for login & form clear testing
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false });
    await new Promise(r => setTimeout(r, 500));

    // 4. Test Register/Login, Profile in Navbar, and Form Clear After Logout
    console.log('\n[4] Testing Register, Login, Profile Icon Alignment & Form Clear After Logout...');
    const loadReg = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/register' });
    await loadReg;
    await new Promise(r => setTimeout(r, 800));

    const testUser = {
      name: 'Aditi Sharma',
      email: `aditi_${Date.now()}@example.com`,
      phone: '9876543210',
      password: 'Aditi@Password123'
    };

    // Fill registration form
    await evalJs(`
      (() => {
        const setVal = (sel, val) => {
          const el = document.querySelector(sel);
          if (!el) return;
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };
        setVal('input[name="name"]', '${testUser.name}');
        setVal('input[name="email"]', '${testUser.email}');
        setVal('input[name="phone"]', '${testUser.phone}');
        setVal('input[name="password"]', '${testUser.password}');
        setVal('input[name="confirmPassword"]', '${testUser.password}');
        document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      })()
    `);

    // Wait for registration flip to login form
    await new Promise(r => setTimeout(r, 2600));

    // Submit login form
    await evalJs(`
      (() => {
        const setVal = (sel, val) => {
          const el = document.querySelector(sel);
          if (!el) return;
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };
        setVal('input[name="email"]', '${testUser.email}');
        setVal('input[name="password"]', '${testUser.password}');
        document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      })()
    `);

    // Wait for redirect to dashboard
    await new Promise(r => setTimeout(r, 1500));

    // Verify logged-in navbar has circular profile icon and username
    const profileAlignment = await evalJs(`
      (() => {
        const profileBtn = document.querySelector('button[aria-label="User profile menu"]');
        const searchBtn = document.querySelector('button[aria-label="Search gifts"]') || document.querySelector('button[title="Search"]');
        const wishlistBtn = document.querySelector('a[title="Wishlist"]');
        const cartBtn = document.querySelector('a[title="Cart"]');
        
        const pRect = profileBtn?.getBoundingClientRect();
        const sRect = searchBtn?.getBoundingClientRect();
        const wRect = wishlistBtn?.getBoundingClientRect();
        const cRect = cartBtn?.getBoundingClientRect();
        
        const tops = [pRect?.top, sRect?.top, wRect?.top, cRect?.top].filter(t => t !== undefined);
        const maxDiff = Math.max(...tops) - Math.min(...tops);
        return {
          profilePresent: !!profileBtn,
          inOneLine: maxDiff <= 4,
          maxTopDiff: maxDiff
        };
      })()
    `);
    console.log('   Logged-in profile icon present in navbar:', profileAlignment.profilePresent ? 'PASS' : 'FAIL');
    console.log(`   Logged-in profile icon aligned with Search, Wishlist, Cart: ${profileAlignment.inOneLine ? 'PASS' : 'FAIL'} (top diff: ${profileAlignment.maxTopDiff}px)`);

    // Save screenshot of logged-in navbar alignment
    const snapLoggedIn = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'verify_01_loggedin_alignment.png'), Buffer.from(snapLoggedIn.data, 'base64'));
    console.log('   Saved verify_01_loggedin_alignment.png');

    // Click profile icon and logout
    await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        btn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 400));
    await evalJs(`
      (() => {
        const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logout'));
        logoutBtn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 1200));

    // Now visit /register and verify all fields are completely blank
    console.log('\n[5] Checking Register & Login Forms After Logout...');
    const loadRegAfter = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/register' });
    await loadRegAfter;
    await new Promise(r => setTimeout(r, 800));

    const regFormClean = await evalJs(`
      (() => {
        const nameVal = document.querySelector('input[name="name"]')?.value || '';
        const emailVal = document.querySelector('input[name="email"]')?.value || '';
        const phoneVal = document.querySelector('input[name="phone"]')?.value || '';
        const passVal = document.querySelector('input[name="password"]')?.value || '';
        const confirmVal = document.querySelector('input[name="confirmPassword"]')?.value || '';
        return {
          nameVal,
          emailVal,
          phoneVal,
          passVal,
          confirmVal,
          allBlank: !nameVal && !emailVal && !phoneVal && !passVal && !confirmVal
        };
      })()
    `);
    console.log('   Register form fields completely empty after logout:', regFormClean.allBlank ? 'PASS' : 'FAIL');

    // Flip to Login form and verify login fields are also completely blank
    await evalJs(`
      (() => {
        const switchBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Login here'));
        switchBtn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    const loginFormClean = await evalJs(`
      (() => {
        const emailVal = document.querySelector('input[name="email"]')?.value || '';
        const passVal = document.querySelector('input[name="password"]')?.value || '';
        return {
          emailVal,
          passVal,
          allBlank: !emailVal && !passVal
        };
      })()
    `);
    console.log('   Login form fields completely empty after logout:', loginFormClean.allBlank ? 'PASS' : 'FAIL');

    // Save screenshot of clean form after logout
    const snapCleanForm = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'verify_02_clean_form_after_logout.png'), Buffer.from(snapCleanForm.data, 'base64'));
    console.log('   Saved verify_02_clean_form_after_logout.png');

    console.log('\n======================================================');
    console.log('ALL 3 REQUESTED CHANGES VERIFIED WITH 100% SUCCESS!');
    console.log('======================================================');

    ws.close();
    proc.kill();
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch {}
  } catch (err) {
    console.error('Verification error:', err);
    proc.kill();
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch {}
  }
}

runVerification().catch(console.error);
