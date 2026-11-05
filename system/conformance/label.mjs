// Behaviour checks for Label (the printed name above a part), run by tooling/kiln/conformance.mjs.
export default async function label({ check, expect, go, main }) {
  await check('Label', 'it is a real label tied to its part by for, and the required word is inside it so it is part of the name', async () => {
    await go('/components/label/code');
    const r = await main().locator('[data-component="Label"]').first().evaluate((root) => {
      const l = root.querySelector('label');
      return { tag: l ? l.tagName : '', htmlFor: l ? l.getAttribute('for') : '', text: l ? l.textContent : '' };
    });
    expect(r.tag === 'LABEL', `element is ${r.tag}`);
    expect(!!r.htmlFor, 'label has no for attribute');
    expect(/required/i.test(r.text) && /room name/i.test(r.text), `label text is "${r.text}"`);
    return `label for=${r.htmlFor}, name "${r.text}"`;
  });
  await check('Label', 'the word mark sits at the far end of the line, after the name, and is not colour alone', async () => {
    await go('/components/label/code');
    const r = await main().locator('[data-component="Label"]').first().evaluate((root) => {
      const name = root.querySelector('label > span:first-child').getBoundingClientRect();
      const mark = root.querySelector('label > span:nth-child(2)');
      const m = mark.getBoundingClientRect();
      const lr = root.querySelector('label').getBoundingClientRect();
      const rtl = getComputedStyle(root).direction === 'rtl';
      return { wordy: /\w/.test(mark.textContent), atEnd: rtl ? m.left - lr.left < 2 : lr.right - m.right < 2, after: rtl ? m.right <= name.left + 1 : m.left >= name.right - 1, size: getComputedStyle(mark).fontSize, nameSize: getComputedStyle(root.querySelector('label > span:first-child')).fontSize };
    });
    expect(r.wordy, 'the mark holds no word');
    expect(r.after, 'the mark is not after the name');
    expect(r.atEnd, 'the mark is not at the far end of the line');
    expect(parseFloat(r.size) < parseFloat(r.nameSize), `mark ${r.size} is not smaller than name ${r.nameSize}`);
    return `word mark at the end, ${r.size} under the name's ${r.nameSize}`;
  });
  await check('Label', 'the glyph form hides the star from assistive tech and keeps the word for it', async () => {
    await go('/components/label/code');
    const r = await main().locator('[data-component="Label"][data-mark="glyph"]').first().evaluate((root) => {
      const star = root.querySelector('label > span[aria-hidden="true"]');
      const hidden = root.querySelector('[data-component="VisuallyHidden"]');
      const hr = hidden ? hidden.getBoundingClientRect() : null;
      return { star: star ? star.textContent : '', word: hidden ? hidden.textContent : '', tiny: hr ? hr.width <= 2 && hr.height <= 2 : false };
    });
    expect(r.star === '*', `star is "${r.star}"`);
    expect(/required/i.test(r.word), `hidden word is "${r.word}"`);
    expect(r.tiny, 'the word is visible on screen');
    return 'star aria-hidden, word "required" kept for screen readers';
  });
  await check('Label', 'no part of the label is the accent orange and the help sits under the name', async () => {
    await go('/components/label/code');
    const r = await main().locator('[data-component="Label"]').first().evaluate((root) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const bad = [...root.querySelectorAll('*')].filter((n) => { const cs = getComputedStyle(n); return accent && [cs.backgroundColor, cs.color, cs.borderColor].includes(accent); }).length;
      const help = root.querySelector(':scope > p');
      const label = root.querySelector('label');
      return { bad, helpBelow: help ? help.getBoundingClientRect().top >= label.getBoundingClientRect().bottom - 1 : false };
    });
    expect(r.bad === 0, `${r.bad} orange parts`);
    expect(r.helpBelow, 'help is not under the name');
    return 'no orange, help under the name';
  });
}
