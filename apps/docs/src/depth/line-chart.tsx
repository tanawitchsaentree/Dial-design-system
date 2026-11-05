// Usage tab for LineChart (component-depth.md U1–U14). LineChart draws one to three lines in a recessed window.
import { Display, LineChart, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const indoor = { label: 'Indoor', values: [20.5, 21, 21.5, 20.8, 21.2, 22, 21.6] };
const outdoor = { label: 'Outdoor', values: [8, 6, 9, 12, 10, 7, 5] };
const target = { label: 'Target', values: [21, 21, 21, 21, 21, 21, 21] };
const basic = <LineChart label="Temperature this week" unit="°C" categories={days} series={[indoor, outdoor]} />;

export const LINE_CHART: Depth = {
  overview: (
    <>
      <p>LineChart shows how one to three readings moved over a run of points, such as indoor and outdoor temperature over a week. The lines sit in a small window cut into the body. Round numbers are printed on its edge.</p>
      <p>The lines are told apart by their stroke and their marks, never by colour. One Tab stop puts a cursor on the chart: the arrow keys walk it from point to point and a line of text under the window says what it is on. The same numbers wait in a table for screen readers.</p>
    </>
  ),
  whenToUse: ['To show how a reading changed across evenly spaced points, such as hours or days.', 'To compare two or three readings in the same unit.', 'To let a person find the value at one point with the keyboard.'],
  whenNot: [
    { situation: 'A trend that sits inside a row or a sentence and needs no axis', to: '/components/sparkline', label: 'Sparkline' },
    { situation: 'One figure with its change since a point in time', to: '/components/stat', label: 'Stat' },
    { situation: 'A level in a known range with regions', to: '/components/meter', label: 'Meter' },
  ],
  variants: { na: 'LineChart has one look, a plot in a recessed window. The window height and the axis are props, covered under Sizes and Modifiers.' },
  anatomy: {
    render: basic,
    parts: [
      { part: 'Name', selector: '[data-component="LineChart"] > span:first-child', what: 'The chart’s name at caption size, on the inset line above the window.' },
      { part: 'Window', selector: '[data-component="LineChart"] > div:nth-of-type(1)', what: 'A recess that holds the plot. It is the one Tab stop and takes the arrow keys.' },
      { part: 'Line', selector: '[data-component="LineChart"] svg polyline', what: 'A two pixel ink line per series, with a hollow mark on every point.' },
      { part: 'Readout', selector: '[data-component="LineChart"] > p[role="status"]', what: 'One printed line that names the point and every value on it.' },
      { part: 'Legend', selector: '[data-component="LineChart"] > ul', what: 'A drawn sample of each line, with its name. It appears from two lines up.' },
    ],
  },
  sizes: {
    sm: { use: 'A low window for a row of readings or a dense unit.', pairs: 'Stat and Meter of the same unit.' },
    md: { use: 'The usual height. Room for five ticks and a readable gap between marks.', pairs: 'A Card or a DeviceCard body.' },
    lg: { use: 'A tall window for the one set of readings a whole sheet is about.', pairs: 'A heading and one Stat.' },
  },
  emphasis: {
    text: <p>A LineChart is never orange and never louder than the unit around it. If one reading matters most, give it the first position, which draws solid, and keep the others to at most two.</p>,
    pair: { do: basic, doNote: 'Two lines in the same unit, told apart by stroke and mark.', dont: <Unit><LineChart label="Everything this week" categories={days} series={[indoor, outdoor, target]} /></Unit>, dontNote: 'A unit that already holds a Stat and a Meter does not also need a third line.' },
  },
  placement: {
    rows: [['In a unit body under a Stat', 'The Stat gives the figure, the chart gives the run that led to it.'], ['At the top of a sheet', 'One large chart with its name above.']],
    examples: [{ title: 'Small chart in a unit', render: <Unit><LineChart size="sm" label="Power today" unit="kW" categories={['06', '09', '12', '15', '18']} series={[{ label: 'Power', values: [0.4, 1.6, 2.2, 1.9, 3.8] }]} /></Unit> }],
  },
  combinations: {
    good: [['LineChart + Stat', 'The Stat states the latest figure and its change; the chart shows how it got there.'], ['LineChart + Button', 'The orange key sits apart from the chart, under it.']],
    avoid: [{ title: 'a LineChart beside a Display for the same figure', why: 'Two windows say the same thing. Keep the Display for the state now and the chart for the run.', render: <Unit><Stack gap="md"><Display label="Thermostat" value="21.6" unit="°C" digits={3} /><LineChart size="sm" label="Thermostat" unit="°C" categories={days} series={[indoor]} /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the chart with a noun and a period, as in <em>Temperature this week</em>. Give every point a short name in <code>categories</code>. Pass the unit in <code>unit</code>, not in the numbers. Name each line with one word.</p>,
    pair: {
      do: <LineChart size="sm" label="Temperature this week" unit="°C" categories={days} series={[indoor, outdoor]} />, doNote: 'Short point names, one-word line names, the unit in its own prop.',
      dont: <LineChart size="sm" label="Chart" categories={['Monday 3 November', 'Tuesday 4 November', 'Wednesday 5 November']} series={[{ label: 'Temperature measured by the sensor in the living room', values: [20, 21, 22] }]} />, dontNote: 'The name says nothing, and the long names crowd the axis and the legend.',
    },
    overflow: { text: 'When the point names do not fit, every second or third one is printed. The cursor still reaches every point and the readout and the table name them all.', render: <LineChart size="sm" label="Readings by hour" categories={['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00']} series={[{ label: 'Power', values: [0.3, 0.3, 0.2, 0.2, 0.3, 0.6, 1.1, 1.8, 1.4, 0.9, 0.7, 0.8] }]} /> },
    rtl: { text: 'In right-to-left languages the name, the readout and the legend start on the right. The plot keeps its numbers left to right like a ruler, so the arrow keys keep their screen direction.', render: <div dir="rtl"><LineChart size="sm" label="الحرارة هذا الأسبوع" categories={days} series={[indoor, outdoor]} /></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. The legend wraps onto a second row and the window does not move.', render: <LineChart size="sm" label="Temperatur in dieser Woche" unit="°C" categories={days} series={[{ label: 'Wohnzimmer innen', values: indoor.values }, { label: 'Außentemperatur', values: outdoor.values }, { label: 'Zieltemperatur', values: target.values }]} /> },
  },
  behaviours: {
    states: [
      ['Idle', 'No cursor. The readout prints how to use the keys in secondary ink.', 'The hint is read as part of the chart’s description.'],
      ['Cursor on a point', 'A vertical hairline and larger marks on that point; the readout prints the point and every value.', 'Read as a polite status when the keys moved it, for example Thu · Indoor 20.8 °C · Outdoor 12 °C.'],
      ['Focus', 'A two pixel ring around the window.', 'The chart is announced as a Line chart group with its name.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus onto the window. The cursor goes to the last point.', 'group'],
      ['Keyboard', 'Arrow Left, Arrow Right', 'Move the cursor to the previous or next point.', 'status'],
      ['Keyboard', 'Home, End', 'Move the cursor to the first or last point.', 'status'],
      ['Keyboard', 'Escape', 'Lets go of the cursor.', 'status'],
      ['Pointer', 'Move, press', 'The cursor follows the pointer to the nearest point. It is not announced.', 'none'],
      ['Screen reader', 'Read', 'The group, a summary of each line, then a table with a row per point.', 'group, table'],
    ],
    loading: <p>LineChart has no loading state of its own. Pass an empty <code>categories</code> and <code>series</code> until the readings arrive, or show a Skeleton in its place.</p>,
    focus: <p>Focus lands on the window with the cursor on the last point, the newest reading. A press with the pointer puts the cursor where you pressed.</p>,
  },
  deepDive: { na: 'LineChart has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'zero',
      rules: <p>By default the value axis fits the data, so small changes are easy to read. Set <code>zero</code> when the distance from nothing matters, such as energy used. For a range you know, pass <code>min</code> and <code>max</code> and the ticks stay inside it.</p>,
      pair: { do: <LineChart size="sm" zero label="Energy used" unit="kWh" categories={days} series={[{ label: 'Energy', values: [8.2, 7.9, 9.4, 12.4, 10.1, 6.3, 5.8] }]} />, doNote: 'The axis starts at zero, so the heights compare honestly.', dont: <LineChart size="sm" label="Energy used" unit="kWh" categories={days} series={[{ label: 'Energy', values: [8.2, 7.9, 9.4, 12.4, 10.1, 6.3, 5.8] }]} />, dontNote: 'Fitted to the data, a rise from 6 to 12 reads as a climb from nothing.' },
    },
    {
      name: 'index',
      rules: <p>Pass <code>index</code> with <code>onIndexChange</code> to hold the cursor in your own state, for example to print the same day in a Stat. Pass <code>defaultIndex</code> to start with the cursor on a point and leave the rest to the chart.</p>,
      pair: { do: <LineChart size="sm" defaultIndex={3} label="Temperature this week" unit="°C" categories={days} series={[indoor]} />, doNote: 'The cursor starts on Thursday and the person can move it.', dont: <LineChart size="sm" index={3} label="Temperature this week" unit="°C" categories={days} series={[indoor]} />, dontNote: 'Controlled with no onIndexChange, so the keys do nothing.' },
    },
    {
      name: 'format',
      rules: <p>Use <code>format</code> when a number needs its own writing, such as a currency or a Thai digit. It is used for ticks, the readout, the summary and the table. Leave the unit to <code>unit</code> when the number is plain.</p>,
      pair: { do: <LineChart size="sm" format={(v) => `${v}%`} label="Humidity today" categories={['08', '12', '16']} series={[{ label: 'Humidity', values: [46, 51, 49] }]} />, doNote: 'The format writes the percent sign once, everywhere.', dont: <LineChart size="sm" label="Humidity today (%)" categories={['08', '12', '16']} series={[{ label: 'Humidity %', values: [46, 51, 49] }]} />, dontNote: 'The unit is repeated in names, and the readout says 51 with no unit.' },
    },
  ],
  related: [['/components/sparkline', 'Sparkline', 'A tiny trend without axes, inside a row or a sentence.'], ['/components/stat', 'Stat', 'One figure with its change.'], ['/components/meter', 'Meter', 'A level on a printed scale with regions.']],
  references: [
    { title: 'WAI · Complex images', url: 'https://www.w3.org/WAI/tutorials/images/complex/', why: 'Why a chart carries a text summary and a table with the same data.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the lines differ by stroke and mark and not by hue.' },
    { title: 'Carbon Design System · Data visualization · Simple charts', url: 'https://carbondesignsystem.com/data-visualization/simple-charts/', why: 'How other systems set out a line chart.' },
  ],
};
