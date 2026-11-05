// Behaviour checks for Autocomplete (text well with a panel of suggestions), run by tooling/kiln/conformance.mjs.
const field = (main) => main().locator('[data-component="Autocomplete"]').first();

export default async function autocomplete({ check, expect, go, main }) {
  await check('Autocomplete', 'typing opens a panel of suggestions that the combobox owns and announces', async () => {
    await go('/components/autocomplete/code');
    const root = field(main);
    const input = root.locator('input[role="combobox"]');
    const before = await input.evaluate((el) => ({ auto: el.getAttribute('aria-autocomplete'), exp: el.getAttribute('aria-expanded') }));
    expect(before.auto === 'list' && before.exp === 'false', `closed state ${JSON.stringify(before)}`);
    await input.click();
    await input.fill('ro');
    await root.locator('[role="option"]').first().waitFor({ state: 'visible' });
    const r = await input.evaluate((el) => {
      const list = document.getElementById(el.getAttribute('aria-controls'));
      return { exp: el.getAttribute('aria-expanded'), n: list ? list.querySelectorAll('[role="option"]').length : -1, role: list && list.getAttribute('role') };
    });
    expect(r.exp === 'true' && r.role === 'listbox', `open state ${JSON.stringify(r)}`);
    expect(r.n >= 3, `${r.n} suggestions for "ro"`);
    const said = await root.locator('[role="status"]').first().innerText();
    expect(/\d+ suggestions/.test(said), `status line says "${said}"`);
    return `${r.n} suggestions, status "${said}"`;
  });

  await check('Autocomplete', 'the arrows walk the suggestions while focus stays in the field, Enter takes one and Escape closes', async () => {
    await go('/components/autocomplete/code');
    const root = field(main);
    const input = root.locator('input[role="combobox"]');
    await input.click();
    await input.fill('ro');
    await root.locator('[role="option"]').first().waitFor({ state: 'visible' });
    await input.press('ArrowDown');
    await input.press('ArrowDown');
    const r = await input.evaluate((el) => {
      const act = document.getElementById(el.getAttribute('aria-activedescendant') || '');
      return { focused: document.activeElement === el, sel: act && act.getAttribute('aria-selected'), text: act && act.textContent };
    });
    expect(r.focused, 'focus left the field');
    expect(r.sel === 'true' && !!r.text, `active option ${JSON.stringify(r)}`);
    await input.press('Enter');
    const val = await input.inputValue();
    expect(val === r.text, `field holds "${val}", expected "${r.text}"`);
    expect((await input.getAttribute('aria-expanded')) === 'false', 'panel stayed open after Enter');
    await input.fill('ro');
    await root.locator('[role="option"]').first().waitFor({ state: 'visible' });
    await input.press('Escape');
    expect((await input.getAttribute('aria-expanded')) === 'false', 'Escape did not close the panel');
    expect((await input.inputValue()) === 'ro', 'Escape changed the typed text');
    return `Enter took "${r.text}", Escape closed and kept the text`;
  });

  await check('Autocomplete', 'text that matches nothing stays valid and says so', async () => {
    await go('/components/autocomplete/code');
    const root = field(main);
    const input = root.locator('input[role="combobox"]');
    await input.click();
    await input.fill('zzq');
    await root.locator('[role="status"]').first().waitFor();
    const said = await root.locator('[role="status"]').first().innerText();
    expect(/stays as typed/i.test(said), `status line says "${said}"`);
    expect((await root.locator('[role="option"]:visible').count()) === 0, 'options shown for text that matches nothing');
    await input.press('Enter');
    expect((await input.inputValue()) === 'zzq', 'free text was changed on Enter');
    expect((await input.getAttribute('aria-invalid')) == null, 'free text was marked invalid');
    return 'free text kept after Enter, empty line announced';
  });

  await check('Autocomplete', 'every suggestion row is at least the touch target', async () => {
    await go('/components/autocomplete/code');
    const root = field(main);
    const input = root.locator('input[role="combobox"]');
    await input.click();
    await input.fill('ro');
    await root.locator('[role="option"]').first().waitFor({ state: 'visible' });
    const rows = await root.locator('[role="option"]').evaluateAll((els) => els.map((e) => e.getBoundingClientRect().height));
    expect(rows.length > 0 && rows.every((h) => h >= 43.5), `row heights ${rows.join(', ')}`);
    return `${rows.length} rows, shortest ${Math.min(...rows)}px`;
  });

  await check('Autocomplete', 'no part of the autocomplete is the accent orange', async () => {
    await go('/components/autocomplete/code');
    const root = field(main);
    const input = root.locator('input[role="combobox"]');
    await input.click();
    await input.fill('ro');
    await root.locator('[role="option"]').first().waitFor({ state: 'visible' });
    await input.press('ArrowDown');
    const bad = await root.evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
