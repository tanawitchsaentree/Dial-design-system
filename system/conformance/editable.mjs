// Behaviour checks for Editable (printed value that becomes an Input well), run by tooling/kiln/conformance.mjs.
export default async function editable({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="Editable"]').first();
  const reading = () => root().locator('button[aria-labelledby]');
  const field = () => root().locator('input[type="text"]');
  const status = () => root().locator('[role="status"]');

  await check('Editable', 'Enter keeps the change and Escape puts the old value back', async () => {
    await go('/components/editable/code');
    const before = (await reading().innerText()).trim();
    await reading().click();
    expect((await field().count()) === 1, 'the field did not open when the reading was pressed');
    const focused = await field().evaluate((el) => document.activeElement === el);
    const selected = await field().evaluate((el) => el.selectionStart === 0 && el.selectionEnd === el.value.length);
    expect(focused && selected, `field focused ${focused}, text selected ${selected}`);
    await field().fill('Hall heating');
    await page.keyboard.press('Escape');
    expect((await field().count()) === 0, 'the field stayed open after Escape');
    const back = (await reading().innerText()).trim();
    expect(back === before, `after Escape the value is "${back}" (was "${before}")`);
    expect(await reading().evaluate((el) => document.activeElement === el), 'focus did not return to the reading after Escape');
    await reading().click();
    await field().fill('Hall heating');
    await page.keyboard.press('Enter');
    expect((await field().count()) === 0, 'the field stayed open after Enter');
    const kept = (await reading().innerText()).trim();
    expect(kept === 'Hall heating', `after Enter the value is "${kept}"`);
    expect(await reading().evaluate((el) => document.activeElement === el), 'focus did not return to the reading after Enter');
    return `Escape restored "${before}", Enter kept "${kept}"`;
  });

  await check('Editable', 'leaving the field keeps the change', async () => {
    await go('/components/editable/code');
    await reading().click();
    await field().fill('Study');
    await page.mouse.click(2, 2);
    await page.waitForTimeout(200);
    expect((await field().count()) === 0, 'the field stayed open after the press elsewhere');
    const kept = (await reading().innerText()).trim();
    expect(kept === 'Study', `after leaving the value is "${kept}"`);
    return `blur kept "${kept}"`;
  });

  await check('Editable', 'the save and cancel keys finish an edit without a keyboard', async () => {
    await go('/components/editable/code');
    await reading().click();
    await field().fill('Attic');
    await root().locator('[data-component="IconButton"]').first().click();
    expect((await field().count()) === 0, 'the field stayed open after the cancel key');
    const cancelled = (await reading().innerText()).trim();
    expect(cancelled !== 'Attic', `the cancel key kept "${cancelled}"`);
    await reading().click();
    await field().fill('Attic');
    await root().locator('[data-component="IconButton"]').nth(1).click();
    const kept = (await reading().innerText()).trim();
    expect(kept === 'Attic', `the save key left "${kept}"`);
    return `cancel kept "${cancelled}", save kept "${kept}"`;
  });

  await check('Editable', 'the reading and every key are at least the touch target, and a change is announced', async () => {
    await go('/components/editable/code');
    const r = await root().evaluate((el) => ({
      reading: el.querySelector('button[aria-labelledby]').getBoundingClientRect().height,
      key: el.querySelector('[data-component="IconButton"]').getBoundingClientRect().height,
    }));
    expect(r.reading >= 43.5 && r.key >= 43.5, `reading ${r.reading}px, edit key ${r.key}px`);
    await reading().click();
    const w = await root().evaluate((el) => [...el.querySelectorAll('[data-component="IconButton"]')].map((k) => k.getBoundingClientRect().height));
    expect(w.length === 2 && w.every((h) => h >= 43.5), `editing keys ${w.join(', ')}px`);
    await field().fill('Cellar');
    await page.keyboard.press('Enter');
    const said = ((await status().textContent()) ?? '').trim();
    expect(/changed to Cellar/.test(said), `status says "${said}"`);
    return `reading ${r.reading}px, keys ${r.key}px, announced "${said}"`;
  });

  await check('Editable', 'no part of the editable is the accent orange', async () => {
    await go('/components/editable/code');
    await reading().click();
    const bad = await root().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
