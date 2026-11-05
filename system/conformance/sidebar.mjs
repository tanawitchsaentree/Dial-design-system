// Behaviour checks for Sidebar (printed page legend that shrinks to icons), run by tooling/kiln/conformance.mjs.
const FIRST = 'nav[data-component="Sidebar"]:has(button[aria-expanded])';

export default async function sidebar({ check, expect, go, main, page }) {
  await check('Sidebar', 'it is a named navigation landmark with grouped lists and exactly one current page', async () => {
    await go('/components/sidebar/code');
    const r = await main().locator(FIRST).first().evaluate((nav) => ({
      name: nav.getAttribute('aria-label'),
      lists: nav.querySelectorAll('ul').length,
      named: [...nav.querySelectorAll('ul')].every((u) => { const id = u.getAttribute('aria-labelledby'); return !!id && !!document.getElementById(id)?.textContent?.trim(); }),
      current: [...nav.querySelectorAll('[aria-current]')].map((a) => a.getAttribute('aria-current')),
    }));
    expect(!!r.name, 'the landmark has no aria-label');
    expect(r.lists >= 2 && r.named, `${r.lists} lists, each named by its heading: ${r.named}`);
    expect(r.current.length === 1 && r.current[0] === 'page', `current marks: ${r.current.join(',') || 'none'} (need exactly one "page")`);
    return `${r.lists} named lists, 1 current page`;
  });

  await check('Sidebar', 'every row is at least the touch target tall and the current page has a drawn index mark that others lack', async () => {
    await go('/components/sidebar/code');
    const r = await main().locator(FIRST).first().evaluate((nav) => [...nav.querySelectorAll('li > a')].map((a) => {
      const m = a.querySelector(':scope > span:first-child'); const cs = getComputedStyle(m);
      return { h: a.getBoundingClientRect().height, cur: a.hasAttribute('aria-current'), w: m.getBoundingClientRect().width, bg: cs.backgroundColor };
    }));
    expect(r.length >= 3 && r.every((x) => x.h >= 43.5), `row heights ${r.map((x) => x.h).join(', ')}`);
    const clear = (c) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
    const cur = r.filter((x) => x.cur), rest = r.filter((x) => !x.cur);
    expect(cur.length === 1 && !clear(cur[0].bg) && cur[0].w > 0, `current mark ${cur[0]?.w}px ${cur[0]?.bg}`);
    expect(rest.every((x) => clear(x.bg)), 'a row that is not current draws an index mark');
    return `${r.length} rows >=44px, mark ${cur[0].w}px wide on the current page only`;
  });

  await check('Sidebar', 'the toggle collapses to icons, keeps 44px targets and link names, and expands again', async () => {
    await go('/components/sidebar/code');
    const nav = main().locator(FIRST).first();
    const btn = nav.locator('button[aria-expanded]');
    const read = () => nav.evaluate((n) => {
      const links = [...n.querySelectorAll('li > a')];
      const label = n.querySelector('li > a > span:last-child');
      return {
        w: n.getBoundingClientRect().width,
        expanded: n.querySelector('button[aria-expanded]').getAttribute('aria-expanded'),
        labelW: label.getBoundingClientRect().width,
        names: links.map((a) => (a.textContent || '').trim()),
        boxes: links.map((a) => ({ w: a.getBoundingClientRect().width, h: a.getBoundingClientRect().height })),
      };
    });
    const open = await read();
    expect(open.expanded === 'true', `expanded=${open.expanded} before pressing`);
    await btn.focus();
    await btn.press('Enter');
    await page.waitForTimeout(500);
    const shut = await read();
    expect(shut.expanded === 'false', `expanded=${shut.expanded} after pressing`);
    expect(shut.w < open.w / 2, `width ${open.w} -> ${shut.w}`);
    expect(shut.labelW <= 2, `label still drawn at ${shut.labelW}px`);
    expect(shut.names.every((t) => t.length > 0), 'a link lost its name when collapsed');
    expect(shut.boxes.every((b) => b.w >= 43.5 && b.h >= 43.5), `collapsed targets ${shut.boxes.map((b) => `${b.w}x${b.h}`).join(', ')}`);
    await btn.press('Space');
    await page.waitForTimeout(500);
    const back = await read();
    expect(back.expanded === 'true' && Math.abs(back.w - open.w) < 2, `after expanding: ${back.expanded}, ${back.w}px`);
    return `${open.w}px -> ${shut.w}px -> ${back.w}px, ${shut.names.length} names kept`;
  });

  await check('Sidebar', 'no part of the sidebar is the accent orange', async () => {
    await go('/components/sidebar/code');
    const bad = await main().locator('nav[data-component="Sidebar"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
