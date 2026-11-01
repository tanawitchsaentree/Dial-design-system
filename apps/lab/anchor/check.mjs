// Anchor-round contrast check: worst-pixel WCAG contrast of every visible text node, both themes,
// plus a screenshot per theme. Run from the repo root: node apps/lab/anchor/check.mjs
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { mkdirSync } from 'node:fs';
import { measurePageText } from '../../../tooling/kiln/text-contrast.mjs';
const page0 = pathToFileURL(path.resolve('apps/lab/anchor/index.html')).href;
const out = 'apps/lab/anchor/shots'; mkdirSync(out, { recursive: true });
const b = await chromium.launch(); let bad = 0;
for (const theme of ['light', 'dark']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  await p.goto(`${page0}?theme=${theme}`); await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/anchor-${theme}.png`, fullPage: true });
  for (const id of ['a', 'b', 'c', 'd']) await p.locator(`[data-anchor="${id}"]`).screenshot({ path: `${out}/${id}-${theme}.png` });
  const r = await measurePageText(p, 4.5);
  bad += r.failures.length;
  console.log(`${theme}: ${r.textElements} text, ${r.failures.length} below 4.5:1; worst ${r.worst.slice(0, 3).map((w) => `${JSON.stringify((w.text || '').slice(0, 14))} ${w.min?.toFixed?.(2)}`).join(' | ')}`);
  for (const f of r.failures.slice(0, 6)) console.log(`  ✗ ${JSON.stringify((f.text || '').slice(0, 20))} ${f.min?.toFixed?.(2)}`);
  await p.close();
}
await b.close(); process.exit(bad ? 1 : 0);
