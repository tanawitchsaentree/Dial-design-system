// Behaviour checks for TransferList (two Listbox windows with keys between), run by tooling/kiln/conformance.mjs on the built book.
// UNVERIFIED here: screen reader announcements of the polite status, drag-free voice control and forced-colours rendering
// (need a real reader, a voice tool and a forced-colours run).
export default async function transferList({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="TransferList"]').first();
  const win = (n) => root().locator('[role="listbox"]').nth(n);
  const rows = (n) => win(n).locator('[role="option"]').allTextContents().then((t) => t.map((s) => s.trim()));
  const key = (name) => root().getByRole('button', { name, exact: true });
  const status = () => root().locator('[role="status"]').first();

  await check('TransferList', 'Tab reaches both windows and the keys, and Space marks a row in the available window', async () => {
    await go('/components/transfer-list/code');
    const r = await root().evaluate((el) => ({
      role: el.getAttribute('role'), name: el.getAttribute('aria-label'),
      lists: el.querySelectorAll('[role="listbox"]').length,
      named: [...el.querySelectorAll('[role="listbox"]')].every((l) => !!document.getElementById(l.getAttribute('aria-labelledby'))?.textContent.trim()),
      multi: [...el.querySelectorAll('[role="listbox"]')].every((l) => l.getAttribute('aria-multiselectable') === 'true'),
    }));
    expect(r.role === 'group' && !!r.name, `role ${r.role}, name ${r.name}`);
    expect(r.lists === 2 && r.named && r.multi, `${r.lists} lists, named ${r.named}, multiselectable ${r.multi}`);
    await win(0).focus();
    await page.keyboard.press('Space');
    const marked = await win(0).locator('[role="option"][aria-selected="true"]').count();
    expect(marked === 1, `${marked} rows marked after Space`);
    await page.keyboard.press('Tab');
    const onKey = await page.evaluate(() => document.activeElement?.tagName === 'BUTTON' && !document.activeElement.disabled);
    expect(onKey, 'Tab from the available window did not land on a key that can be pressed');
    return '2 named multiselectable windows, Space marks, Tab reaches the first key';
  });

  await check('TransferList', 'a key carries the marked rows into the other window, announces it politely and keeps focus on a list', async () => {
    await go('/components/transfer-list/code');
    const before = [await rows(0), await rows(1)];
    await win(0).focus();
    await page.keyboard.press('Space');
    const moved = (await win(0).locator('[role="option"][aria-selected="true"]').allTextContents()).map((s) => s.trim());
    await key('Add marked rows').click();
    const after = [await rows(0), await rows(1)];
    expect(moved.length === 1 && after[1].includes(moved[0]) && !after[0].includes(moved[0]), `moved ${moved}, available ${after[0]}, chosen ${after[1]}`);
    expect(after[0].length === before[0].length - 1 && after[1].length === before[1].length + 1, `counts ${before[0].length}/${before[1].length} to ${after[0].length}/${after[1].length}`);
    const said = (await status().textContent()).trim();
    expect(/moved/.test(said) && said.includes(`${after[0].length} available`) && said.includes(`${after[1].length} chosen`), `status "${said}"`);
    const live = await status().getAttribute('aria-live');
    expect(live === 'polite', `aria-live ${live}`);
    const focusOn = await page.evaluate(() => document.activeElement?.getAttribute('role'));
    expect(focusOn === 'listbox', `focus is on ${focusOn} after the key, not a list`);
    return `moved ${moved[0]}, status "${said}"`;
  });

  await check('TransferList', 'Alt with the arrow toward the other window moves the marked rows back and forth without a pointer', async () => {
    await go('/components/transfer-list/code');
    const dir = await root().evaluate((el) => getComputedStyle(el).direction);
    const toward = dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const back = dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    await win(0).focus();
    await page.keyboard.press('Space');
    const name = (await win(0).locator('[role="option"][aria-selected="true"]').first().textContent()).trim();
    await page.keyboard.press(`Alt+${toward}`);
    const mid = [await rows(0), await rows(1)];
    expect(mid[1].includes(name) && !mid[0].includes(name), `after Alt+${toward}: available ${mid[0]}, chosen ${mid[1]}`);
    await win(1).focus();
    const idx = mid[1].indexOf(name);
    for (let i = 0; i < idx; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Space');
    await page.keyboard.press(`Alt+${back}`);
    const end = [await rows(0), await rows(1)];
    expect(end[0].includes(name) && !end[1].includes(name), `after Alt+${back}: available ${end[0]}, chosen ${end[1]}`);
    return `${name} went across and came back by keyboard`;
  });

  await check('TransferList', 'the keys are named in words, at least 44px, and fade out when no row is marked; the all keys skip disabled rows', async () => {
    await go('/components/transfer-list/code');
    const r = await root().evaluate((el) => {
      const kb = [...el.querySelectorAll('button')];
      return kb.map((b) => ({ name: b.getAttribute('aria-label'), w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height, off: b.disabled }));
    });
    expect(r.length >= 4, `${r.length} keys (the subject uses moveAll)`);
    expect(r.every((k) => !!k.name && k.w >= 43.5 && k.h >= 43.5), `keys ${r.map((k) => `${k.name} ${k.w}x${k.h}`).join('; ')}`);
    const add = r.find((k) => k.name === 'Add marked rows');
    expect(add && add.off, 'Add marked rows is pressable with nothing marked');
    const hasDisabled = (await win(0).locator('[role="option"][aria-disabled="true"]').count()) > 0;
    expect(hasDisabled, 'the subject has no disabled row to test the all keys against');
    const stuck = (await win(0).locator('[role="option"][aria-disabled="true"]').first().textContent()).trim();
    await key('Add all rows').click();
    const after = [await rows(0), await rows(1)];
    expect(after[0].length === 1 && after[0][0] === stuck, `available after Add all rows: ${after[0]} (only ${stuck} should stay)`);
    await key('Remove all rows').click();
    const back = await rows(1);
    expect(back.length === 0, `chosen after Remove all rows: ${back}`);
    return `${r.length} named keys, ${stuck} stayed put`;
  });

  await check('TransferList', 'a move does not resize either window, and the windows stack with the keys in a row when the width is short', async () => {
    await go('/components/transfer-list/code');
    const size = () => root().evaluate((el) => [...el.querySelectorAll('[role="listbox"]')].map((l) => Math.round(l.getBoundingClientRect().height)));
    const before = await size();
    await win(0).focus();
    await page.keyboard.press('Space');
    await key('Add marked rows').click();
    await page.waitForTimeout(300);
    const after = await size();
    expect(before[0] === before[1] && before.join() === after.join(), `heights ${before} before, ${after} after a move`);
    await root().evaluate((el) => { el.parentElement.style.inlineSize = '320px'; });
    await page.waitForTimeout(300);
    const narrow = await root().evaluate((el) => {
      const l = [...el.querySelectorAll('[role="listbox"]')].map((x) => x.getBoundingClientRect());
      const k = [...el.querySelectorAll('button')].map((x) => x.getBoundingClientRect());
      return { stacked: el.dataset.stacked, sameLeft: Math.abs(l[0].left - l[1].left) < 1, below: l[1].top >= l[0].bottom, keysRow: Math.abs(k[0].top - k[1].top) < 1, overflow: el.scrollWidth > el.clientWidth + 1 };
    });
    expect(narrow.stacked === 'true' && narrow.sameLeft && narrow.below, `narrow: stacked ${narrow.stacked}, same left ${narrow.sameLeft}, chosen below ${narrow.below}`);
    expect(narrow.keysRow && !narrow.overflow, `narrow: keys in a row ${narrow.keysRow}, horizontal overflow ${narrow.overflow}`);
    return 'windows keep their height; stacks at 320px with keys in a row';
  });

  await check('TransferList', 'no part of the transfer list is the accent orange', async () => {
    await go('/components/transfer-list/code');
    const bad = await main().locator('[data-component="TransferList"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
