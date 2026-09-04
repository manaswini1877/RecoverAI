const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');
const http = require('http');
const { spawn } = require('child_process');

function findBrowserExecutable() {
  const possiblePaths = [
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env.LOCALAPPDATA + '\\Microsoft\\Edge\\Application\\msedge.exe',
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  throw new Error('No browser executable found');
}

async function checkServer() {
  return new Promise((resolve) => {
    const req = http.get('http://127.0.0.1:4173', (res) => {
      resolve(res.statusCode === 200);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function run() {
  console.log('--- TESTING FLOW A: SUCCESSFUL SAFE RECOVERY ---');
  const browserPath = findBrowserExecutable();

  let server = null;
  const isRunning = await checkServer();
  if (!isRunning) {
    const viteBin = path.join(__dirname, '..', 'node_modules', 'vite', 'bin', 'vite.js');
    server = spawn(process.execPath, [viteBin, 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'ignore',
    });
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 500));
      if (await checkServer()) break;
    }
  }
  console.log('✅ Preview server active');

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  const baseUrl = 'http://127.0.0.1:4173';
  const screenshotsDir = path.join(__dirname, '..', 'screenshots');

  try {
    // 1. Reset data first to have a pristine baseline
    await page.goto(`${baseUrl}/app/settings`, { waitUntil: 'networkidle0' });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const resetBtn = btns.find((b) => b.textContent.includes('Reset All Workspace Demo Data'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // 2. Check baseline recovered revenue in /app/overview
    await page.goto(`${baseUrl}/app/overview`, { waitUntil: 'networkidle0' });
    let overviewContent = await page.content();
    console.log('Baseline overview loaded');

    // 3. Navigate to /demo
    await page.goto(`${baseUrl}/demo`, { waitUntil: 'networkidle0' });
    console.log('Step 1 loaded');

    // Step 1 -> Step 2
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.textContent.includes('Verify Agent Authorization'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Step 2 -> Step 3
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.textContent.includes('Simulate Payment Attempt'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Step 3 -> Step 4
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find((b) => b.textContent.includes('Run Trust-Aware Recovery Analysis'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    console.log('Step 4 loaded (Confidence metrics & safe decision)');

    // Step 4: Click Flow A: "Simulate customer paid (Complete safe recovery)"
    const clickedFlowA = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const flowABtn = btns.find(
        (b) =>
          b.textContent.includes('Simulate customer paid') ||
          b.textContent.includes('Complete safe recovery') ||
          b.textContent.includes('Flow A: Safe Recovery')
      );
      if (flowABtn) {
        flowABtn.click();
        return true;
      }
      return false;
    });
    console.log('Clicked Flow A button:', clickedFlowA);
    await new Promise((r) => setTimeout(r, 1000));

    // Take screenshot of Receipt Modal
    await page.screenshot({ path: path.join(screenshotsDir, 'flow_a_receipt_modal.png') });

    // Inspect Receipt Modal Content
    const receiptContent = await page.content();
    const checks = {
      originalAmount: receiptContent.includes('₹9,800'),
      recoveredRevenue: receiptContent.includes('₹9,800'),
      outcomeRecovered: receiptContent.includes('Outcome:') && receiptContent.includes('RECOVERED'),
      paymentStatus: receiptContent.includes('Payment Status:') && receiptContent.includes('CAPTURE_SIMULATED'),
      recoveryAction: receiptContent.includes('Alternate UPI link'),
      duplicateRisk: receiptContent.includes('4%'),
      retriesAvoided: receiptContent.includes('Retries Avoided:') && receiptContent.includes('1'),
      customerMessages: receiptContent.includes('Customer Messages Sent:') && receiptContent.includes('1'),
    };

    console.log('Receipt Checks:', JSON.stringify(checks, null, 2));

    // Close Receipt Modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find((b) => b.textContent.trim() === 'Close');
      if (closeBtn) closeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // 4. Verify /app/overview shows updated revenue (+₹9,800 -> ₹1,96,300)
    await page.goto(`${baseUrl}/app/overview`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'flow_a_overview_metrics.png') });
    overviewContent = await page.content();

    const overviewUpdated = overviewContent.includes('1,96,300') || overviewContent.includes('196,300');
    console.log('Dashboard Recovered Revenue Increased to ₹1,96,300:', overviewUpdated);

    // 5. Verify /app/cases/REC-10482 shows RECOVERED
    await page.goto(`${baseUrl}/app/cases/REC-10482`, { waitUntil: 'networkidle0' });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(screenshotsDir, 'flow_a_case_detail.png') });
    const caseContent = await page.content();
    const caseRecovered = caseContent.includes('recovered') || caseContent.includes('RECOVERED');
    const timelineHasPayment = caseContent.includes('Payment Recovered') || caseContent.includes('Customer completed checkout');

    console.log('Case REC-10482 status is RECOVERED:', caseRecovered);
    console.log('Case REC-10482 timeline updated:', timelineHasPayment);

    const allPassed =
      clickedFlowA &&
      checks.originalAmount &&
      checks.recoveredRevenue &&
      checks.outcomeRecovered &&
      checks.paymentStatus &&
      checks.recoveryAction &&
      checks.duplicateRisk &&
      checks.retriesAvoided &&
      checks.customerMessages &&
      overviewUpdated &&
      caseRecovered;

    console.log('\n=======================================');
    console.log(`FLOW A OVERALL VERIFICATION: ${allPassed ? 'PASSED 100%' : 'FAILED'}`);
    console.log('=======================================');

    fs.writeFileSync(
      path.join(__dirname, 'flow-a-results.json'),
      JSON.stringify(
        {
          allPassed,
          checks,
          overviewUpdated,
          caseRecovered,
          timelineHasPayment,
        },
        null,
        2
      )
    );

    if (!allPassed) {
      process.exit(1);
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }
}

run().catch((err) => {
  console.error('Flow A test failed:', err);
  process.exit(1);
});
