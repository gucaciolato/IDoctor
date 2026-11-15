// Gera o PDF do manual: node pdf.js  (requer Playwright)
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 720 } });
  await p.goto('file://' + path.join(__dirname, 'manual.html'), { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.pdf({ path: path.join(__dirname, '..', 'kuravi-identidade-visual-v1.pdf'), width: '1200px', height: '720px', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
