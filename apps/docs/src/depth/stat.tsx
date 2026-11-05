// Usage tab for Stat (component-depth.md U1–U14). Stat is one named figure read as a window.
import { Display, Grid, GridItem, Stack, Stat } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const basic = <Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" />;

export const STAT: Depth = {
  overview: (
    <>
      <p>Stat shows one figure with its name, such as energy used today or the humidity in a room. The number and its unit sit alone in a small window cut into the body. The name is printed above the window.</p>
      <p>When a figure has moved, a change line under the window says by how much. The direction is a glyph and a word, never a green or a red. It is a reading, not a control, so nothing in it is orange.</p>
    </>
  ),
  whenToUse: ['To show one named figure, such as energy today, with its unit.', 'To put two or three readings side by side in a unit.', 'To say that a figure went up or down since a point in time.'],
  whenNot: [
    { situation: 'The state the whole unit is about, announced as it changes', to: '/components/display', label: 'Display' },
    { situation: 'A level in a known range with low and high regions', to: '/components/meter', label: 'Meter' },
    { situation: 'A number inside a sentence or a list row', to: '/components/text', label: 'Text' },
  ],
  variants: { na: 'Stat has one look, a name over a window over a change. The size and the direction of the change are props, covered under Sizes and Modifiers.' },
  anatomy: {
    render: basic,
    parts: [
      { part: 'Name', selector: '[data-component="Stat"] > span:first-child', what: 'The figure’s name at caption size, on the inset line above the window.' },
      { part: 'Window', selector: '[data-component="Stat"] > span:nth-child(2)', what: 'A recess in the body that holds the figure and its unit.' },
      { part: 'Unit', selector: '[data-component="Stat"] > span:nth-child(2) span span', what: 'The unit at label size, beside the number, in secondary ink.' },
      { part: 'Change', selector: '[data-component="Stat"] > span:last-child', what: 'A glyph, a word, the amount and what it is measured against.' },
    ],
  },
  sizes: {
    sm: { use: 'The figure at emphasis size. Several Stats in a row or a narrow unit.', pairs: 'Other Stats of the same size, and 44px keys.' },
    md: { use: 'The figure at title size. The usual size for a Stat on its own in a unit.', pairs: 'A Card or a DeviceCard body.' },
    lg: { use: 'The figure at display size. The one number a whole sheet is about.', pairs: 'A heading and one change line.' },
  },
  emphasis: {
    text: <p>A Stat is never louder than its neighbours: the window is the same recess in every size. Keep the orange key out of it. If a figure needs to stand out, make it <code>lg</code> and give it more room.</p>,
    pair: { do: <Stat size="lg" label="Energy today" value="12.4" unit="kWh" />, doNote: 'One large figure gets the room.', dont: <Unit><Stack gap="md"><Stat size="lg" label="Energy" value="12.4" unit="kWh" /><Stat size="lg" label="Water" value="182" unit="L" /><Stat size="lg" label="Gas" value="3.1" unit="m³" /></Stack></Unit>, dontNote: 'Three large figures compete and none of them leads.' },
  },
  placement: {
    rows: [['In a unit body, in a row of two or three', 'Each Stat is its own window, with equal columns.'], ['At the top of a sheet', 'One large Stat with its change line.']],
    examples: [{ title: 'Three readings in a row', render: <Unit><Grid columns={3} className="demo-full"><GridItem span={1}><Stat size="sm" label="Indoor" value="21.5" unit="°C" /></GridItem><GridItem span={1}><Stat size="sm" label="Humidity" value="48" unit="%" /></GridItem><GridItem span={1}><Stat size="sm" label="CO₂" value="640" unit="ppm" /></GridItem></Grid></Unit> }],
  },
  combinations: {
    good: [['Stat + Stat', 'A row of the same size shares one baseline for the windows.'], ['Stat + Button', 'The orange key sits apart from the readings, under them.']],
    avoid: [{ title: 'a Stat beside a Display for the same figure', why: 'Two windows say the same thing. Keep the Display and drop the Stat, or print a different figure in each.', render: <Unit><Stack gap="md"><Display label="Thermostat" value="21.5" unit="°C" digits={3} /><Stat label="Indoor" value="21.5" unit="°C" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the figure with a noun and a time, as in <em>Energy today</em>. Put the number in <code>value</code> and the unit in <code>unit</code>. Write the change as an amount in the same unit and say what it is measured against in <code>compare</code>.</p>,
    pair: {
      do: <Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" />, doNote: 'The unit is its own prop and the comparison is named.',
      dont: <Stat label="Energy today: 12.4 kWh" value="12.4 kWh" change="+0.8" trend="up" />, dontNote: 'The figure is written twice and the change has no unit or reference.',
    },
    overflow: { text: 'A long name wraps above the window. A long figure breaks inside the window and the window grows with it.', render: <Stat label="Total energy used by the heating and hot water systems this billing period" value="12 408.5" unit="kWh" /> },
    rtl: { text: 'In right-to-left languages the name, the figure and the change start on the right. The digits stay in their own order.', render: <div dir="rtl"><Stat label="الطاقة اليوم" value="12.4" unit="kWh" change="0.8" trend="up" compare="منذ أمس" /></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They wrap above the window and the window does not move.', render: <Stat label="Energieverbrauch des gesamten Hauses heute" value="12,4" unit="kWh" change="0,8 kWh" trend="down" compare="gegenüber gestern" /> },
  },
  behaviours: {
    states: [
      ['Reading', 'The figure in primary ink, the unit in secondary ink.', 'Read as a group with the name, the figure and the unit.'],
      ['No reading', 'A dash in secondary ink in the same window.', 'Announced as No reading.'],
      ['With change', 'A glyph, a word and the amount under the window.', 'The word is read before the amount, for example Up 0.8 kWh.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Does not stop on a Stat. It is not a control.', 'none'],
      ['Screen reader', 'Read', 'A labelled group by default. With live, a polite status that reads the whole reading when it changes.', 'group, status'],
    ],
    loading: <p>Stat has no loading state of its own. While the value is unknown, pass <code>value={'{null}'}</code> and the window prints a dash.</p>,
    focus: <p>A Stat takes no focus. Put the control that changes the figure next to it, not inside it.</p>,
  },
  deepDive: { na: 'Stat has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'trend',
      rules: <p><code>up</code>, <code>down</code> and <code>flat</code> choose the glyph and the word. Good and bad are not told: a rise in energy used and a rise in energy made look the same. Say which it is in the name or in <code>compare</code>.</p>,
      pair: { do: <Stat label="Solar today" value="6.0" unit="kWh" change="0.4 kWh" trend="up" compare="since yesterday" />, doNote: 'The direction is a glyph and a word.', dont: <Stat label="Solar today" value="6.0" unit="kWh" change="0.4 kWh" />, dontNote: 'With no trend the change reads as no change, whatever the amount says.' },
    },
    {
      name: 'live',
      rules: <p>Set <code>live</code> only for a figure that changes while the person watches, such as a power draw. A screen reader then reads the whole reading when it changes. Leave it off for a figure that is set once.</p>,
      pair: { do: <Stat live label="Power now" value="1.2" unit="kW" />, doNote: 'A figure that moves is announced politely.', dont: <Stack gap="md"><Stat live label="Energy today" value="12.4" unit="kWh" /><Stat live label="Water today" value="182" unit="L" /></Stack>, dontNote: 'Every Stat live, so a page of figures talks over itself.' },
    },
  ],
  related: [['/components/display', 'Display', 'The window that says what the unit is doing now.'], ['/components/meter', 'Meter', 'A level on a printed scale with regions.'], ['/components/text', 'Text', 'A number inside a sentence.']],
  references: [
    { title: 'WAI-ARIA · group role', url: 'https://www.w3.org/TR/wai-aria-1.2/#group', why: 'How the name, the figure and the change are read together.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why a change is a glyph and a word and not a green or a red.' },
    { title: 'Carbon Design System · Data visualization · Simple charts', url: 'https://carbondesignsystem.com/data-visualization/simple-charts/', why: 'How other systems print a single key figure.' },
  ],
};
