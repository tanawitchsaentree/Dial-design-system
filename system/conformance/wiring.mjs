// Behaviour checks for Wiring, run by tooling/kiln/conformance.mjs on the built book.
export default async function wiring({ check, expect, page, go, main }) {
  const unit = (text) => main().locator('[data-component="Wiring"]').filter({ has: page.locator('li', { hasText: text }) }).first();
  const ink = (v) => page.evaluate((x) => { const d = document.createElement('i'); d.style.color = `var(${x})`; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; }, v);

  await check('Wiring', 'every relation is a sentence in a named list and every line is ink, never orange', async () => {
    await go('/components/wiring/code');
    const accent = await ink('--ds-action-accent');
    const st = await main().locator('[data-component="Wiring"]').evaluateAll((els) => els.map((e) => ({
      list: e.querySelector(':scope > ul')?.getAttribute('aria-label') ?? '',
      items: [...e.querySelectorAll(':scope > ul > li')].map((li) => li.textContent.trim()),
      paths: e.querySelectorAll(':scope > svg path').length,
      hidden: e.querySelector(':scope > svg')?.getAttribute('aria-hidden'),
      strokes: [...e.querySelectorAll(':scope > svg path, :scope > svg circle')].map((p) => getComputedStyle(p).stroke),
    })));
    expect(st.length >= 6, `${st.length} Wiring demos on the page`);
    expect(st.every((s) => s.list.length > 0), 'a relation list has no name');
    expect(st.every((s) => s.items.every((t) => /(on now|waiting|ทำงานอยู่|รออยู่)\.$/.test(t))), `a sentence lacks its state word: ${st.flatMap((s) => s.items).join(' | ')}`);
    expect(st.every((s) => s.hidden === 'true'), 'the drawing is not hidden from assistive technology');
    expect(st.every((s) => s.strokes.every((c) => c !== accent)), 'a line uses the accent orange');
    expect(st.some((s) => s.paths > 0), 'no line drawn');
    return `${st.length} demos, ${st.reduce((n, s) => n + s.paths, 0)} lines, all ink`;
  });

  await check('Wiring', 'focusing one end describes the relation and names the other end', async () => {
    await go('/components/wiring/code');
    const w = unit('Night mode lowers the heater to 18');
    const knob = w.locator('[data-wiring-node="thermostat"] [role="slider"]').first();
    await knob.focus();
    const said = await knob.evaluate((el) => (el.getAttribute('aria-describedby') ?? '').split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' '));
    expect(/heater/i.test(said), `the thermostat is described by "${said}"`);
    const night = w.locator('[data-wiring-node="night"]').locator('input, [tabindex="0"]').first();
    const said2 = await night.evaluate((el) => (el.getAttribute('aria-describedby') ?? '').split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' '));
    expect(/heater/i.test(said2) && /Night mode/.test(said2), `the schedule is described by "${said2}"`);
    return `the thermostat hears ${said.trim()}`;
  });

  await check('Wiring', 'lines keep right angles, bend once at most and never cross a part or a word', async () => {
    await go('/components/wiring/code');
    await page.waitForTimeout(200);
    const bad = await main().locator('[data-component="Wiring"]').evaluateAll((els) => els.flatMap((e) => {
      const o = e.getBoundingClientRect();
      const rect = (n) => { const r = n.getBoundingClientRect(); return { l: r.left - o.left, t: r.top - o.top, r: r.right - o.left, b: r.bottom - o.top }; };
      const nodes = [...e.querySelectorAll('[data-wiring-node]')].map(rect);
      const tags = [...e.querySelectorAll(':scope > span')].filter((t) => getComputedStyle(t).visibility !== 'hidden').map(rect);
      const out = [];
      e.querySelectorAll(':scope > svg path').forEach((p) => {
        const pts = [...p.getAttribute('d').matchAll(/[ML](-?[\d.]+) (-?[\d.]+)/g)].map((m) => [+m[1], +m[2]]);
        const segs = pts.slice(1).map((q, i) => [pts[i], q]);
        if (segs.length > 3) out.push(`${segs.length} runs`);
        for (const [a, b] of segs) {
          if (a[0] !== b[0] && a[1] !== b[1]) out.push(`diagonal ${a}→${b}`);
          const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]);
          const through = (k) => x1 > k.l + 1 && x0 < k.r - 1 && y1 > k.t + 1 && y0 < k.b - 1;
          if (nodes.some(through)) out.push(`a run crosses a part at ${a}→${b}`);
          if (tags.some(through)) out.push(`a run crosses a word at ${a}→${b}`);
        }
      });
      for (const t of tags) if (nodes.some((k) => t.r > k.l && t.l < k.r && t.b > k.t && t.t < k.b)) out.push('a word sits on a part');
      return out;
    }));
    expect(bad.length === 0, bad.join('; '));
    return 'every run level or upright, no part or word crossed';
  });

  await check('Wiring', 'turning a relation active steps its line, dots and word to full ink', async () => {
    await go('/components/wiring/code');
    const target = main().locator('[data-component="Wiring"]').filter({ has: page.getByRole('switch', { name: 'Night mode' }) }).first();
    const before = await target.locator(':scope > svg path').first().getAttribute('data-state');
    const primary = await page.evaluate(() => { const d = document.createElement('i'); d.style.color = 'var(--ds-text-primary)'; document.body.append(d); const c = getComputedStyle(d).color; d.remove(); return c; });
    await target.getByRole('switch', { name: 'Night mode' }).click();
    await page.waitForTimeout(300);
    const after = await target.locator(':scope > svg path').first().evaluate((p) => ({ state: p.getAttribute('data-state'), stroke: getComputedStyle(p).stroke }));
    const said = await target.locator(':scope > ul > li').first().textContent();
    expect(before === 'off' && after.state === 'on', `state ${before} → ${after.state}`);
    expect(after.stroke === primary, `active stroke ${after.stroke}, text.primary ${primary}`);
    expect(/on now\.$/.test(said), `sentence "${said}"`);
    return `off → on, ${after.stroke}, "${said}"`;
  });
}
