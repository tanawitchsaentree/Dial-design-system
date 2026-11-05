// Behaviour checks for Avatar (recessed window with a picture or initials), run by tooling/kiln/conformance.mjs.
export default async function avatar({ check, expect, go, main }) {
  await check('Avatar', 'a window is either named as an image or hidden, and never takes focus', async () => {
    await go('/components/avatar/code');
    const r = await main().locator('[data-component="Avatar"]').evaluateAll((els) => els.map((el) => ({
      named: el.getAttribute('role') === 'img' && Boolean(el.getAttribute('aria-label')),
      hidden: el.getAttribute('aria-hidden') === 'true',
      tab: el.tabIndex,
    })));
    expect(r.length >= 3, `${r.length} avatars`);
    expect(r.every((x) => x.named || x.hidden), 'an avatar is neither named nor hidden');
    expect(r.every((x) => x.tab < 0), 'an avatar can take focus');
    return `${r.length} avatars, named or hidden, none focusable`;
  });
  await check('Avatar', 'the three sizes draw 32, 44 and 80px and the window is a rounded square, not a disc', async () => {
    await go('/components/avatar/code');
    const r = await main().locator('[data-component="Avatar"]').evaluateAll((els) => els.map((el) => {
      const b = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      return { size: el.dataset.size, w: Math.round(b.width), h: Math.round(b.height), radius: parseFloat(cs.borderTopLeftRadius) };
    }));
    const want = { sm: 32, md: 44, lg: 80 };
    for (const x of r) {
      expect(x.w === want[x.size] && x.h === want[x.size], `${x.size} is ${x.w}×${x.h}, wants ${want[x.size]}`);
      expect(x.radius > 0 && x.radius < x.w / 2, `${x.size} corner ${x.radius}px is a disc or square`);
    }
    return `${r.length} windows measured`;
  });
  await check('Avatar', 'initials are the first letters of the first and last word, and a broken picture falls back to them', async () => {
    await go('/components/avatar/code');
    const r = await main().locator('[data-component="Avatar"]').evaluateAll((els) => els.map((el) => ({ text: el.textContent.trim(), img: Boolean(el.querySelector('img')), label: el.getAttribute('aria-label') || '' })));
    const maren = r.filter((x) => /^Maren Solberg/.test(x.label) && !x.img);
    expect(maren.length > 0 && maren.every((x) => x.text === 'MS'), `Maren shows ${maren.map((x) => x.text).join(', ')}`);
    const broken = r.find((x) => /picture missing/.test(x.label));
    expect(!broken || (!broken.img && broken.text === 'MS'), 'a broken picture did not fall back to initials');
    return 'MS for Maren Solberg; broken picture falls back';
  });
  await check('Avatar', 'no part of the avatar is the accent orange', async () => {
    await go('/components/avatar/code');
    const bad = await main().locator('[data-component="Avatar"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const out = []; for (const el of els) for (const n of [el, ...el.querySelectorAll('*')]) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) out.push(n.tagName); }
      return out;
    });
    expect(bad.length === 0, `${bad.length} orange parts`);
    return 'no orange';
  });
}
