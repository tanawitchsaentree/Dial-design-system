// Usage tab for PullToRefresh (component-depth.md U1–U14). A list that asks the hub for fresh readings.
import { Card, List, Progress, PullToRefresh, Stack } from 'dial-react';
import type { Depth } from './types';

const ask = () => new Promise((done) => setTimeout(done, 1200));
const at = (h: number, m: number) => new Date(2026, 10, 2, h, m);
const Box = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', maxInlineSize: '100%' }}>{children}</div>;
const rows = (
  <List label="Readings">
    <List.Item label="Kitchen" description="21.5 °C · 44 %" />
    <List.Item label="Bedroom" description="19.0 °C · 51 %" />
  </List>
);

export const PULL_TO_REFRESH: Depth = {
  overview: (
    <>
      <p>PullToRefresh wraps a list whose rows come from the hub, such as the readings of every sensor in the house. Pulling the list down at its very top reveals a short printed ruler. An ink index rides down it with the finger, and at the heavier tick at its foot the word changes to Release to refresh. Let go there and the list settles one detent down on the spring, a still Working reading appears in the band, and the hub is asked again.</p>
      <p>The gesture is never the only way in. A round refresh key sits in the bar above the list in every state, so a mouse, a keyboard or a switch reaches the same refresh. The time of the readings is printed beside the key, and when it changes a screen reader hears Updated 10:42 without losing its place.</p>
      <p>Nothing spins. While the hub works the band shows the same still row of ink ticks that Progress shows when it cannot tell how long a task will take, because nothing in dial moves while it waits.</p>
    </>
  ),
  whenToUse: [
    'On a phone, for a list of readings that the hub sends on request, such as sensors, energy or devices.',
    'When people expect to check for news by pulling, as in a list of events or alerts.',
    'For one list per screen, at the top of that screen.',
  ],
  whenNot: [
    { situation: 'Readings that the hub pushes by itself as they change', to: '/components/display', label: 'Display' },
    { situation: 'A long task with a known end, such as a firmware update', to: '/components/progress', label: 'Progress' },
    { situation: 'A list that is still loading for the first time', to: '/components/skeleton', label: 'Skeleton' },
  ],
  variants: { na: 'PullToRefresh has one look, a printed ruler with one detent and a refresh key in the bar. Its options are covered under Modifiers.' },
  anatomy: {
    render: <Box><PullToRefresh label="Readings" onRefresh={ask} updated={at(10, 41)}>{rows}</PullToRefresh></Box>,
    parts: [
      { part: 'Name', selector: '[data-component="PullToRefresh"] > div:first-child > span:first-child', what: 'The name of the list, printed at the start of the bar. It names the list region too.' },
      { part: 'Time', selector: '[data-component="PullToRefresh"] [role="status"]', what: 'The time of the readings with tabular figures. It is a polite status line, so a new time is spoken.' },
      { part: 'Refresh key', selector: '[data-component="PullToRefresh"] [data-component="IconButton"]', what: 'A 44px round key that asks the hub with no gesture.' },
      { part: 'Band', selector: '[data-component="PullToRefresh"] [role="region"] > div:first-child', what: 'Printing revealed above the list by the pull. It holds the ruler and the word, and the Working reading later.' },
      { part: 'List', selector: '[data-component="PullToRefresh"] [role="region"] > div:last-child', what: 'Your rows. They move down with the pull as one piece and come back to the same place.' },
    ],
  },
  sizes: { na: 'PullToRefresh takes the width of its column. The detent is one and a half touch modules, 66px, at every size, so the pull feels the same on every screen.' },
  emphasis: {
    text: <p>The refresh key is a plain body coloured key. The orange stays with the one primary control of the screen, and a refresh is never that control. Use one PullToRefresh per screen, on the list that scrolls the page.</p>,
    pair: {
      do: <Box><PullToRefresh label="Readings" onRefresh={ask} updated={at(10, 41)}>{rows}</PullToRefresh></Box>,
      doNote: 'One list, one refresh key, one time.',
      dont: <Box><Stack gap="md"><PullToRefresh label="Lamps" onRefresh={ask} updated={at(10, 41)}><List label="Lamps"><List.Item label="Hall" description="On" /></List></PullToRefresh><PullToRefresh label="Sensors" onRefresh={ask} updated={at(10, 39)}><List label="Sensors"><List.Item label="Garden" description="12 %" /></List></PullToRefresh></Stack></Box>,
      dontNote: 'Two lists that each refresh on their own, with two times to compare.',
    },
  },
  placement: {
    rows: [['At the top of a phone screen', 'The list of devices or readings that fills the screen.'], ['Inside a unit', 'A list printed on one plastic body, with the bar on the inset line.']],
    examples: [{ title: 'Inside a unit', render: <Card style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', maxInlineSize: '100%' }}><PullToRefresh label="Living room" onRefresh={ask} updated={at(10, 38)}><List label="Living room"><List.Item label="Floor lamp" description="On · 60%" /><List.Item label="Speaker" description="Paused" /></List></PullToRefresh></Card> }],
  },
  combinations: {
    good: [['PullToRefresh + List', 'The rows are a List; the pull and the key ask for new rows.'], ['PullToRefresh + Banner', 'A Banner above the list says the hub is offline for longer than one try.']],
    avoid: [
      { title: 'a refresh for a task', why: 'A firmware update has a known end and its own progress. Show it with Progress and let it run.', render: <Box><Progress label="Firmware update" value={40} valueText="4 min left" /></Box> },
      { title: 'a refresh with no key', why: 'A bare list with only the gesture leaves keyboard and mouse users with no way to refresh. PullToRefresh always prints its key.', render: <Box><List label="Readings"><List.Item label="Kitchen" description="21.5 °C" /></List></Box> },
    ],
  },
  content: {
    formula: <p>Name the list in one or two words, as in <em>Readings</em> or <em>Living room</em>. Keep the defaults for the words on the ruler. Set <code>messages</code> for another language, and give the key a name that says what it refreshes when the bar holds more than one list name.</p>,
    pair: {
      do: <Box><PullToRefresh label="Readings" onRefresh={ask} updated={at(10, 41)}>{rows}</PullToRefresh></Box>, doNote: 'A short name and the time of the readings.',
      dont: <Box><PullToRefresh label="All of the latest readings from your sensors" onRefresh={ask}>{rows}</PullToRefresh></Box>, dontNote: 'A sentence for a name, and no time, so nobody knows how old the rows are.',
    },
    overflow: { text: 'A long name wraps in the bar, and the time and the key stay at the end of the line.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><PullToRefresh label="Sensors in the garden shed" onRefresh={ask} updated={at(10, 41)}>{rows}</PullToRefresh></div> },
    rtl: { text: 'In right to left languages the bar mirrors. The name starts on the right and the ruler sits at the right edge of the band.', render: <Box><div dir="rtl"><PullToRefresh label="القراءات" onRefresh={ask} updated={at(10, 41)} messages={{ pull: 'اسحب للتحديث', release: 'اترك للتحديث', updated: 'حُدّث', refresh: 'تحديث' }}>{rows}</PullToRefresh></div></Box> },
    expansion: { text: 'German words run about 30% longer. The ruler word stays on one line in the band and the bar wraps the name.', render: <Box><PullToRefresh label="Messwerte" onRefresh={ask} updated={at(10, 41)} messages={{ pull: 'Zum Aktualisieren ziehen', release: 'Loslassen zum Aktualisieren', updated: 'Aktualisiert', refresh: 'Aktualisieren' }}>{rows}</PullToRefresh></Box> },
  },
  behaviours: {
    states: [
      ['Idle', 'The bar prints the name, the time and the key. The band is closed.', 'The list scrolls as any list does.'],
      ['Pulling', 'The band opens with the finger and the index rides down the ruler beside Pull to refresh.', 'The list moves half as far as the finger.'],
      ['Past the detent', 'The index sits in the detent and the word reads Release to refresh in medium weight.', 'Letting go here refreshes. Pushing back up cancels.'],
      ['Working', 'The band holds one detent tall with still ink ticks and Asking the hub.', 'The key ignores presses and the list still scrolls.'],
      ['Updated', 'The band closes on the spring and the time changes.', 'The status line speaks Updated 10:42.'],
      ['Failed', 'The band closes and the status line says the hub did not answer.', 'The rows stay as they were. Press the key to try again.'],
    ],
    interactions: [
      ['Touch', 'Pull down at the top', 'Past the detent and released, the hub is asked. Short of it the list returns to the top.', 'touchmove, prevented only while pulling'],
      ['Touch', 'Any other drag', 'Scrolls the list natively. The pull never starts in the middle of a list or on an upward drag.', 'passive touchstart'],
      ['Keyboard', 'Tab, then Enter or Space', 'Reaches the refresh key and asks the hub.', 'button'],
      ['Pointer', 'Click the key', 'Asks the hub. A mouse never has to drag the list.', 'click'],
      ['Screen reader', 'Read', 'Hears Asking the hub, then Updated with the time, from a polite status line.', 'role status, aria-busy'],
    ],
    loading: <p>Working is the loading state. It is the still row of ticks from Progress, named by the list and reading Working, held in the band while the rows stay readable under it. With reduce motion the band opens and closes at once, with no throw and no settle.</p>,
    focus: <p>Focus stays where it is during a refresh. The refresh key keeps focus while it works and only ignores presses, so keyboard users never lose their place. A frame of a set height, or one whose list runs past it, is a Tab stop of its own, so the arrow and Page keys scroll it; it shows the focus ring inside its edge.</p>,
  },
  deepDive: { na: 'PullToRefresh has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'updated',
      rules: <p>The time the readings were taken. Pass the time the hub reports, so the bar never claims the rows are newer than they are. A refresh that succeeds then prints the time it ended.</p>,
      pair: { do: <Box><PullToRefresh label="Readings" onRefresh={ask} updated={at(10, 41)}>{rows}</PullToRefresh></Box>, doNote: 'The time of the last readings is printed.', dont: <Box><PullToRefresh label="Readings" onRefresh={ask}>{rows}</PullToRefresh></Box>, dontNote: 'No time until the first refresh, so the rows have no age.' },
    },
    {
      name: 'height',
      rules: <p>The tallest the list may grow before it scrolls inside its own frame. Leave it out on a phone screen where the page scrolls. The pull then starts only when the page is at its top as well.</p>,
      pair: { do: <Box><PullToRefresh label="All rooms" height={150} onRefresh={ask} updated={at(10, 40)}><List label="All rooms">{['Hall', 'Kitchen', 'Study', 'Garage'].map((r) => <List.Item key={r} label={r} description="20.0 °C" />)}</List></PullToRefresh></Box>, doNote: 'A long list in a short frame scrolls inside it.', dont: <Box><PullToRefresh label="All rooms" height={60} onRefresh={ask} updated={at(10, 40)}>{rows}</PullToRefresh></Box>, dontNote: 'A frame shorter than one row leaves nothing to read.' },
    },
    {
      name: 'refreshing',
      rules: <p>Controls Working from outside, for an app that tracks the refresh itself. Set it true when the request starts and false when it ends, and set <code>updated</code> at the same time.</p>,
      pair: { do: <Box><PullToRefresh label="Energy" onRefresh={() => undefined} refreshing updated={at(10, 30)}><List label="Energy"><List.Item label="House" description="1.8 kW now" /></List></PullToRefresh></Box>, doNote: 'The app says Working while its request runs.', dont: <Box><PullToRefresh label="Energy" onRefresh={() => undefined} refreshing={false} updated={at(10, 30)}><List label="Energy"><List.Item label="House" description="1.8 kW now" /></List></PullToRefresh></Box>, dontNote: 'refreshing left false while the request runs, so nobody sees that it is working.' },
    },
  ],
  related: [['/components/list', 'List', 'The rows inside.'], ['/components/progress', 'Progress', 'The still Working reading.'], ['/components/slider', 'Slider', 'The ruler and the spring.']],
  references: [
    { title: 'WAI-ARIA 1.2 · status role', url: 'https://www.w3.org/TR/wai-aria-1.2/#status', why: 'How the time of the readings is spoken without moving focus.' },
    { title: 'WCAG 2.2 · 2.5.1 Pointer Gestures', url: 'https://www.w3.org/WAI/WCAG22/Understanding/pointer-gestures.html', why: 'Why a path gesture needs a single pointer alternative, the refresh key.' },
    { title: 'WCAG 2.2 · 2.3.3 Animation from Interactions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html', why: 'Why the list lands at once under reduce motion.' },
  ],
};
