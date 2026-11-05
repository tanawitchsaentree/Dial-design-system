// Behaviour checks for DatePicker (a date window with a round calendar key), run by tooling/kiln/conformance.mjs.
// The Usage-tab subject is a "Start date" picker with min 2026-11-03, defaultValue 2026-11-12 and today 2026-11-04, locale en.
export default async function datePicker({ check, expect, go, main }) {
  const root = () => main().locator('div[data-component="DatePicker"]').first();
  const field = () => root().locator('input[type="text"]');
  const key = () => root().locator('span[data-component="Popover"] > button');
  const panel = (page) => page.locator('div[role="dialog"][data-component="Popover"]');

  await check('DatePicker', 'a typed date in ISO or locale order commits on Tab and Enter and is shown in the locale order', async () => {
    await go('/components/date-picker/code');
    const f = field(); const page = f.page();
    const start = await f.inputValue();
    expect(start === '11/12/2026', `starts as ${start}`);
    await f.fill('2026-12-05'); await f.press('Tab');
    const iso = await f.inputValue();
    expect(iso === '12/05/2026', `ISO text shows ${iso}`);
    await f.fill('11/20/2026'); await f.press('Enter');
    const loc = await f.inputValue();
    expect(loc === '11/20/2026', `locale text shows ${loc}`);
    expect((await f.getAttribute('aria-invalid')) === null, 'a real date is not marked invalid');
    await page.keyboard.press('Tab');
    return 'ISO and locale text commit and show as mm/dd/yyyy';
  });

  await check('DatePicker', 'text that is not a date, or a day before min, is refused with a message and keeps what was typed', async () => {
    await go('/components/date-picker/code');
    const f = field();
    await f.fill('2026-02-30'); await f.press('Tab');
    expect((await f.getAttribute('aria-invalid')) === 'true', 'a day that does not exist is invalid');
    expect((await f.inputValue()) === '2026-02-30', 'the typed text is kept');
    const msg = await root().locator('p').last().innerText();
    expect(msg.trim().length > 0, 'a message is printed');
    const described = await f.evaluate((el) => (el.getAttribute('aria-describedby') || '').split(' ').filter((id) => document.getElementById(id)).length);
    expect(described >= 1, 'the message is linked with aria-describedby');
    await f.fill('2026-11-01'); await f.press('Tab');
    expect((await f.getAttribute('aria-invalid')) === 'true', 'a day before min is invalid');
    await f.fill('11/15/2026'); await f.press('Tab');
    expect((await f.getAttribute('aria-invalid')) === null, 'a good date clears the problem');
    return 'invalid text and a day before min are refused, a good date clears it';
  });

  await check('DatePicker', 'the key opens the Calendar with focus on the chosen day, choosing a day fills the field and Escape returns to the key', async () => {
    await go('/components/date-picker/code');
    const k = key(); const f = field(); const page = k.page();
    expect((await k.getAttribute('aria-expanded')) === 'false', 'key starts collapsed');
    await k.click();
    await panel(page).first().waitFor({ state: 'visible' });
    await page.waitForTimeout(300);
    const at = await page.evaluate(() => document.activeElement?.getAttribute('data-date') ?? null);
    expect(at === '2026-11-12', `focus is on ${at}`);
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="Popover"]'), null, { timeout: 3000 });
    const v = await f.inputValue();
    expect(v === '11/13/2026', `field shows ${v}`);
    expect(await k.evaluate((el) => document.activeElement === el), 'focus is back on the key after choosing');
    await k.click();
    await panel(page).first().waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('div[role="dialog"][data-component="Popover"]'), null, { timeout: 3000 });
    expect(await k.evaluate((el) => document.activeElement === el), 'focus is back on the key after Escape');
    return 'opens on the chosen day, Enter fills the field, Escape returns to the key';
  });

  await check('DatePicker', 'Alt and Down arrow opens the Calendar from the field, and the month sits inside the panel without scrolling sideways', async () => {
    await go('/components/date-picker/code');
    const f = field(); const page = f.page();
    await f.focus(); await page.keyboard.press('Alt+ArrowDown');
    await panel(page).first().waitFor({ state: 'visible' });
    const r = await panel(page).first().evaluate((p) => ({ over: p.scrollWidth - p.clientWidth, cal: !!p.querySelector('[data-component="Calendar"]') }));
    expect(r.cal, 'the panel holds a Calendar');
    expect(r.over <= 1, `panel scrolls sideways by ${r.over}px`);
    await page.keyboard.press('Escape');
    return 'Alt+Down opens; the month fits the panel';
  });

  await check('DatePicker', 'the window and the key are at least the touch target tall and share top and bottom edges', async () => {
    await go('/components/date-picker/code');
    const w = await root().locator('input[type="text"]').evaluate((el) => el.parentElement.getBoundingClientRect().toJSON());
    const k = await key().boundingBox();
    expect(w.height >= 43.5 && k && k.width >= 43.5 && k.height >= 43.5, `window ${w.height}, key ${k ? `${k.width}×${k.height}` : 'missing'}`);
    expect(Math.abs(w.top - k.y) <= 1 && Math.abs(w.bottom - (k.y + k.height)) <= 1, `edges window ${w.top}-${w.bottom}, key ${k.y}-${k.y + k.height}`);
    return `window ${Math.round(w.height)}px and key ${Math.round(k.height)}px on the same edges`;
  });

  await check('DatePicker', 'no part of the picker or its panel is the accent orange', async () => {
    await go('/components/date-picker/code');
    const k = key(); const page = k.page();
    await k.click();
    await panel(page).first().waitFor({ state: 'visible' });
    const bad = await page.evaluate(() => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const root = document.querySelector('div[data-component="DatePicker"]');
      const p = document.querySelector('div[role="dialog"][data-component="Popover"]');
      let n = 0;
      for (const top of [root, p]) for (const el of [top, ...top.querySelectorAll('*')]) { const cs = getComputedStyle(el); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].includes(accent)) n++; }
      return n;
    });
    expect(bad === 0, `${bad} orange parts`);
    await page.keyboard.press('Escape');
    return 'no orange';
  });
}
