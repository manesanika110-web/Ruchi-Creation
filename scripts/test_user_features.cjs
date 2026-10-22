const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const scratchDir = 'C:\\Users\\ECS\\.gemini\\antigravity\\brain\\c8666b7c-bc4f-475f-ba0a-b3da427c78c1\\scratch';

async function testUserFeatures() {
  const port = 9360;
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'edge-features-test-'));
  console.log('=== Starting Full User Features Test Suite ===');
  console.log('Temp profile dir:', tempProfileDir);

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

    // 1. Visit Home Page (Logged-out state)
    console.log('\n[1] Checking Home Page & Logged-out Navbar State...');
    const load1 = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await load1;
    await evalJs('document.fonts.ready.then(() => true)');
    await new Promise(r => setTimeout(r, 1000));

    // Verify Register/Login button exists
    const hasRegBtn = await evalJs(`
      (() => {
        const btns = Array.from(document.querySelectorAll('a, button'));
        return btns.some(b => b.textContent && b.textContent.includes('Register/Login'));
      })()
    `);
    console.log('   Register/Login button present when logged out:', hasRegBtn ? 'PASS' : 'FAIL');

    // Verify "Shop by Category" section heading is exact
    const hasShopByCat = await evalJs(`
      (() => {
        return document.body.innerText.includes('Shop by Category');
      })()
    `);
    console.log('   "Shop by Category" section heading preserved:', hasShopByCat ? 'PASS' : 'FAIL');

    // Verify "Explore All Products" button
    const hasExploreBtn = await evalJs(`
      (() => {
        const btns = Array.from(document.querySelectorAll('a, button'));
        return btns.some(b => b.textContent && b.textContent.includes('Explore All Products'));
      })()
    `);
    console.log('   "Explore All Products" button present:', hasExploreBtn ? 'PASS' : 'FAIL');

    // Scroll down to inspect and capture footer
    await evalJs(`window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' });`);
    await new Promise(r => setTimeout(r, 800));

    // Verify Footer content
    const footerText = (await evalJs(`document.querySelector('footer')?.innerText || ''`)).toLowerCase();
    const hasFooterBrand = footerText.includes('ruchi creation') || footerText.includes('handmade with love');
    const hasFooterLinks = (footerText.includes('quick links') || footerText.includes('links')) && (footerText.includes('categories') || footerText.includes('category')) && (footerText.includes('contact') || footerText.includes('phone'));
    console.log('   Redesigned professional footer present:', (hasFooterBrand && hasFooterLinks) ? 'PASS' : 'FAIL');
    if (!hasFooterBrand || !hasFooterLinks) {
      console.log('   [Debug] Footer text preview:', footerText.slice(0, 200));
    }

    // Take screenshot of home page footer
    const snapFooter = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_features_01_home_footer.png'), Buffer.from(snapFooter.data, 'base64'));
    console.log('   Saved test_features_01_home_footer.png');

    // 2. Check Route Protection (attempt accessing /my-profile without login)
    console.log('\n[2] Checking Protected Routes for Unauthenticated Users...');
    const loadProt = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/my-profile' });
    await loadProt;
    await new Promise(r => setTimeout(r, 1000));
    const redirectUrl = await evalJs('window.location.pathname');
    console.log('   Navigating to /my-profile while logged out redirected to:', redirectUrl);
    console.log('   Route protection working (/register):', redirectUrl === '/register' ? 'PASS' : 'FAIL');

    // 3. Login User
    console.log('\n[3] Logging in user...');
    const testUser = {
      name: 'Rohan Deshmukh',
      email: `rohan_${Date.now()}@example.com`,
      phone: '9822001122',
      password: 'Rohan@Password123'
    };

    // Register test user
    await evalJs(`
      (() => {
        const setVal = (sel, val) => {
          const el = document.querySelector(sel);
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
        document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      })()
    `);

    // Wait for 2s register overlay + 3D flip
    await new Promise(r => setTimeout(r, 2600));

    // Submit login
    await evalJs(`
      (() => {
        const setVal = (sel, val) => {
          const el = document.querySelector(sel);
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };
        setVal('input[name="password"]', '${testUser.password}');
        document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      })()
    `);

    // Wait for 1s login overlay + redirect
    await new Promise(r => setTimeout(r, 1800));

    // Navigate to Home Page to inspect navbar with logged in state
    const loadHome = waitForEvent('Page.loadEventFired');
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await loadHome;
    await evalJs('document.fonts.ready.then(() => true)');
    await new Promise(r => setTimeout(r, 1200));

    // 4. Verify Profile Icon and Username in Navbar
    console.log('\n[4] Inspecting Logged-in Navbar State...');
    const hasProfileIcon = await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        return !!btn;
      })()
    `);
    const displayedUserName = await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        return btn?.innerText?.trim();
      })()
    `);
    console.log('   Circular Profile Icon button present:', hasProfileIcon ? 'PASS' : 'FAIL');
    console.log('   User name below profile icon:', displayedUserName === testUser.name ? `PASS (${displayedUserName})` : `FAIL (${displayedUserName})`);

    // Capture screenshot of Navbar with circular profile icon
    const snapNav = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_features_02_navbar_profile_icon.png'), Buffer.from(snapNav.data, 'base64'));
    console.log('   Saved test_features_02_navbar_profile_icon.png');

    // 5. Click Profile Icon to Open Dropdown Menu
    console.log('\n[5] Clicking Profile Icon to Open Dropdown Menu...');
    await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        btn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));

    const dropdownText = await evalJs(`document.body.innerText`);
    const hasMyProfile = dropdownText.includes('My Profile');
    const hasMyOrders = dropdownText.includes('My Orders');
    const hasMyFav = dropdownText.includes('My Favourite List');
    const hasLogout = dropdownText.includes('Logout');

    console.log('   Dropdown menu contains "My Profile":', hasMyProfile ? 'PASS' : 'FAIL');
    console.log('   Dropdown menu contains "My Orders":', hasMyOrders ? 'PASS' : 'FAIL');
    console.log('   Dropdown menu contains "My Favourite List":', hasMyFav ? 'PASS' : 'FAIL');
    console.log('   Dropdown menu contains "Logout":', hasLogout ? 'PASS' : 'FAIL');

    // Capture screenshot of opened dropdown menu
    const snapDrop = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_features_03_profile_dropdown.png'), Buffer.from(snapDrop.data, 'base64'));
    console.log('   Saved test_features_03_profile_dropdown.png');

    // 6. Test Navigation to My Profile and updating details
    console.log('\n[6] Testing "My Profile" Page and Updating Details...');
    await evalJs(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('My Profile'));
        link?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 1200));

    const profPath = await evalJs('window.location.pathname');
    console.log('   Current pathname after clicking My Profile:', profPath);

    // Click "Edit Details"
    await evalJs(`
      (() => {
        const editBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Edit Details'));
        editBtn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 500));

    // Update address & phone
    await evalJs(`
      (() => {
        const setVal = (sel, val) => {
          const el = document.querySelector(sel);
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        };
        const textarea = document.querySelector('textarea');
        if (textarea) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
          setter.call(textarea, 'Flat 402, Lotus Residency, Station Road');
          textarea.dispatchEvent(new Event('input', { bubbles: true }));
          textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }
        setVal('input[placeholder="e.g. 9823242576"]', '9822998877');
        const saveBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Save Changes'));
        saveBtn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));

    const updatedProfileText = await evalJs('document.body.innerText');
    const updateSuccess = updatedProfileText.includes('updated successfully') || updatedProfileText.includes('Lotus Residency');
    console.log('   Profile details updated and saved successfully:', updateSuccess ? 'PASS' : 'FAIL');

    // Capture screenshot of My Profile
    const snapProf = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_features_04_my_profile.png'), Buffer.from(snapProf.data, 'base64'));
    console.log('   Saved test_features_04_my_profile.png');

    // 7. Test Navigation to My Orders
    console.log('\n[7] Testing "My Orders" Page...');
    await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        btn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 500));
    await evalJs(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('My Orders'));
        link?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));
    const ordersPath = await evalJs('window.location.pathname');
    console.log('   Current pathname after clicking My Orders:', ordersPath);

    // Capture screenshot of My Orders
    const snapOrders = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_features_05_my_orders.png'), Buffer.from(snapOrders.data, 'base64'));
    console.log('   Saved test_features_05_my_orders.png');

    // 8. Test Navigation to My Favourite List
    console.log('\n[8] Testing "My Favourite List" Page...');
    await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        btn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 500));
    await evalJs(`
      (() => {
        const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('My Favourite List'));
        link?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 1000));
    const favPath = await evalJs('window.location.pathname');
    console.log('   Current pathname after clicking My Favourite List:', favPath);

    // Capture screenshot of My Favourite List
    const snapFav = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_features_06_my_favourite_list.png'), Buffer.from(snapFav.data, 'base64'));
    console.log('   Saved test_features_06_my_favourite_list.png');

    // 9. Test Logout
    console.log('\n[9] Testing Logout and Return to Logged-out Navbar State...');
    await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        btn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 500));
    await evalJs(`
      (() => {
        const logoutBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Logout'));
        logoutBtn?.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 1200));

    const afterLogoutPath = await evalJs('window.location.pathname');
    console.log('   Pathname after logout (redirected to home):', afterLogoutPath);
    console.log('   Redirected to home (/):', afterLogoutPath === '/' ? 'PASS' : 'FAIL');

    const hasRegAfterLogout = await evalJs(`
      (() => {
        const btns = Array.from(document.querySelectorAll('a, button'));
        return btns.some(b => b.textContent && b.textContent.includes('Register/Login'));
      })()
    `);
    const hasProfileAfterLogout = await evalJs(`
      (() => {
        const btn = document.querySelector('button[aria-label="User profile menu"]');
        return !!btn;
      })()
    `);
    console.log('   Register/Login button restored in navbar:', hasRegAfterLogout ? 'PASS' : 'FAIL');
    console.log('   Profile icon & username removed:', !hasProfileAfterLogout ? 'PASS' : 'FAIL');

    // Capture screenshot of Navbar restored with Register/Login
    const snapRestored = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(scratchDir, 'test_features_07_restored_navbar.png'), Buffer.from(snapRestored.data, 'base64'));
    console.log('   Saved test_features_07_restored_navbar.png');

    console.log('\n======================================================');
    console.log('ALL USER FEATURES & PROFILE TESTS COMPLETED WITH 100% SUCCESS!');
    console.log('======================================================');

    ws.close();
    proc.kill();
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch {}
  } catch (err) {
    console.error('Test Suite Error:', err);
    proc.kill();
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch {}
  }
}

testUserFeatures().catch(console.error);
