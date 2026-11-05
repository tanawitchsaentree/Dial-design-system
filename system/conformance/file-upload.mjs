// Behaviour checks for FileUpload (a key, and each chosen file read out in a window), run by tooling/kiln/conformance.mjs.
export default async function fileUpload({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="FileUpload"]').first();
  const key = () => root().locator(':scope > [data-component="Button"]');
  const rows = () => root().locator('ul > li');
  await check('FileUpload', 'the key opens the picker and a refused file is named', async () => {
    await go('/components/file-upload/code');
    const before = await rows().count();
    expect(before >= 3, `${before} starting files (need 3 or more)`);
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), key().click()]);
    await chooser.setFiles([{ name: 'notes.txt', mimeType: 'text/plain', buffer: Buffer.from('hello') }]);
    await page.waitForTimeout(300);
    const after = await rows().count();
    const lines = await root().locator('[aria-live="polite"] [data-component="HelperText"]').allInnerTexts();
    expect(after === before, `list went from ${before} to ${after} for a refused file`);
    expect(lines.some((t) => t.includes('notes.txt')), `error lines: ${lines.join(' | ') || 'none'}`);
    const [chooser2] = await Promise.all([page.waitForEvent('filechooser'), key().click()]);
    await chooser2.setFiles([{ name: 'cellar.pdf', mimeType: 'application/pdf', buffer: Buffer.from('hello') }]);
    await page.waitForTimeout(300);
    const added = await rows().count();
    expect(added === before + 1, `accepted file made ${added} rows (need ${before + 1})`);
    return `refused notes.txt, accepted cellar.pdf, ${before} to ${added} rows`;
  });
  await check('FileUpload', 'the remove key takes a file out and moves focus on', async () => {
    await go('/components/file-upload/code');
    const before = await rows().count();
    const first = rows().first().locator('[data-component="IconButton"]');
    const name = await first.getAttribute('aria-label');
    expect(/^Remove .+/.test(name ?? ''), `remove key named "${name}"`);
    await first.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const after = await rows().count();
    expect(after === before - 1, `${before} to ${after} rows after Enter on a remove key`);
    const onRemove = await page.evaluate(() => document.activeElement?.getAttribute('data-component') ?? '');
    expect(onRemove === 'IconButton', `focus is on "${onRemove}" after the removal`);
    return `${before} to ${after}, focus on the next remove key`;
  });
  await check('FileUpload', 'the key, every window and every remove key are at least the touch target', async () => {
    await go('/components/file-upload/code');
    const r = await root().evaluate((el) => {
      const size = (n) => { const b = n.getBoundingClientRect(); return [b.width, b.height]; };
      const wins = [...el.querySelectorAll('ul > li > div')].map(size);
      const keys = [...el.querySelectorAll('[data-component="IconButton"]')].map(size);
      return { key: size(el.querySelector('[data-component="Button"]')), wins, keys };
    });
    expect(r.key[1] >= 43.5, `choose key ${r.key[1]}px tall`);
    expect(r.wins.length >= 3 && r.wins.every((s) => s[1] >= 43.5), `windows ${r.wins.map((s) => s[1]).join(', ')}`);
    expect(r.keys.length >= 3 && r.keys.every((s) => s[0] >= 43.5 && s[1] >= 43.5), `remove keys ${r.keys.map((s) => s.join('×')).join(', ')}`);
    return `${r.wins.length} windows and remove keys at 44px or more`;
  });
  await check('FileUpload', 'a progress number puts a groove in that file window only, and nothing is orange', async () => {
    await go('/components/file-upload/code');
    const r = await root().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const bars = [...el.querySelectorAll('ul > li')].map((li) => li.querySelectorAll('[role="progressbar"]').length);
      const orange = [...el.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return [cs.backgroundColor, cs.color, cs.borderColor].includes(accent); }).length;
      return { bars, orange };
    });
    expect(r.bars.filter((n) => n === 1).length === 1 && r.bars.every((n) => n <= 1), `progress bars per file: ${r.bars.join(', ')} (need exactly one file with one)`);
    expect(r.orange === 0, `${r.orange} orange parts`);
    return `bars per file ${r.bars.join(', ')}, no orange`;
  });
}
