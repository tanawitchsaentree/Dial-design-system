// Behaviour checks for Dropzone (a tray window that takes dropped files), run by tooling/kiln/conformance.mjs.
// Drag events are dispatched with a real DataTransfer holding real File objects. UNVERIFIED: a drag that starts
// in the operating system's file manager (needs a headed browser), and the native picker dialog's contents.
export default async function dropzone({ check, expect, page, go, main }) {
  const live = () => main().locator('[data-component="Dropzone"]:not([data-disabled])').first();
  const fire = (loc, type, names) => loc.evaluate((el, a) => {
    const dt = new DataTransfer();
    for (const n of a.names) dt.items.add(new File(['x'], n, { type: n.endsWith('.png') ? 'image/png' : 'text/plain' }));
    el.dispatchEvent(new DragEvent(a.type, { bubbles: true, cancelable: true, dataTransfer: dt }));
  }, { type, names });

  await check('Dropzone', 'the Choose key is reachable by Tab, is at least 44px, and Enter and Space open the file picker', async () => {
    await go('/components/dropzone/code');
    const key = live().locator('button').first();
    const box = await key.boundingBox();
    expect(box && box.height >= 43.5 && box.width >= 43.5, `key ${box && box.width}×${box && box.height}`);
    await key.focus();
    const focused = await key.evaluate((el) => document.activeElement === el);
    expect(focused, 'the key did not take focus');
    const [byEnter] = await Promise.all([page.waitForEvent('filechooser', { timeout: 3000 }), page.keyboard.press('Enter')]);
    expect(!!byEnter, 'Enter did not open the picker');
    const [bySpace] = await Promise.all([page.waitForEvent('filechooser', { timeout: 3000 }), page.keyboard.press('Space')]);
    expect(!!bySpace, 'Space did not open the picker');
    return `key ${Math.round(box.width)}×${Math.round(box.height)}, Enter and Space open the picker`;
  });

  await check('Dropzone', 'a file held over changes the words, the glyph and the rim without resizing, and leaving puts them back', async () => {
    await go('/components/dropzone/code');
    const tray = live();
    const read = () => tray.evaluate((el) => {
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return { w: Math.round(r.width), h: Math.round(r.height), title: el.querySelector('p').textContent, glyph: el.querySelector('svg').innerHTML, rim: cs.outlineColor, over: el.getAttribute('data-over') };
    });
    const before = await read();
    await fire(tray, 'dragenter', ['a.txt']);
    await page.waitForTimeout(500);
    const during = await read();
    expect(during.over === 'true', 'data-over was not set while a file was held over');
    expect(during.title !== before.title, `title stayed "${before.title}"`);
    expect(during.glyph !== before.glyph, 'the glyph did not change');
    expect(during.rim !== before.rim, `rim colour stayed ${before.rim}`);
    expect(during.w === before.w && during.h === before.h, `size ${before.w}×${before.h} became ${during.w}×${during.h}`);
    await fire(tray, 'dragleave', ['a.txt']);
    await page.waitForTimeout(500);
    const after = await read();
    expect(after.over === null && after.title === before.title, 'the tray did not return to rest');
    return `"${before.title}" -> "${during.title}", size held at ${before.w}×${before.h}`;
  });

  await check('Dropzone', 'a drop is announced, and with multiple off only the first file is taken', async () => {
    await go('/components/dropzone/code');
    const tray = live();
    await fire(tray, 'dragenter', ['a.txt']);
    await fire(tray, 'drop', ['a.txt', 'b.txt']);
    await page.waitForTimeout(300);
    const said = await tray.locator('[role="status"]').textContent();
    const over = await tray.getAttribute('data-over');
    expect(over === null, 'the tray stayed in the held-over state after the drop');
    expect(/1 file added/.test(said) && /1 file not accepted/.test(said), `status "${said}"`);
    return `status "${said}"`;
  });

  await check('Dropzone', 'a disabled tray takes no drop and its key is disabled', async () => {
    await go('/components/dropzone/code');
    const off = main().locator('[data-component="Dropzone"][data-disabled="true"]').first();
    await fire(off, 'dragenter', ['a.txt']);
    await fire(off, 'drop', ['a.txt']);
    await page.waitForTimeout(300);
    const r = await off.evaluate((el) => ({ over: el.getAttribute('data-over'), said: el.querySelector('[role="status"]').textContent, off: el.querySelector('button').disabled }));
    expect(r.over === null && r.said === '', `over ${r.over}, status "${r.said}"`);
    expect(r.off, 'the key is not disabled');
    return 'no drop taken, key disabled';
  });

  await check('Dropzone', 'no part of the tray is the accent orange', async () => {
    await go('/components/dropzone/code');
    const bad = await main().locator('[data-component="Dropzone"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor, cs.outlineColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
