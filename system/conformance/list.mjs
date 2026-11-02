// Behaviour checks for List (rows on one plastic body; a queue is a WAI-ARIA listbox), run by tooling/kiln/conformance.mjs on the built book.
export default async function list({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const min = () => px(tokens['layout.touch']?.value ?? '44px');
  const queue = () => main().locator('[data-component="List"][role="listbox"]').first();
  const qstate = (q) => q.evaluate((el) => {
    const opts = [...el.querySelectorAll(':scope > [role="option"]')];
    return {
      active: opts.findIndex((o) => o.id === el.getAttribute('aria-activedescendant')),
      selected: opts.findIndex((o) => o.getAttribute('aria-selected') === 'true'),
      count: opts.length, focused: document.activeElement === el,
    };
  });

  await check('List', 'a link row is one link the full size of the row and at least the touch target tall', async () => {
    await go('/components/list/code');
    const r = await main().locator('[data-component="List"] li > a').first().evaluate((a) => {
      const li = a.parentElement.getBoundingClientRect(), ar = a.getBoundingClientRect();
      return { h: ar.height, wl: li.width, wa: ar.width, focusables: a.parentElement.querySelectorAll('a, button, input, [tabindex]').length, chevron: !!a.querySelector('svg:last-child') };
    });
    expect(r.h >= min() - 0.5 && Math.abs(r.wl - r.wa) <= 1, `link ${r.wa}×${r.h}px in a ${r.wl}px row (min ${min()})`);
    expect(r.focusables === 1 && r.chevron, `${r.focusables} focusable parts in the row, chevron ${r.chevron}`);
    return `row link ${Math.round(r.h)}px tall`;
  });

  await check('List', 'Tab reaches a link row and the focus ring shows', async () => {
    await go('/components/list/code');
    const a = main().locator('[data-component="List"] li > a').first();
    await a.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
    const st = await a.evaluate((el) => ({ focused: document.activeElement === el, w: getComputedStyle(el).outlineWidth, s: getComputedStyle(el).outlineStyle }));
    expect(st.focused, 'the link row did not take focus');
    expect(st.s !== 'none' && px(st.w) >= 2, `outline ${st.s} ${st.w}`);
    return `outline ${st.w}`;
  });

  await check('List', 'in a queue the arrow keys, Home and End move the active row and Enter chooses it', async () => {
    await go('/components/list/code');
    const q = queue();
    await q.focus();
    const s0 = await qstate(q);
    expect(s0.focused && s0.active === Math.max(0, s0.selected), `focus ${s0.focused}, active ${s0.active}, selected ${s0.selected}`);
    await page.keyboard.press('Home'); const h = await qstate(q);
    await page.keyboard.press('ArrowDown'); const d = await qstate(q);
    await page.keyboard.press('End'); const e = await qstate(q);
    await page.keyboard.press('ArrowUp'); const u = await qstate(q);
    expect(h.active === 0 && d.active === 1 && e.active === e.count - 1 && u.active === e.count - 2, `Home ${h.active}, Down ${d.active}, End ${e.active}, Up ${u.active}`);
    await page.keyboard.press('Enter'); const after = await qstate(q);
    expect(after.selected === e.count - 2 && after.focused, `chose ${after.selected}, focused ${after.focused}`);
    return `chose row ${after.selected + 1} of ${after.count}`;
  });

  await check('List', 'a press on a queue row chooses it', async () => {
    await go('/components/list/code');
    const q = queue();
    const before = await qstate(q);
    const target = before.selected === 0 ? 1 : 0;
    await q.locator(':scope > [role="option"]').nth(target).click();
    const s = await qstate(q);
    expect(s.selected === target, `pressed row ${target}, chosen ${s.selected}`);
    return `chose row ${target + 1}`;
  });

  await check('List', 'the chosen row is marked by an ink mark and weight, never orange', async () => {
    await go('/components/list/code');
    const r = await queue().evaluate((el) => {
      const sel = el.querySelector('[aria-selected="true"]');
      const other = el.querySelector('[aria-selected="false"]');
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--ds-action-accent').trim();
      const probe = document.createElement('i'); probe.style.color = accent; document.body.append(probe); const orange = getComputedStyle(probe).color; probe.remove();
      const mark = (o) => getComputedStyle(o.querySelector('[aria-hidden="true"]')).backgroundColor;
      const name = (o) => getComputedStyle(o.querySelector('span > span')).fontWeight;
      const cs = getComputedStyle(sel.firstElementChild);
      return { mark: mark(sel), off: mark(other), weight: Number(name(sel)), plain: Number(name(other)), orange: [cs.backgroundColor, cs.color, mark(sel)].includes(orange) };
    });
    expect(r.mark !== r.off && !/rgba\(0, 0, 0, 0\)|transparent/.test(r.mark), `mark ${r.mark} against ${r.off}`);
    expect(r.weight >= 500 && r.plain < r.weight && !r.orange, `weight ${r.weight} (others ${r.plain}), orange ${r.orange}`);
    return `mark ${r.mark}, weight ${r.weight}`;
  });

  await check('List', 'the list paints its own body and keeps its rows apart by a gap with no rule', async () => {
    await go('/components/list/code');
    const r = await main().locator('[data-component="List"]').first().evaluate((el) => {
      const cs = getComputedStyle(el);
      const rows = [...el.children];
      const rules = rows.filter((li) => { const s = getComputedStyle(li); const a = li.firstElementChild ? getComputedStyle(li.firstElementChild) : s; return [s, a].some((c) => px(c.borderTopWidth) > 1 || (c.borderTopStyle !== 'none' && c.borderTopColor !== 'rgba(0, 0, 0, 0)' && px(c.borderTopWidth) >= 1)); }).length;
      function px(v) { return parseFloat(v) || 0; }
      const gap = rows.length > 1 ? rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().bottom : 0;
      return { bg: cs.backgroundColor, shadow: cs.boxShadow !== 'none', rules, gap };
    });
    expect(!/rgba\(0, 0, 0, 0\)|transparent/.test(r.bg) && r.shadow, `background ${r.bg}, shadow ${r.shadow}`);
    expect(r.rules === 0 && r.gap > 0, `${r.rules} rows with a rule, gap ${r.gap}px`);
    return `gap ${r.gap}px`;
  });

  // R-002 carried over to List: a long or Thai name must never be cut by the row
  await check('List', 'every name and state word shows in full in its row, Thai and long names included', async () => {
    const bad = [];
    for (const route of ['/components/list/code', '/components/list/usage']) {
      await go(route);
      const cut = await page.evaluate(() => [...document.querySelectorAll('main [data-component="List"] li')].flatMap((li) => {
        const row = li.getBoundingClientRect();
        return [...li.querySelectorAll('span > span')].filter((t) => {
          const r = t.getBoundingClientRect();
          return t.scrollWidth > t.clientWidth + 1 || r.right > row.right + 1 || r.left < row.left - 1;
        }).map((t) => t.textContent.trim().slice(0, 24));
      }));
      if (cut.length) bad.push(`${route}: cut ${cut.slice(0, 3).join(', ')}`);
    }
    expect(!bad.length, bad.join(' | '));
    return 'no word is cut';
  });
}
