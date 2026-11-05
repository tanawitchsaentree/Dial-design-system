// Behaviour checks for Image (a picture in a recessed window), run by tooling/kiln/conformance.mjs.
export default async function image({ check, expect, go, main }) {
  await check('Image', 'a failed picture shows two dashes, no img element, and the window is named by alt', async () => {
    await go('/components/image/code');
    const r = await main().locator('figure[data-component="Image"]').evaluateAll((figs) => figs.map((f) => {
      const w = f.firstElementChild; const m = w.querySelector('span span');
      const cs = m ? getComputedStyle(m) : null;
      return { state: w.dataset.state, imgs: w.querySelectorAll('img').length, role: w.getAttribute('role'), label: w.getAttribute('aria-label'), h: cs ? parseFloat(cs.height) : 0, bottom: cs ? parseFloat(cs.borderBottomWidth) : 0 };
    }));
    const failed = r.filter((x) => x.state === 'error');
    expect(failed.length >= 1, `${failed.length} failed windows (the subject needs one)`);
    expect(failed.every((x) => x.imgs === 0 && x.role === 'img' && x.label), `failed ${JSON.stringify(failed)}`);
    expect(failed.every((x) => x.bottom > 0 && x.h > 0), `second dash not drawn: ${JSON.stringify(failed)}`);
    return `${failed.length} failed, two dashes, named by alt`;
  });
  await check('Image', 'the window keeps its ratio loaded or failed, so the layout does not move', async () => {
    await go('/components/image/code');
    const r = await main().locator('figure[data-component="Image"]').evaluateAll((figs) => figs.map((f) => {
      const b = f.firstElementChild.getBoundingClientRect(); const ar = getComputedStyle(f.firstElementChild).aspectRatio.split('/').map((x) => parseFloat(x)); return { state: f.firstElementChild.dataset.state, ratio: b.width / b.height, want: ar.length === 2 ? ar[0] / ar[1] : ar[0], w: b.width };
    }));
    expect(r.length >= 2, `${r.length} images (need a loaded and a failed one)`);
    expect(new Set(r.map((x) => x.state)).size >= 2, `states ${r.map((x) => x.state).join(', ')}`);
    expect(r.every((x) => x.w > 0 && Math.abs(x.ratio - x.want) < 0.02), `ratios ${r.map((x) => x.ratio.toFixed(3)).join(', ')}`);
    return `${r.length} windows at their declared ratio`;
  });
  await check('Image', 'the caption sits below the window and no text sits on the picture', async () => {
    await go('/components/image/code');
    const r = await main().locator('figure[data-component="Image"]').evaluateAll((figs) => figs.filter((f) => f.querySelector('figcaption')).map((f) => {
      const w = f.firstElementChild.getBoundingClientRect(); const c = f.querySelector('figcaption').getBoundingClientRect();
      return { below: c.top >= w.bottom - 0.5, inside: f.firstElementChild.contains(f.querySelector('figcaption')), text: (f.firstElementChild.textContent || '').trim() };
    }));
    expect(r.length >= 1, 'no captioned image on the page');
    expect(r.every((x) => x.below && !x.inside && x.text === ''), `captions ${JSON.stringify(r)}`);
    return `${r.length} captions below, no text in the window`;
  });
  await check('Image', 'every picture has an alt attribute and no part of the image is the accent orange', async () => {
    await go('/components/image/code');
    const r = await main().locator('figure[data-component="Image"]').evaluateAll((els) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const noAlt = []; const orange = [];
      for (const el of els) {
        for (const i of el.querySelectorAll('img')) if (!i.hasAttribute('alt')) noAlt.push(i.src);
        for (const n of el.querySelectorAll('*')) { const cs = getComputedStyle(n); if (accent && [cs.backgroundColor, cs.color, cs.borderColor].some((c) => c === accent)) orange.push(n.tagName); }
      }
      return { noAlt: noAlt.length, orange: orange.length };
    });
    expect(r.noAlt === 0, `${r.noAlt} img without alt`);
    expect(r.orange === 0, `${r.orange} orange parts`);
    return 'alt on every img, no orange';
  });
}
