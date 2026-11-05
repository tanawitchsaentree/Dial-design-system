// Behaviour checks for SettingsLayout (titled sections of rows, name on the start side and part on the end), run by tooling/kiln/conformance.mjs.
// The subject on the /code tab has a wide layout first (two sections of two rows) and a narrow layout second.
export default async function settingsLayout({ check, expect, go, main }) {
  await check('SettingsLayout', 'the layout and each section are regions named by their headings, and each row names its part', async () => {
    await go('/components/settings-layout/code');
    const r = await main().locator('[data-component="SettingsLayout"]').first().evaluate((root) => {
      const name = (el) => (el.getAttribute('aria-labelledby') || '').split(' ').map((i) => document.getElementById(i)?.textContent || '').join('').trim();
      const heads = (el) => { const h = document.getElementById((el.getAttribute('aria-labelledby') || '').split(' ')[0]); return h ? h.tagName : ''; };
      const sections = [...root.querySelectorAll('[data-component="SettingsSection"]')];
      const rows = [...root.querySelectorAll('[data-component="SettingsRow"]')];
      return {
        title: name(root), titleTag: heads(root), sections: sections.map((s) => ({ n: name(s), tag: heads(s) })),
        rows: rows.length, listitems: rows.filter((x) => x.getAttribute('role') === 'listitem' && x.parentElement?.getAttribute('role') === 'list').length,
        named: rows.filter((x) => { const sw = x.querySelector('[role="switch"]'); return sw && (sw.getAttribute('aria-labelledby') || '').split(' ').some((i) => document.getElementById(i) && x.contains(document.getElementById(i))); }).length,
      };
    });
    expect(r.title.length > 0, 'the layout has no accessible name');
    expect(r.sections.length >= 2 && r.sections.every((s) => s.n.length > 0 && /^H[1-6]$/.test(s.tag)), `sections ${JSON.stringify(r.sections)}`);
    expect(r.title !== r.sections[0].n && Number(r.titleTag[1]) < Number(r.sections[0].tag[1]), `title ${r.titleTag} must outrank section ${r.sections[0].tag}`);
    expect(r.rows >= 4 && r.listitems === r.rows, `${r.listitems} of ${r.rows} rows are list items in a list`);
    expect(r.named >= 3, `${r.named} switches name themselves from their row`);
    return `title "${r.title}", ${r.sections.length} named sections, ${r.rows} rows`;
  });
  await check('SettingsLayout', 'rows are parted by seams between rows only, and every row is at least the touch target tall', async () => {
    await go('/components/settings-layout/code');
    const r = await main().locator('[data-component="SettingsLayout"]').first().evaluate((root) => {
      const boxes = [...root.querySelectorAll('[data-component="SettingsSection"] > [role="list"]')];
      return boxes.map((b) => {
        const rows = [...b.querySelectorAll(':scope > [data-component="SettingsRow"]')];
        const seams = rows.map((x) => { const s = x.querySelector(':scope > [data-component="Divider"]'); return !!s && s.getBoundingClientRect().height > 0; });
        return { rows: rows.length, seams, minH: Math.min(...rows.map((x) => x.getBoundingClientRect().height)) };
      });
    });
    expect(r.length >= 2, `${r.length} boxes`);
    for (const b of r) {
      expect(b.rows >= 2, `${b.rows} rows in a box`);
      expect(b.seams[0] === false && b.seams.slice(1).every(Boolean), `seams ${JSON.stringify(b.seams)} (none above the first row, one above each next)`);
      expect(b.minH >= 43.5, `row height ${b.minH}`);
    }
    return `${r.length} boxes, seams between rows only, rows ≥ 44px`;
  });
  await check('SettingsLayout', 'the part sits at the end of its name when wide and drops under it when narrow, keeping its size', async () => {
    await go('/components/settings-layout/code');
    const read = (i) => main().locator('[data-component="SettingsLayout"]').nth(i).evaluate((root) => {
      const row = root.querySelector('[data-component="SettingsRow"]');
      const t = row.querySelector(':scope > div:not([role])').getBoundingClientRect();
      const c = row.querySelector('[role="switch"]').getBoundingClientRect();
      const rtl = getComputedStyle(root).direction === 'rtl';
      return { tx: t.left, tr: t.right, tb: t.bottom, cx: c.left, cr: c.right, ct: c.top, cw: c.width, ch: c.height, rtl };
    });
    const wide = await read(0); const narrow = await read(1);
    expect(!wide.rtl && wide.cx >= wide.tr - 1, `wide: part at ${wide.cx}, name ends at ${wide.tr}`);
    expect(narrow.ct >= narrow.tb - 1, `narrow: part top ${narrow.ct}, name bottom ${narrow.tb}`);
    expect(Math.abs(wide.cw - narrow.cw) < 1 && Math.abs(wide.ch - narrow.ch) < 1, `part size ${wide.cw}×${wide.ch} vs ${narrow.cw}×${narrow.ch}`);
    return `wide: part beside the name; narrow: part under it; size kept ${Math.round(wide.cw)}×${Math.round(wide.ch)}`;
  });
  await check('SettingsLayout', 'each section box is a flat hairline border, a disabled row fades, and no part is orange', async () => {
    await go('/components/settings-layout/code');
    const r = await main().locator('[data-component="SettingsLayout"]').first().evaluate((root) => {
      const box = root.querySelector('[data-component="SettingsSection"] > [role="list"]');
      const cs = getComputedStyle(box);
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      const bad = [...root.querySelectorAll('*')].filter((n) => !n.closest('[role="switch"]')).filter((n) => { const c = getComputedStyle(n); return accent && [c.backgroundColor, c.color, c.borderColor].includes(accent); }).length;
      const off = root.querySelector('[data-component="SettingsRow"][data-disabled] > div:not([role])');
      return { w: parseFloat(cs.borderTopWidth), style: cs.borderTopStyle, shadow: cs.boxShadow, bg: cs.backgroundColor, bad, off: off ? parseFloat(getComputedStyle(off).opacity) : null };
    });
    expect(r.w > 0 && r.style === 'solid', `border ${r.w}px ${r.style}`);
    expect(r.shadow === 'none' && r.bg === 'rgba(0, 0, 0, 0)', `shadow ${r.shadow}, background ${r.bg}`);
    expect(r.off !== null && r.off < 1, `disabled row opacity ${r.off}`);
    expect(r.bad === 0, `${r.bad} orange parts`);
    return `${r.w}px solid flat box, disabled row at ${r.off}, no orange`;
  });
}
