// Behaviour checks for NotificationCenter (notifications by day, lamp for unread), run by tooling/kiln/conformance.mjs.
// The Usage subject is a center with four lines: washer and night (Today, unread), door (Yesterday, read) and filter (Yesterday, unread).
// UNVERIFIED: the live-region announcement of a line that arrives after mount (needs a page that adds a line; the Arrivals example does, but conformance does not drive it).
export default async function notificationCenter({ page, check, expect, go, main }) {
  const root = () => main().locator('[data-component="NotificationCenter"]').first();
  const load = async () => { await go('/components/notification-center/code'); await root().waitFor(); };
  const line = (id) => root().locator(`li[data-notification-id="${id}"]`);

  await check('NotificationCenter', 'unread and read lines differ by lamp shape and title weight, not only by colour', async () => {
    await load();
    const r = await root().evaluate((el) => {
      const probe = document.createElement('span'); probe.style.color = 'var(--ds-action-accent)'; document.body.append(probe);
      const accent = getComputedStyle(probe).color; probe.remove();
      return [...el.querySelectorAll('li[data-component="NotificationItem"]')].map((li) => {
        const lamp = li.querySelector('[class*="lamp"]'); const head = li.querySelector('[class*="heading"]');
        const lc = getComputedStyle(lamp); const hc = getComputedStyle(head);
        return {
          unread: li.hasAttribute('data-unread'), fill: lc.backgroundColor, w: lamp.getBoundingClientRect().width,
          weight: Number(hc.fontWeight), border: parseFloat(lc.borderTopWidth),
          orange: [lc.backgroundColor, lc.borderTopColor, hc.color].includes(accent),
          said: /Unread/.test(li.textContent ?? ''),
        };
      });
    });
    const un = r.filter((x) => x.unread); const rd = r.filter((x) => !x.unread);
    expect(un.length >= 2 && rd.length >= 1, `${un.length} unread, ${rd.length} read`);
    expect(un.every((x) => x.fill !== 'rgba(0, 0, 0, 0)') && rd.every((x) => x.fill === 'rgba(0, 0, 0, 0)'), `lamp fills ${r.map((x) => x.fill).join(' | ')}`);
    expect(rd.every((x) => x.border > 0) && r.every((x) => x.w > 0), 'a read lamp keeps a real ring border');
    expect(un.every((x) => x.weight > rd[0].weight), `weights unread ${un.map((x) => x.weight)} read ${rd.map((x) => x.weight)}`);
    expect(un.every((x) => x.said) && rd.every((x) => !x.said), 'the word Unread is read before unread titles only');
    expect(r.every((x) => !x.orange), 'no orange on a lamp or a title');
    return `${un.length} unread (filled, medium), ${rd.length} read (ring, regular)`;
  });

  await check('NotificationCenter', 'mark as read toggles one line and the count, Mark all read clears the rest and keeps focus', async () => {
    await load();
    const keys = await root().locator('[data-part="mark-read"], [data-part="dismiss"]').evaluateAll((bs) => bs.map((b) => ({ w: b.getBoundingClientRect().width, h: b.getBoundingClientRect().height, name: b.getAttribute('aria-label') })));
    expect(keys.length >= 8 && keys.every((k) => k.w >= 43.5 && k.h >= 43.5), `keys ${keys.map((k) => `${Math.round(k.w)}x${Math.round(k.h)}`).join(', ')}`);
    expect(new Set(keys.map((k) => k.name)).size === keys.length, 'every key has its own name');
    const count = () => root().locator('[data-component="Badge"]').first().textContent();
    expect(/3/.test((await count()) ?? ''), `count ${await count()}`);
    const first = line('washer').locator('[data-part="mark-read"]');
    expect((await first.getAttribute('aria-pressed')) === 'false', 'unread: key not pressed');
    await first.click();
    await page.waitForTimeout(300);
    expect((await first.getAttribute('aria-pressed')) === 'true' && (await line('washer').getAttribute('data-unread')) === null, 'read: key pressed, line no longer unread');
    expect(/2/.test((await count()) ?? ''), `count after one ${await count()}`);
    await first.click();
    await page.waitForTimeout(300);
    expect((await line('washer').getAttribute('data-unread')) !== null, 'pressing again makes it unread');
    const all = root().locator('[data-part="mark-all"]');
    await all.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    const after = await root().evaluate((el) => ({
      unread: el.querySelectorAll('li[data-unread]').length, badge: el.querySelectorAll('[data-component="Badge"]').length,
      disabled: el.querySelector('[data-part="mark-all"]').getAttribute('aria-disabled'), focus: document.activeElement?.getAttribute('data-part'),
    }));
    expect(after.unread === 0 && after.badge === 0, `${after.unread} unread, ${after.badge} badges`);
    expect(after.disabled === 'true' && after.focus === 'mark-all', `aria-disabled ${after.disabled}, focus on ${after.focus}`);
    return 'toggle, count and Mark all read hold';
  });

  await check('NotificationCenter', 'dismiss moves focus to the next line, drops an emptied day and ends on the empty state with the heading focused', async () => {
    await load();
    const days = () => root().evaluate((el) => [...el.querySelectorAll('[data-part="group"]')].map((g) => g.firstElementChild?.textContent));
    expect((await days()).join(',') === 'Today,Yesterday', `days ${await days()}`);
    await line('washer').locator('[data-part="dismiss"]').focus();
    await page.keyboard.press('Space');
    const during = await root().evaluate((el) => document.activeElement?.closest('li')?.getAttribute('data-notification-id'));
    expect(during === 'night', `focus moved to ${during}`);
    await page.waitForTimeout(700);
    expect((await line('washer').count()) === 0, 'the dismissed line is gone');
    await line('night').locator('[data-part="dismiss"]').press('Enter');
    await page.waitForTimeout(700);
    expect((await days()).join(',') === 'Yesterday', `days after Today emptied ${await days()}`);
    for (const id of ['door', 'filter']) {
      await line(id).locator('[data-part="dismiss"]').click();
      await page.waitForTimeout(700);
    }
    const end = await root().evaluate((el) => ({
      lines: el.querySelectorAll('li[data-component="NotificationItem"]').length, empty: !!el.querySelector('[data-component="EmptyState"]'),
      focus: document.activeElement?.getAttribute('data-part'),
    }));
    expect(end.lines === 0 && end.empty, `${end.lines} lines, empty state ${end.empty}`);
    expect(end.focus === 'title', `focus on ${end.focus}`);
    return 'focus walks, emptied days drop, empty state shows';
  });

  await check('NotificationCenter', 'a polite status region exists and the center is a labelled section with day headings', async () => {
    await load();
    const r = await root().evaluate((el) => {
      const live = el.querySelector('[role="status"]');
      const name = document.getElementById(el.getAttribute('aria-labelledby') ?? '');
      return {
        polite: live?.getAttribute('aria-live'), text: live?.textContent ?? '', tag: el.tagName, name: name?.textContent,
        h: name?.tagName, days: [...el.querySelectorAll('[data-part="group"] > :first-child')].map((d) => d.tagName),
        lists: el.querySelectorAll('ul[aria-label]').length,
      };
    });
    expect(r.polite === 'polite' && r.text === '', `live ${r.polite} text "${r.text}"`);
    expect(r.tag === 'SECTION' && r.name === 'Notifications' && r.h === 'H2', `${r.tag} named ${r.name} (${r.h})`);
    expect(r.days.length === 2 && r.days.every((t) => t === 'H3') && r.lists === 2, `days ${r.days}, lists ${r.lists}`);
    return 'status region polite and empty at rest, section named, two H3 days';
  });
}
