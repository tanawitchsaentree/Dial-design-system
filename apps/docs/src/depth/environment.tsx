// Usage tab for Environment (component-depth.md U1–U14). One room's air on one plastic unit.
import { Badge, Card, DeviceCard, Environment, Stack } from 'dial-react';
import type { Depth } from './types';

const AIR = [{ kind: 'humidity', value: 38 }, { kind: 'air', value: 74 }] as const;

export const ENVIRONMENT: Depth = {
  overview: (
    <>
      <p>Environment shows the air in one room at a glance. It is a small appliance on the screen. The temperature sits in an LCD window at the top, and the other levels of the room are printed meters under it, each naming its region with a glyph and a word, such as Dry, Fair or Stuffy. An optional grille shows activity, such as sound in a nursery.</p>
      <p>The room name is printed at the bottom left of the case where a wordmark goes, and the time of the reading at the bottom right where the model name goes. The unit only reads, so it has no control and nothing on it is orange.</p>
      <p>A sensor can be late or stop answering. Environment keeps the last readings in their places and says so in words on a line under the window, with a warning or a critical glyph and the time of the last reading.</p>
    </>
  ),
  whenToUse: [
    'For the climate of one room, on a dashboard or a room screen.',
    'When temperature is the main reading and two to four other levels sit around it.',
    'On a screen that compares rooms, one unit per room.',
  ],
  whenNot: [
    { situation: 'A device that you set, such as a thermostat or a purifier', to: '/components/device-card', label: 'DeviceCard' },
    { situation: 'One level on its own, such as a battery', to: '/components/meter', label: 'Meter' },
    { situation: 'A list of many sensors with one value each', to: '/components/list', label: 'List' },
  ],
  variants: { na: 'Environment has one layout, anchor A with the window on top. The window family, the readings and the status are options, covered under Modifiers.' },
  anatomy: {
    render: <Environment room="Living room" temperature={21.5} detail="Feels dry" readAt="10:42" readings={[...AIR]} activity={{ label: 'Sound', value: 2, max: 6, valueText: 'quiet' }} />,
    parts: [
      { part: 'Window', selector: '[data-component="Environment"] [data-component="Display"]', what: 'The temperature on an LCD window, a polite status region, with one line of detail.' },
      { part: 'Notice', selector: '[data-component="Environment"] p[role="status"]', what: 'The state of the sensor as a Badge glyph and words. The line is kept in every state.' },
      { part: 'Meters', selector: '[data-component="Environment"] [data-component="Meter"]', what: 'One Meter per level, with its range, regions and unit filled in by its kind.' },
      { part: 'Activity', selector: '[data-component="Environment"] [data-component="Grille"]', what: 'An optional grille for activity, with its caption printed at the start of the row.' },
      { part: 'Room', selector: '[data-component="Environment"] > div:last-child > span:first-child', what: 'The room name, printed bottom left in the wordmark place.' },
      { part: 'Time', selector: '[data-component="Environment"] > div:last-child > span:last-child', what: 'The time of the reading, printed bottom right in the model name place.' },
    ],
  },
  sizes: { na: 'Environment has one size, eight touch modules wide like anchor A, and it never grows wider than its column.' },
  emphasis: {
    text: <p>The window is the one loud part of the unit. Keep the detail line short and put no more than four meters under it, so the temperature stays the first thing read.</p>,
    pair: {
      do: <Environment room="Living room" temperature={21.5} detail="Feels dry" readAt="10:42" readings={[...AIR]} />,
      doNote: 'One window and two meters.',
      dont: <Environment room="Living room" temperature={21.5} detail="Humidity 38 %, air fair, CO2 1180" readAt="10:42" readings={[{ kind: 'humidity', value: 38 }, { kind: 'air', value: 74 }, { kind: 'co2', value: 1180 }, { kind: 'noise', value: 40 }, { kind: 'humidity', value: 40, label: 'Humidity outside' }]} />,
      dontNote: 'The detail repeats the meters, and five meters bury the window.',
    },
  },
  placement: {
    rows: [['A room screen', 'One unit for the room the person stands in.'], ['A house dashboard', 'One unit per room, side by side, each with its own time.']],
    examples: [{ title: 'Two rooms', render: <Stack gap="lg"><Environment room="Kitchen" temperature={22.0} readAt="10:42" readings={[{ kind: 'air', value: 112 }]} /><Environment room="Bathroom" temperature={23.5} readAt="10:41" readings={[{ kind: 'humidity', value: 71 }]} /></Stack> }],
  },
  combinations: {
    good: [['Environment + DeviceCard', 'The room reads its air, the purifier beside it is the device you set.'], ['Environment + PullToRefresh', 'A list of rooms that asks the hub for fresh readings.']],
    avoid: [
      { title: 'a control inside the unit', why: 'Environment only reads. A thermostat knob belongs on a DeviceCard, which has the one orange control.', render: <DeviceCard model="thermostat 1" display={{ label: 'Thermostat', value: '21.5', unit: '°C', detail: 'Heating to 22', digits: 3 }} primary={{ label: 'Heat' }} /> },
      { title: 'a coloured pill for the air', why: 'A green or red pill says the state with colour alone. The meter says it with a glyph and a word.', render: <Card><Badge tone="positive">Good</Badge></Card> },
    ],
  },
  content: {
    formula: <p>Name the room as people say it at home, as in <em>Living room</em> or <em>Nursery</em>. Keep the detail to a few words that the meters do not say, such as <em>Window open</em>. Pass the time the sensor took the reading, so a late reading shows its age.</p>,
    pair: {
      do: <Environment room="Nursery" temperature={20.0} detail="Window open" readAt="02:14" readings={[{ kind: 'humidity', value: 47 }]} />, doNote: 'A room name and a detail the meters cannot say.',
      dont: <Environment room="Sensor 3" temperature={20.0} detail="20 degrees" readAt="02:14" readings={[{ kind: 'humidity', value: 47 }]} />, dontNote: 'A device number for a name, and a detail that repeats the window.',
    },
    overflow: { text: 'A long room name wraps at the foot of the case and the time stays at the end of the line.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}><Environment room="Guest room above the garage" temperature={18.5} readAt="10:42" readings={[{ kind: 'humidity', value: 55 }]} /></div> },
    rtl: { text: 'In right to left languages the unit mirrors. The room is printed bottom right and the time bottom left, and the meters start on the right.', render: <div dir="rtl"><Environment room="غرفة المعيشة" temperature={21.5} readAt="10:42" statusText="محدّث" readings={[{ kind: 'humidity', value: 38, label: 'الرطوبة', regionLabels: { low: 'جاف', mid: 'مريح', high: 'رطب' } }]} /></div> },
    expansion: { text: 'German words run about 30% longer. The meter labels wrap and the window keeps its size.', render: <Environment room="Wohnzimmer" temperature={21.5} detail="Fenster geöffnet" readAt="10:42" statusText="Aktuell" readings={[{ kind: 'humidity', value: 38, label: 'Luftfeuchtigkeit', regionLabels: { low: 'Trocken', mid: 'Angenehm', high: 'Feucht' } }]} /> },
  },
  behaviours: {
    states: [
      ['Live', 'The notice reads Up to date with the positive glyph.', 'A new reading changes the window at once and is spoken politely.'],
      ['Late', 'The notice turns to the warning glyph and No new reading since 10:17.', 'Every reading stays in place at full contrast.'],
      ['Not answering', 'The window detail reads Not answering and the notice the critical glyph with the time of the last reading.', 'The last readings stay, so the person still sees what the room was like.'],
    ],
    interactions: [
      ['Keyboard', 'None', 'Environment only reads, so nothing on it takes focus.', 'no tabindex'],
      ['Pointer', 'None', 'Pressing the unit does nothing.', 'no handler'],
      ['Screen reader', 'Read', 'The unit is a region named by the room. The window and the notice are polite status lines, and every meter is named.', 'section, role status, role meter'],
    ],
    loading: <p>Until the first reading arrives, show a Skeleton of the display kind in the place of the unit. Never show a temperature nobody measured.</p>,
    focus: <p>Environment never takes focus. Screen readers reach it in reading order, starting with the room name.</p>,
  },
  deepDive: { na: 'Environment has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'readings',
      rules: <p>The levels read under the window, in order. Each <code>kind</code> fills in a range, regions and a unit. Humidity reads Dry, Comfort and Damp, air quality Clean, Fair and Poor, CO2 Fresh, Stale and Stuffy, and noise Quiet, Normal and Loud. Any Meter prop overrides them.</p>,
      pair: { do: <Environment room="Study" temperature={22.5} readAt="23:05" readings={[{ kind: 'co2', value: 1320 }]} />, doNote: 'CO2 high, so the meter reads Stuffy.', dont: <Environment room="Study" temperature={22.5} readAt="23:05" readings={[{ kind: 'co2', value: 1320, low: undefined, high: undefined }]} />, dontNote: 'Regions removed, so 1320 ppm has no meaning for most people.' },
    },
    {
      name: 'status',
      rules: <p><code>stale</code> when the sensor is late, <code>offline</code> when it has stopped answering. Pass the time of the last reading in <code>readAt</code>; the words name it. Set <code>statusText</code> for other words.</p>,
      pair: { do: <Environment room="Garage" temperature={8.5} readAt="09:58" status="offline" readings={[{ kind: 'humidity', value: 66 }]} />, doNote: 'Not answering, in words, with the time.', dont: <Environment room="Garage" temperature={8.5} readAt="09:58" readings={[{ kind: 'humidity', value: 66 }]} />, dontNote: 'An old reading shown as up to date.' },
    },
    {
      name: 'activity',
      rules: <p>A grille for activity in the room, such as sound or a fan. Give it a <code>label</code> and a <code>valueText</code>; both are printed beside it and spoken.</p>,
      pair: { do: <Environment room="Nursery" temperature={20.0} readAt="02:14" activity={{ label: 'Sound', value: 2, max: 6, valueText: 'quiet' }} />, doNote: 'Sound, quiet, beside its holes.', dont: <Environment room="Nursery" temperature={20.0} readAt="02:14" activity={{ label: 'Sound', value: 2, max: 6 }} />, dontNote: 'No words for the holes, so the level is a guess.' },
    },
  ],
  related: [['/components/device-card', 'DeviceCard', 'A device you set.'], ['/components/meter', 'Meter', 'One level.'], ['/components/display', 'Display', 'The window.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Meter pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/meter/', why: 'How each level is named and read.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the air is a glyph and a word, never a coloured pill.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why the window and the notice are polite status lines.' },
  ],
};
