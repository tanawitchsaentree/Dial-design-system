const { chromium } = require(process.cwd() + '/node_modules/.pnpm/playwright@1.64.1/node_modules/playwright');
const V = {
  A: `.page-head .lede p:not([data-component], [data-component] *){font-size:var(--ds-type-reading)!important;max-inline-size:none!important}
      .book-section .prose p,.book-section .prose li{max-inline-size:none!important}`,
  B: `@media (width>768px){.book-section:not(.wide)>.prose{padding-inline-start:0!important}.book-section:not(.wide)>.prose>h2{position:static!important;inline-size:auto!important}}
      .page-head .lede p:not([data-component], [data-component] *){font-size:var(--ds-type-reading)!important;max-inline-size:68ch!important}
      .book-section .prose p,.book-section .prose li{max-inline-size:68ch!important}`,
  C: `.page-head .lede{padding-inline-start:calc(var(--hang) + var(--gutter) * 2)}
      .page-head .lede p:not([data-component], [data-component] *){font-size:var(--ds-type-reading)!important;max-inline-size:none!important}
      .book-section .prose p,.book-section .prose li{max-inline-size:none!important}`,
};
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1333, height: 1300 } });
  for (const [k, css] of Object.entries(V)) {
    await p.goto('http://localhost:4173/principles', { waitUntil: 'networkidle' });
    await p.addStyleTag({ content: css }); await p.waitForTimeout(200);
    const m = await p.evaluate(() => [...document.querySelectorAll('.page-head .lede p, .book-section .prose > p')].slice(0, 3).map(e => { const r = e.getBoundingClientRect(), s = getComputedStyle(e); return `${s.fontSize} x=${Math.round(r.x)} w=${Math.round(r.width)}`; }).join(' | '));
    console.log(k, m);
    await p.screenshot({ path: `apps/lab/reading/${k}.png` });
  }
  await b.close();
})();
