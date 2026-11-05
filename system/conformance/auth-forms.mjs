// Behaviour checks for AuthForms (SignInForm, SignUpForm, ResetPasswordForm), run by tooling/kiln/conformance.mjs.
// The Usage subject on the code tab holds four forms in this order: SignInForm (remember, both links), SignUpForm (with a name),
// ResetPasswordForm in request mode, and ResetPasswordForm with sent and defaultEmail "mika@example.com".
// Each onSubmit writes JSON to document.documentElement.dataset.signin, .signup or .reset.
const SIGN_IN = '[data-component="SignInForm"]';
const SIGN_UP = '[data-component="SignUpForm"]';
const RESET = '[data-component="ResetPasswordForm"]';
export default async function authForms({ check, expect, go, main, page }) {
  const one = (sel, n = 0) => main().locator(sel).nth(n);
  const field = (root, name) => root.locator(`input[name="${name}"]`);
  const clear = () => page.evaluate(() => { for (const k of ['signin', 'signup', 'reset']) delete document.documentElement.dataset[k]; });
  const got = (k) => page.evaluate((key) => document.documentElement.dataset[key] ?? '', k);

  await check('AuthForms', 'every field carries the autocomplete word a password manager needs', async () => {
    await go('/components/auth-forms/code');
    const wordsOf = (root) => root.evaluate((el) => Object.fromEntries(Array.from(el.querySelectorAll('input[name]')).map((i) => [i.name, i.getAttribute('autocomplete')])));
    const a = await wordsOf(one(SIGN_IN));
    expect(a.email === 'username' && a.password === 'current-password', `sign-in: ${JSON.stringify(a)}`);
    const b = await wordsOf(one(SIGN_UP));
    expect(b.name === 'name' && b.email === 'email' && b.password === 'new-password' && b.confirm === 'new-password', `sign-up: ${JSON.stringify(b)}`);
    const c = await wordsOf(one(RESET));
    expect(c.email === 'email', `reset: ${JSON.stringify(c)}`);
    return 'sign-in username + current-password; sign-up name, email, new-password twice; reset email';
  });

  await check('AuthForms', 'an empty sign-in moves focus to the summary, and a good one calls onSubmit with the values', async () => {
    await go('/components/auth-forms/code');
    await clear();
    const root = one(SIGN_IN);
    await root.locator('button[type="submit"]').click();
    const r = await root.evaluate((el) => {
      const s = el.querySelector('[data-component="FormSummary"]');
      return { has: !!s, focused: !!s && document.activeElement === s, links: s ? s.querySelectorAll('a').length : 0 };
    });
    expect(r.has && r.focused, `summary shown ${r.has}, focused ${r.focused}`);
    expect(r.links === 2, `${r.links} links in the summary, need 2 (email and password)`);
    expect((await got('signin')) === '', 'onSubmit ran with empty fields');
    await field(root, 'email').fill('mika@example.com');
    await field(root, 'password').fill('secret-pass');
    await field(root, 'password').press('Enter');
    await page.waitForTimeout(300);
    const v1 = JSON.parse((await got('signin')) || '{}');
    expect(v1.email === 'mika@example.com' && v1.password === 'secret-pass' && v1.remember === false, `values ${JSON.stringify(v1)}`);
    await clear();
    await root.getByLabel('Keep me signed in').check({ force: true });
    await field(root, 'password').press('Enter');
    await page.waitForTimeout(300);
    const v2 = JSON.parse((await got('signin')) || '{}');
    expect(v2.remember === true, `remember ${JSON.stringify(v2)}`);
    return 'two problems linked, focus on the summary, values {email, password, remember} passed';
  });

  await check('AuthForms', 'sign-up names a password mismatch in the summary and passes no repeated password', async () => {
    await go('/components/auth-forms/code');
    await clear();
    const root = one(SIGN_UP);
    await field(root, 'name').fill('Mika');
    await field(root, 'email').fill('mika@example.com');
    await field(root, 'password').fill('longenough1');
    await field(root, 'confirm').fill('different1');
    await root.locator('button[type="submit"]').click();
    const text = await root.locator('[data-component="FormSummary"]').innerText();
    expect(/Repeat the password/.test(text) && /not the same/.test(text), `summary reads: ${text.replace(/\n/g, ' | ')}`);
    expect((await got('signup')) === '', 'onSubmit ran with two different passwords');
    await field(root, 'confirm').fill('longenough1');
    await field(root, 'confirm').press('Enter');
    await page.waitForTimeout(300);
    const v = JSON.parse((await got('signup')) || '{}');
    expect(v.name === 'Mika' && v.email === 'mika@example.com' && v.password === 'longenough1', `values ${JSON.stringify(v)}`);
    expect(!('confirm' in v), 'the repeated password was passed on');
    const short = await field(root, 'password').getAttribute('minlength');
    expect(short === '8', `minlength ${short}`);
    return 'mismatch named, then values {name, email, password} without confirm';
  });

  await check('AuthForms', 'reset sends the email, and sent swaps the fields for a confirmation that names the address', async () => {
    await go('/components/auth-forms/code');
    await clear();
    const ask = one(RESET, 0);
    expect(!(await ask.getAttribute('data-sent')), 'the request form starts as sent');
    await field(ask, 'email').fill('mika@example.com');
    await field(ask, 'email').press('Enter');
    await page.waitForTimeout(300);
    const v = JSON.parse((await got('reset')) || '{}');
    expect(v.email === 'mika@example.com', `values ${JSON.stringify(v)}`);
    const done = one(RESET, 1);
    expect((await done.getAttribute('data-sent')) !== null, 'the sent form lacks data-sent');
    expect((await done.locator('input, form').count()) === 0, 'the sent form still holds fields');
    const text = await done.innerText();
    expect(/mika@example\.com/.test(text), `confirmation reads: ${text.replace(/\n/g, ' | ')}`);
    expect((await done.locator('a').count()) === 1, 'the way back is missing');
    return 'email passed to onSubmit; sent form names mika@example.com and keeps one link';
  });

  await check('AuthForms', 'there are no brand buttons, the key sits at the end of the foot row and every control is 44px tall', async () => {
    await go('/components/auth-forms/code');
    const root = one(SIGN_IN);
    const names = await root.locator('button').evaluateAll((els) => els.map((b) => (b.textContent || '') + (b.getAttribute('aria-label') || '')));
    expect(!names.some((n) => /google|apple|facebook|github|microsoft/i.test(n)), `buttons: ${names.join(' | ')}`);
    expect((await root.locator('button[type="submit"]').count()) === 1, 'more than one submit key');
    const m = await root.evaluate((el) => {
      const form = el.querySelector('form');
      const key = el.querySelector('button[type="submit"]').getBoundingClientRect();
      const link = Array.from(form.querySelectorAll('a')).find((a) => !a.closest('[data-component="FormSummary"]')).getBoundingClientRect();
      const foot = form.querySelector('button[type="submit"]').parentElement.getBoundingClientRect();
      return { keyH: key.height, linkH: link.height, keyW: key.width, footW: foot.width, gapEnd: Math.abs(foot.right - key.right), linkStart: Math.abs(link.left - foot.left), linkBeforeKey: link.right <= key.left + 1 };
    });
    expect(m.keyH >= 44 && m.linkH >= 44, `key ${m.keyH}px, link ${m.linkH}px, need 44`);
    expect(m.keyW < m.footW * 0.7, `key spans ${m.keyW} of ${m.footW}`);
    expect(m.gapEnd <= 2, `key is ${m.gapEnd}px from the end of the row`);
    expect(m.linkStart <= 2 && m.linkBeforeKey, `link is ${m.linkStart}px from the start and ${m.linkBeforeKey ? '' : 'not '}before the key`);
    return `key ${Math.round(m.keyH)}px at the end of the row, link ${Math.round(m.linkH)}px at the start, no brand buttons`;
  });
}
