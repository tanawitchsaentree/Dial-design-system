// Behaviour checks for ExplainMode, run by tooling/kiln/conformance.mjs on the built book.
export default async function explainMode({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const radio = () => main().locator('[data-component="ExplainMode"]').filter({ has: page.locator('[data-explain^="Station|"]') }).first();
  const key = () => radio().locator(':scope > div > button[aria-pressed]');
  const fresh = async () => { await go('/components/explain-mode/code'); await radio().waitFor(); };

  await check('ExplainMode', 'the key prints every name and line, and the same key takes them away', async () => {
    await fresh();
    const parts = await radio().locator('[data-explain]').count();
    expect(await radio().locator('[data-explain-layer]').count() === 0, 'printing up before the key was pressed');
    await key().click();
    await page.waitForTimeout(150);
    const notes = await radio().locator('[data-explain-layer] > div:not([data-keyed]), [data-explain-key] > li').allTextContents();
    expect(notes.length === parts, `${notes.length} notes printed or in the key for ${parts} parts`);
    expect(await key().getAttribute('aria-pressed') === 'true', 'the key is not latched');
    await key().click();
    await page.waitForTimeout(150);
    expect(await radio().locator('[data-explain-layer]').count() === 0, 'the printing stayed after the second press');
    return `${notes.length} notes, ${notes.join(' | ')}`;
  });

  await check('ExplainMode', 'the question mark key opens it and Escape closes it', async () => {
    await fresh();
    await radio().locator('[role="slider"]').first().focus();
    await page.keyboard.press('?');
    await page.waitForTimeout(150);
    const open = await radio().locator('[data-explain-layer]').count();
    const status = await radio().locator('[role="status"]').last().textContent();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(150);
    const after = await radio().locator('[data-explain-layer]').count();
    expect(open === 1, 'the question mark key did not open it');
    expect(/Escape/.test(status ?? ''), `status "${status}"`);
    expect(after === 0, 'Escape did not close it');
    return `opened by ?, said "${status}", closed by Escape`;
  });

  await check('ExplainMode', 'the controls keep working while the names are up', async () => {
    await fresh();
    await key().click();
    const knob = radio().locator('[role="slider"]').first();
    const before = await knob.getAttribute('aria-valuenow');
    await knob.focus();
    await page.keyboard.press('ArrowUp');
    const r = await knob.boundingBox();
    const hit = await page.evaluate(([x, y]) => !!document.elementFromPoint(x, y)?.closest('[data-explain-layer]'), [r.x + r.width / 2, r.y + r.height / 2]);
    const after = await knob.getAttribute('aria-valuenow');
    const pe = await radio().locator('[data-explain-layer]').evaluate((l) => getComputedStyle(l).pointerEvents);
    expect(after !== before, `the knob stayed at ${before}`);
    expect(!hit && pe === 'none', 'the printing takes the pointer');
    return `knob ${before} → ${after}, layer pointer-events ${pe}`;
  });

  await check('ExplainMode', 'each part is described by its printed words while the mode is on', async () => {
    await fresh();
    const knob = radio().locator('[data-explain^="Station|"] [role="slider"]');
    const off = await knob.getAttribute('aria-describedby');
    await key().click();
    await page.waitForTimeout(150);
    const said = await knob.evaluate((el) => (el.getAttribute('aria-describedby') ?? '').split(/\s+/).map((id) => document.getElementById(id)?.textContent ?? '').join(' '));
    await key().click();
    await page.waitForTimeout(150);
    const back = await knob.getAttribute('aria-describedby');
    expect(/Station/.test(said) && /stations/.test(said), `described by "${said}"`);
    expect(back === off, `description left behind: ${back}`);
    return `the Station knob hears "${said.trim()}"`;
  });

  await check('ExplainMode', 'notes never cover a part or another note and every leader meets its note', async () => {
    await go('/components/explain-mode/code');
    await page.waitForTimeout(250);
    const bad = await main().locator('[data-component="ExplainMode"]').evaluateAll((els) => els.flatMap((e) => {
      const L = e.querySelector('[data-explain-layer]'); if (!L) return [];
      const box = (n) => n.getBoundingClientRect();
      const parts = [...e.querySelectorAll('[data-explain]')].map((p) => box(p.children.length === 1 ? p.children[0] : p));
      const notes = [...L.querySelectorAll(':scope > div:not([data-keyed])')].map(box);
      const cross = (a, b) => a.right > b.left + 1 && a.left < b.right - 1 && a.bottom > b.top + 1 && a.top < b.bottom - 1;
      const out = [];
      notes.forEach((n, i) => {
        if (parts.some((p) => cross(n, p))) out.push(`note ${i} covers a part`);
        if (notes.some((m, j) => j !== i && cross(n, m))) out.push(`note ${i} covers a note`);
      });
      if (L.querySelectorAll('path').length !== notes.length) out.push('a note has no leader');
      return out;
    }));
    expect(bad.length === 0, bad.join('; '));
    return 'no note over a part or a note';
  });

  await check('ExplainMode', 'the key is a plastic key of at least the touch target, never orange', async () => {
    await fresh();
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const r = await key().boundingBox();
    const st = await key().evaluate((b) => ({ kind: b.getAttribute('data-kind'), shortcut: b.getAttribute('aria-keyshortcuts') }));
    expect(r.height >= min - 0.5, `key ${Math.round(r.width)}×${Math.round(r.height)}`);
    expect(st.kind === 'key', `key kind ${st.kind}`);
    expect(!!st.shortcut, 'no aria-keyshortcuts');
    return `${Math.round(r.width)}×${Math.round(r.height)}, kind ${st.kind}, shortcut ${st.shortcut}`;
  });
}
