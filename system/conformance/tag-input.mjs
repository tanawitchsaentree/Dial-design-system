// Behaviour checks for TagInput (the Input well that keeps its words as chips), run by tooling/kiln/conformance.mjs.
export default async function tagInput({ check, expect, page, go, main }) {
  const root = () => main().locator('[data-component="TagInput"]').first();
  const field = () => root().locator('input[type="text"]');
  const chips = () => root().locator('[data-component="Chip"]');
  await check('TagInput', 'Enter and a comma turn typed text into chips and empty the field', async () => {
    await go('/components/tag-input/code');
    const before = await chips().count();
    expect(before >= 2, `${before} starting chips (need 2 or more)`);
    await field().click();
    await page.keyboard.type('Den');
    await page.keyboard.press('Enter');
    const afterEnter = await chips().count();
    const empty1 = await field().inputValue();
    expect(afterEnter === before + 1 && empty1 === '', `after Enter ${afterEnter} chips, field "${empty1}"`);
    return `${before} to ${afterEnter} chips`;
  });
  await check('TagInput', 'a comma ends a tag and the text after it stays in the field', async () => {
    await go('/components/tag-input/code');
    const before = await chips().count();
    await field().click();
    await page.keyboard.type('Den,Po');
    const n = await chips().count();
    const rest = await field().inputValue();
    expect(n === before + 1 && rest === 'Po', `${n} chips, field "${rest}"`);
    return 'comma adds, remainder kept';
  });
  await check('TagInput', 'Backspace on an empty field removes the last chip, and only then', async () => {
    await go('/components/tag-input/code');
    const before = await chips().count();
    await field().click();
    await page.keyboard.type('ab');
    await page.keyboard.press('Backspace');
    await page.keyboard.press('Backspace');
    const same = await chips().count();
    expect(same === before, `Backspace in text removed a chip (${before} to ${same})`);
    await page.keyboard.press('Backspace');
    const after = await chips().count();
    expect(after === before - 1, `${before} chips before, ${after} after Backspace on empty`);
    return `${before} to ${after}`;
  });
  await check('TagInput', 'a duplicate and a tag past max are refused with words, and the field is marked invalid', async () => {
    await go('/components/tag-input/code');
    const before = await chips().count();
    await field().click();
    const first = (await chips().first().locator('[data-text]').first().getAttribute('data-text')) ?? '';
    await page.keyboard.type(first.toLowerCase());
    await page.keyboard.press('Enter');
    const dupChips = await chips().count();
    const dupInvalid = await field().getAttribute('aria-invalid');
    const dupText = ((await root().locator('p[id$="-error"]').textContent().catch(() => '')) ?? '').trim();
    expect(dupChips === before && dupInvalid === 'true' && dupText.length > 0, `duplicate: ${dupChips} chips, aria-invalid ${dupInvalid}, message "${dupText}"`);
    await field().fill('');
    await page.keyboard.type('Zeta');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Omega');
    await page.keyboard.press('Enter');
    const total = await chips().count();
    const maxText = ((await root().locator('p[id$="-error"]').textContent().catch(() => '')) ?? '').trim();
    expect(total === 3 && maxText.length > 0, `max: ${total} chips (limit 3), message "${maxText}"`);
    return `refused: "${dupText}", "${maxText}"`;
  });
  await check('TagInput', 'every chip and the text field are at least the touch target tall and each remove key is named', async () => {
    await go('/components/tag-input/code');
    const r = await root().evaluate((el) => ({
      chips: [...el.querySelectorAll('[data-component="Chip"]')].map((c) => c.getBoundingClientRect().height),
      field: el.querySelector('input[type="text"]').getBoundingClientRect().height,
      names: [...el.querySelectorAll('[data-component="Chip"] button')].map((b) => b.getAttribute('aria-label') || ''),
    }));
    expect(r.chips.length >= 2 && r.chips.every((h) => h >= 43.5) && r.field >= 43.5, `chips ${r.chips.join(', ')}, field ${r.field}`);
    expect(r.names.every((n) => n.length > 0), `remove keys named: ${r.names.join(' | ')}`);
    return `${r.chips.length} chips, names ${r.names.join(', ')}`;
  });
  await check('TagInput', 'the tags are announced in a named list and changes are spoken through a polite status', async () => {
    await go('/components/tag-input/code');
    const r = await root().evaluate((el) => ({
      list: !!el.querySelector('ul[role="list"][aria-labelledby]'),
      status: !!el.querySelector('[role="status"][aria-live="polite"]'),
      labelFor: el.querySelector('label').htmlFor === el.querySelector('input[type="text"]').id,
    }));
    expect(r.list && r.status && r.labelFor, `list ${r.list}, status ${r.status}, label ${r.labelFor}`);
    return 'list, status and label wired';
  });
  await check('TagInput', 'no part of the field is the accent orange', async () => {
    await go('/components/tag-input/code');
    const bad = await root().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
