// Behaviour checks for PasswordInput (Input's well for a secret with a latching show/hide key), run by tooling/kiln/conformance.mjs.
// The first PasswordInput on the code tab is "New password": autoComplete new-password, a hint, defaultValue "correct horse", strength "fair", md.
const SEL = '[data-component="PasswordInput"]';
export default async function passwordInput({ check, expect, go, main }) {
  const first = () => main().locator(SEL).first();
  const active = (box) => box.page().evaluate(() => document.activeElement?.tagName + ':' + (document.activeElement?.getAttribute('aria-pressed') ?? document.activeElement?.type ?? ''));

  await check('PasswordInput', 'Tab moves from the characters to the key', async () => {
    await go('/components/password-input/code');
    const box = first();
    const input = box.locator('input');
    await input.focus();
    await box.page().keyboard.press('Tab');
    const now = await active(box);
    expect(now.startsWith('BUTTON'), `Tab from the characters landed on ${now}, need the key`);
    return now;
  });

  await check('PasswordInput', 'Space on the key shows the characters and sets aria-pressed', async () => {
    await go('/components/password-input/code');
    const box = first();
    const input = box.locator('input');
    const key = box.locator('button');
    const word = box.locator('> div > div > span');
    expect((await input.getAttribute('type')) === 'password', 'the characters start visible');
    expect((await key.getAttribute('aria-pressed')) === 'false', 'the key does not start with aria-pressed false');
    const closed = await key.innerHTML();
    const wordBefore = (await word.textContent()) ?? '';
    await key.focus();
    await box.page().keyboard.press('Space');
    expect((await input.getAttribute('type')) === 'text', 'Space did not turn the field to text');
    expect((await key.getAttribute('aria-pressed')) === 'true', 'aria-pressed is not true after Space');
    const open = await key.innerHTML();
    expect(open !== closed, 'the glyph on the key did not change');
    const wordAfter = (await word.textContent()) ?? '';
    expect(wordAfter !== wordBefore && wordAfter.length > 0, `the word stayed "${wordBefore}"`);
    expect((await input.inputValue()) === 'correct horse', 'the value changed when the state flipped');
    await box.page().keyboard.press('Enter');
    expect((await input.getAttribute('type')) === 'password', 'Enter did not hide the characters again');
    expect((await key.getAttribute('aria-pressed')) === 'false', 'aria-pressed did not go back to false');
    expect((await key.getAttribute('aria-label')) === 'Show password', 'the key name changed with the state');
    return `"${wordBefore}" to "${wordAfter}" and back, glyph changed`;
  });

  await check('PasswordInput', 'pressing the key by pointer keeps the caret in the field', async () => {
    await go('/components/password-input/code');
    const box = first();
    const input = box.locator('input');
    await input.focus();
    await box.locator('button').click();
    const now = await active(box);
    expect(now.startsWith('INPUT'), `focus moved to ${now} after a pointer press`);
    expect((await input.getAttribute('type')) === 'text', 'the pointer press did not show the characters');
    return now;
  });

  await check('PasswordInput', 'the key is a 44px target and the strength line is a polite live region', async () => {
    await go('/components/password-input/code');
    const box = first();
    const key = box.locator('button');
    const r = await key.evaluate((e) => { const b = e.getBoundingClientRect(); return [b.width, b.height]; });
    expect(r[0] >= 43.5 && r[1] >= 43.5, `key ${r[0]}×${r[1]}`);
    const input = box.locator('input');
    expect((await input.getAttribute('autocomplete')) === 'new-password', `autocomplete is ${await input.getAttribute('autocomplete')}`);
    const live = box.locator('[aria-live="polite"]');
    expect((await live.count()) === 1, 'no polite live region for the strength');
    expect(((await live.textContent()) ?? '').toLowerCase().includes('fair'), `the strength line reads "${await live.textContent()}"`);
    const described = (await input.getAttribute('aria-describedby')) ?? '';
    const liveId = await live.getAttribute('id');
    expect(described.split(' ').includes(liveId), 'the field does not point at the strength line');
    return `key ${r[0]}×${r[1]}, live "${((await live.textContent()) ?? '').trim()}"`;
  });

  await check('PasswordInput', 'no part of the password input is the accent orange', async () => {
    await go('/components/password-input/code');
    const bad = await main().locator(SEL).evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
