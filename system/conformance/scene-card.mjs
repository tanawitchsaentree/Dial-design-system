// Behaviour checks for SceneCard (a scene printed on a card you insert into a Slot), run by tooling/kiln/conformance.mjs on the built book.
export default async function sceneCard({ check, expect, page, go, main, tokens }) {
  const px = (s) => parseFloat(s);
  const ROUTE = '/components/scene-card/code';
  // the hero example: three cards and the Living room slot (the page may print other cards before it)
  const hero = () => main().locator('[data-example-live]:has([data-component="Slot"])').first();
  const card = (name) => hero().locator('[data-component="SceneCard"] > button', { hasText: name }).first();
  const slot = () => hero().locator('[data-component="Slot"] > button').first();

  await check('SceneCard', 'Enter picks a card up, an arrow reaches a slot and Enter inserts it with an announcement', async () => {
    await go(ROUTE);
    const c = card('Movie night');
    await c.focus();
    await page.keyboard.press('Enter');
    const held = await c.getAttribute('aria-pressed');
    await page.keyboard.press('ArrowRight');
    const onSlot = await page.evaluate(() => !!document.activeElement?.closest('[data-component="Slot"]'));
    await page.keyboard.press('Enter');
    const root = hero().locator('[data-component="Slot"]').first();
    const said = await root.locator('[role="status"]').textContent();
    const label = await slot().getAttribute('aria-label');
    expect(held === 'true', `aria-pressed after Enter ${held}`);
    expect(onSlot, 'the arrow did not move focus to a slot');
    expect(/Movie night inserted into Living room/.test(said ?? ''), `status "${said}"`);
    expect(/Movie night/.test(label ?? ''), `slot name "${label}"`);
    expect((await c.getAttribute('aria-pressed')) === 'false', 'the card is still held after the insert');
    return said;
  });

  await check('SceneCard', 'Escape puts a held card back and focus returns to it', async () => {
    await go(ROUTE);
    const c = card('Away');
    await c.focus();
    await page.keyboard.press('Enter');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Escape');
    const pressed = await c.getAttribute('aria-pressed');
    const back = await c.evaluate((el) => el === document.activeElement);
    const said = await c.locator('xpath=..').locator('[role="status"]').textContent();
    expect(pressed === 'false' && back, `pressed ${pressed}, focus back ${back}`);
    expect(/put back/.test(said ?? ''), `status "${said}"`);
    return said;
  });

  await check('SceneCard', 'a press on a card and then on a slot inserts it', async () => {
    await go(ROUTE);
    await card('Good night').click();
    await slot().click();
    const label = await slot().getAttribute('aria-label');
    expect(/Good night inserted/.test(label ?? ''), `slot name "${label}"`);
    return label;
  });

  await check('SceneCard', 'dragging a card by its printed handle onto a slot inserts it', async () => {
    await go(ROUTE);
    await hero().evaluate((el) => el.scrollIntoView({ block: 'center' }));
    const h = await card('Away').locator(':scope > span').first().boundingBox();
    const s = await slot().boundingBox();
    await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
    await page.mouse.down();
    await page.mouse.move(s.x + s.width / 2, s.y + s.height / 3, { steps: 8 });
    const over = await slot().getAttribute('data-over');
    await page.mouse.up();
    const label = await slot().getAttribute('aria-label');
    expect(over === 'true', `data-over while dragging ${over}`);
    expect(/Away inserted/.test(label ?? ''), `slot name "${label}"`);
    return label;
  });

  await check('SceneCard', 'the card is light stock with dark ink and never the accent, in both themes', async () => {
    await go(ROUTE);
    const r = await card('Movie night').evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number).slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; };
      const cs = getComputedStyle(el);
      const bg = lum(cs.backgroundColor), fg = lum(cs.color);
      const orange = [el, ...el.querySelectorAll('*')].filter((n) => getComputedStyle(n).backgroundColor === accent || getComputedStyle(n).color === accent).length;
      return { ratio: (Math.max(bg, fg) + 0.05) / (Math.min(bg, fg) + 0.05), light: bg > fg, orange };
    });
    expect(r.light && r.ratio >= 4.5, `ink on stock ${r.ratio.toFixed(2)}:1, light stock ${r.light}`);
    expect(r.orange === 0, `${r.orange} parts in the accent`);
    return `${r.ratio.toFixed(2)}:1`;
  });

  await check('SceneCard', 'every card and its handle keep the touch target', async () => {
    await go(ROUTE);
    const min = px(tokens['layout.touch']?.value ?? '44px');
    const s = await main().locator('[data-component="SceneCard"]').evaluateAll((els) => els.flatMap((el) => [el.querySelector('button'), el.querySelector('button > span')].map((b) => { const r = b.getBoundingClientRect(); return Math.min(r.width, r.height); })));
    expect(s.length > 0 && s.every((x) => x >= min - 0.5), `sizes ${s.join(', ')}`);
    return `${Math.min(...s)}px and up`;
  });

  await check('SceneCard', 'a held card rises on the release timing and does not move under reduce motion', async () => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await go(ROUTE);
    const c = card('Good night');
    const t = await c.evaluate((el) => getComputedStyle(el).transitionDuration);
    await c.click();
    await page.waitForTimeout(400);
    const up = await c.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
    await page.keyboard.press('Escape');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await go(ROUTE);
    await card('Good night').click();
    const still = await card('Good night').evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
    await page.keyboard.press('Escape');
    expect(up < 0 && still === 0, `rise ${up}px, under reduce ${still}px (transition ${t})`);
    return `rises ${up}px`;
  });
}
