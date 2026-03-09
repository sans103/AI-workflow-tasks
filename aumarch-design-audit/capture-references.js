const { chromium } = require('playwright');
const path = require('path');

const outputDir = path.join(__dirname, 'screenshots');

const sites = [
  { name: 'aumarch-current', url: 'https://aumarch.com', desc: 'Aum Architects (Current)' },
  { name: 'zaha-hadid', url: 'https://www.zaha-hadid.com', desc: 'Zaha Hadid Architects' },
  { name: 'big-dk', url: 'https://big.dk', desc: 'BIG (Bjarke Ingels Group)' },
  { name: 'snohetta', url: 'https://snohetta.com', desc: 'Snohetta' },
  { name: 'foster-partners', url: 'https://www.fosterandpartners.com', desc: 'Foster + Partners' },
  { name: 'mvrdv', url: 'https://www.mvrdv.com', desc: 'MVRDV' },
  { name: 'herzog-de-meuron', url: 'https://www.herzogdemeuron.com', desc: 'Herzog & de Meuron' },
  { name: 'steven-holl', url: 'https://www.stevenholl.com', desc: 'Steven Holl Architects' },
  { name: 'unstudio', url: 'https://www.unstudio.com', desc: 'UNStudio' },
  { name: 'som', url: 'https://www.som.com', desc: 'SOM' },
  { name: 'dezeen', url: 'https://www.dezeen.com', desc: 'Dezeen' },
  { name: 'archdaily', url: 'https://www.archdaily.com', desc: 'ArchDaily' },
  { name: 'locomotive', url: 'https://locomotive.ca/en', desc: 'Locomotive' },
  { name: 'beaucoup', url: 'https://beaucoup.studio/en/', desc: 'Beaucoup Studio' },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });

  for (const site of sites) {
    try {
      console.log(`Capturing ${site.desc} (${site.url})...`);
      const page = await context.newPage();
      await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(4000);

      // Dismiss any cookie banners or popups
      try {
        const cookieButtons = await page.$$('button, [role="button"], a');
        for (const btn of cookieButtons) {
          const text = await btn.textContent().catch(() => '');
          if (/accept|agree|got it|close|dismiss|ok|consent/i.test(text)) {
            await btn.click().catch(() => {});
            await page.waitForTimeout(500);
            break;
          }
        }
      } catch (e) {}

      await page.waitForTimeout(1000);

      await page.screenshot({
        path: path.join(outputDir, `${site.name}.png`),
        fullPage: false, // viewport only — hero/above-fold
      });

      await page.close();
      console.log(`  Done: ${site.name}.png`);
    } catch (err) {
      console.log(`  FAILED: ${site.name} — ${err.message}`);
    }
  }

  await browser.close();
  console.log('\nAll captures complete.');
})();
