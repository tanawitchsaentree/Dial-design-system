#!/usr/bin/env node
// sweep — a contact sheet of every component's live demos, in every theme, closed and with each popup open,
// for the eyes at a milestone review (dial K-13). Gates measure what they were written to measure; a Select
// panel cut by its demo frame passed all of them on dial (G-PC1 measures that one now). The sheet is where a
// person, or an agent reading the images, sees what no gate was written for.
//
// Output: system/reports/sweep/index.html and one PNG per shot; the milestone points at it. It never fails a
// run on what it sees (G-PC1 does the measuring); it fails only when it could not look.
// Usage: node tooling/kiln/sweep.mjs   (KILN_ROUTES limits it, as in a top-up)
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { docsConfig, routes, url, routeFilter } from './config.mjs';
import { serveDist } from './serve-dist.mjs';
import { OVERLAY_TRIGGER } from './motion-probes.mjs';
import { popupClipProbe } from './ui-probes.mjs';

const C = docsConfig();
const cb = C.componentsBase ?? '/components';
const ROUTES = routeFilter(routes(C)).filter((r) => r.startsWith(`${cb}/`) && r.endsWith('/code'));
const OUT = path.join(C.root, 'system', 'reports', 'sweep');
const partial = Boolean((process.env.KILN_ROUTES ?? '').trim());
if (!partial) rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const srv = await serveDist(C.abs(C.dist));
const browser = await chromium.launch();
const shots = []; let cut = 0;
try {
  for (const theme of C.themes) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const r of ROUTES) {
      await page.goto(url(srv.base, r, { theme }, C), { waitUntil: 'networkidle' });
      await page.waitForTimeout(300);
      const slug = r.slice(cb.length + 1).replace(/\/code$/, '').replace(/\//g, '-');
      const demos = await page.$$('main [data-example-live]');
      for (const [i, d] of demos.entries()) {
        await d.scrollIntoViewIfNeeded().catch(() => {});
        const box = await d.boundingBox(); if (!box || box.width < 4 || box.height < 4) continue;
        const name = `${slug}-${theme}-${i + 1}`;
        await d.screenshot({ path: path.join(OUT, `${name}.png`) }).catch(() => {});
        shots.push({ route: r, theme, demo: i + 1, file: `${name}.png`, open: false });
        // each popup this demo opens, shot with the area around the demo so a cut panel shows as cut
        const triggers = (await d.$$(OVERLAY_TRIGGER)).slice(0, C.popups?.perDemo ?? 2);
        for (const [k, t] of triggers.entries()) {
          if (!(await t.isVisible().catch(() => false))) continue;
          await t.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(400);
          const clip = await page.evaluate((sel) => {
            const pick = [...document.querySelectorAll('[role=listbox], [role=menu], [role=dialog], [role=alertdialog], [role=tooltip], [popover]:popover-open')].map((e) => e.getBoundingClientRect()).filter((b) => b.width > 2 && b.height > 2);
            const vw = document.documentElement.clientWidth, vh = document.documentElement.clientHeight;
            const all = [sel, ...pick];
            const x = Math.max(0, Math.min(...all.map((b) => b.left)) - 16), y = Math.max(0, Math.min(...all.map((b) => b.top)) - 16);
            return { x, y, width: Math.min(vw, Math.max(...all.map((b) => b.right)) + 16) - x, height: Math.min(vh, Math.max(...all.map((b) => b.bottom)) + 16) - y };
          }, box);
          const problems = await page.evaluate(popupClipProbe, {});
          cut += problems.length;
          const file = `${name}-open${k + 1}.png`;
          if (clip.width > 4 && clip.height > 4) await page.screenshot({ path: path.join(OUT, file), clip }).catch(() => {});
          shots.push({ route: r, theme, demo: i + 1, file, open: true, problems });
          await page.keyboard.press('Escape'); await page.waitForTimeout(200);
        }
      }
    }
    await ctx.close();
  }
} finally {
  await browser.close();
  srv.close();
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const byRoute = Map.groupBy ? Map.groupBy(shots, (s) => s.route) : shots.reduce((m, s) => m.set(s.route, [...(m.get(s.route) ?? []), s]), new Map());
const html = `<!doctype html><meta charset="utf-8"><title>Sweep ${new Date().toISOString().slice(0, 10)}</title>
<style>body{font:14px system-ui;margin:24px;background:#888;color:#111}h2{margin:32px 0 8px}.row{display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start}
figure{margin:0;background:#fff;padding:6px;max-width:460px}figure img{max-width:448px;display:block}figcaption{font-size:12px;margin-top:4px}.cut{outline:4px solid #d00}</style>
<h1>Sweep: ${shots.length} shots of ${byRoute.size} pages in ${C.themes.join(' and ')}${partial ? ' (limited run)' : ''}</h1>
<p>Every live demo, closed and with each popup open. A red frame is a popup G-PC1 measured as cut. Look for what no gate measures: overlap, clipping, a state that reads wrong, a theme that loses an edge.</p>
${[...byRoute].map(([r, list]) => `<h2>${esc(r)}</h2><div class="row">${list.map((s) => `<figure class="${s.problems?.length ? 'cut' : ''}"><img src="${esc(s.file)}" loading="lazy"><figcaption>${esc(s.theme)} · demo ${s.demo}${s.open ? ' · open' : ''}${s.problems?.length ? ` · ${esc(s.problems[0])}` : ''}</figcaption></figure>`).join('')}</div>`).join('\n')}`;
writeFileSync(path.join(OUT, 'index.html'), html);
writeFileSync(path.join(OUT, 'sweep.json'), JSON.stringify({ generatedAt: new Date().toISOString(), partial, pages: byRoute.size, shots: shots.length, cut, list: shots }, null, 1) + '\n');
console.log(`${shots.length ? '✓' : '✗'} sweep: ${shots.length} shots of ${byRoute.size} pages → ${path.relative(C.root, path.join(OUT, 'index.html'))}${cut ? ` (${cut} popups cut, see G-PC1)` : ''}`);
process.exit(shots.length || !ROUTES.length ? 0 : 1);
