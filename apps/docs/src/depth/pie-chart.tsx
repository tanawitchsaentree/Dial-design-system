// Usage tab for PieChart (component-depth.md U1–U14). PieChart shows the parts of one whole as a ring or a disc in a recessed window.
import { Button, PieChart, Stack } from 'dial-react';
import type { Depth } from './types';

const Frame = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div>;
const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const rooms = [{ name: 'Living room', value: 380 }, { name: 'Bedrooms', value: 240 }, { name: 'Kitchen', value: 180 }, { name: 'Bathroom', value: 120 }];
const kwh = (v: number) => `${v} kWh`;
const chart = (extra: Partial<React.ComponentProps<typeof PieChart>> = {}) => (
  <Frame><PieChart label="Heating by room" slices={rooms} formatValue={kwh} {...extra} /></Frame>
);

export const PIE_CHART: Depth = {
  overview: (
    <>
      <p>PieChart shows how one whole divides into a few parts, such as the heating energy used by each room. The parts run clockwise from the top in a recessed window, and a donut prints the total in its hole.</p>
      <p>It draws with native SVG and no chart library. Each part has its own ink pattern, its name and share printed on a leader line, and a row in the legend. A line under the window says the part the keys are on, and a hidden table holds every number.</p>
    </>
  ),
  whenToUse: ['To show how one whole splits into two to six named parts.', 'To show a share, such as how much of a battery is charged, with the total in the hole.'],
  whenNot: [
    { situation: 'Comparing values across categories', to: '/components/bar-chart', label: 'BarChart' },
    { situation: 'One level in a range, such as a battery', to: '/components/meter', label: 'Meter' },
    { situation: 'How far a task has got', to: '/components/progress', label: 'Progress' },
  ],
  variants: {
    donut: { purpose: 'A ring with the total in the hole. The default, because the hole gives the whole a number.', pairing: 'Stands well in a unit beside a key. Keep to six parts.' },
    pie: { purpose: 'A whole disc, with no hole and no total in the middle.', pairing: 'Use it for two or three parts where the total does not matter.' },
  },
  anatomy: {
    render: chart(),
    parts: [
      { part: 'Window', selector: '[data-component="PieChart"] > div:nth-of-type(2)', what: 'A recess with a hairline edge that holds the ring.' },
      { part: 'Slice', selector: '[data-component="PieChart"] svg path', what: 'A part of the ring outlined in ink and filled with its own pattern.' },
      { part: 'Leader and name', selector: '[data-component="PieChart"] svg text', what: 'A hairline with one bend ties each slice to its name and share.' },
      { part: 'Total', selector: '[data-component="PieChart"] svg text', what: 'In a donut, the total and its caption sit in the hole.' },
      { part: 'Legend', selector: '[data-component="PieChart"] ul', what: 'A row for each part with its pattern, name, value and share. Each row is 44px tall.' },
      { part: 'Readout', selector: '[data-component="PieChart"] p', what: 'A polite line that says the part the keys are on.' },
    ],
    perVariant: 'The pie variant has the same parts without the hole and its total.',
  },
  sizes: { na: 'PieChart has no size prop. It fills the width of its column, and height sets the block size of the window in pixels.' },
  emphasis: { na: 'A chart is ink and pattern. Nothing in it is orange, and the key beside it stays the only loud part of the unit.' },
  placement: {
    rows: [['In a unit with a key', 'The chart sits above the orange key and the key stays the only loud part.'], ['In a column of readings', 'Give it the full width of the column; the names stand on both sides of the ring.']],
    examples: [{ title: 'In a unit', render: <Unit><Frame><Stack gap="xl"><PieChart label="Time on each mode" slices={[{ name: 'Comfort', value: 14 }, { name: 'Eco', value: 7 }, { name: 'Night', value: 3 }]} formatValue={(v) => `${v} h`} /><Button kind="primary">Set a schedule</Button></Stack></Frame></Unit> }],
  },
  combinations: {
    good: [['PieChart + Button', 'The orange key that saves or exports comes after the chart.'], ['PieChart + BarChart', 'The pie gives the split now; the bars give how it changed day by day.']],
    avoid: [{ title: 'a pie of eight parts', why: 'The patterns run out after six and the names crowd the ring. Use a BarChart.', render: <Frame><PieChart label="Energy by month" slices={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((name, i) => ({ name, value: 10 + i }))} /></Frame> }],
  },
  content: {
    formula: <p>Name the chart for the whole and the split, as in <em>Heating by room</em>. Name each part with a short noun. Put the unit in <code>formatValue</code>, not in the part name.</p>,
    pair: {
      do: chart(), doNote: 'A noun for the whole, and the split.',
      dont: chart({ label: 'Chart of how the heating is divided' }), dontNote: 'The title repeats what the chart is.',
    },
    overflow: { text: 'A name that does not fit beside the ring is cut with an ellipsis. The full name stays in the legend, the readout and the table.', render: <Frame><PieChart label="Heating by room" slices={[{ name: 'Living room with the open kitchen', value: 60 }, { name: 'Master bedroom suite', value: 40 }]} /></Frame> },
    rtl: { text: 'In right-to-left languages the legend reads from the right. The ring still runs clockwise from the top.', render: <div dir="rtl"><Frame><PieChart label="التدفئة حسب الغرفة" slices={[{ name: 'غرفة المعيشة', value: 60 }, { name: 'غرفة النوم', value: 40 }]} /></Frame></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They are cut beside the ring and the ring does not move.', render: <Frame><PieChart label="Heizung nach Raum" slices={[{ name: 'Wohnzimmer', value: 60 }, { name: 'Schlafzimmer', value: 40 }]} /></Frame> },
  },
  behaviours: {
    states: [
      ['Idle', 'The readout shows the key hint in secondary ink.', 'The hint is read when the chart is entered.'],
      ['Active slice', 'The slice takes a heavier outline, and with the keyboard a ring round it. Its legend row turns medium weight.', 'The readout says the name, the value and the share.'],
      ['Zero part', 'It gets no slice and no label, and keeps its legend row and its table row.', 'The table still lists every part.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Enters the chart as one stop and activates the first slice.', 'role=application'],
      ['Keyboard', 'Arrow keys', 'Right and Down go to the next slice, Left and Up to the one before.', 'arrow keys'],
      ['Keyboard', 'Home, End', 'Go to the first and the last slice.', 'Home, End'],
      ['Pointer', 'Press or move', 'Makes the slice or the legend row under the pointer active and prints it in the readout.', 'pointer'],
      ['Screen reader', 'Read', 'The title names the chart, the readout is a polite live region, and a table lists every value and share.', 'aria-live, table'],
    ],
    loading: <p>PieChart has no loading state. Render it once the numbers are there, or show a Skeleton in its place.</p>,
    focus: <p>Tab puts the focus on the chart and activates the first slice. The ring is drawn round that slice, not round the window.</p>,
  },
  deepDive: {
    donut: {
      purpose: <p>The donut spends the hole on the total, so the reader gets the whole and its split in one look.</p>,
      context: <Frame><PieChart label="Battery" centerValue="72%" centerLabel="Charged" slices={[{ name: 'Charged', value: 72 }, { name: 'Free', value: 28 }]} formatValue={(v) => `${v} %`} /></Frame>,
      practices: ['Pass centerValue when the figure in the hole is not the sum, such as a percentage.', 'Keep the caption to one word.'],
      pair: { do: chart(), doNote: 'Four parts and the total in the hole.', dont: <Frame><PieChart label="Heating by room" slices={[{ name: 'Living room', value: 380 }]} formatValue={kwh} /></Frame>, dontNote: 'One part is a full ring that shows nothing.' },
    },
    pie: {
      purpose: <p>The whole disc suits two or three parts where the total is not the point.</p>,
      context: <Frame><PieChart variant="pie" label="Where the water goes" slices={[{ name: 'Washing', value: 52 }, { name: 'Showers', value: 33 }, { name: 'Taps', value: 15 }]} formatValue={(v) => `${v} l`} /></Frame>,
      practices: ['Use it for two to four parts.', 'Order the parts from the largest, clockwise from the top.'],
      pair: { do: chart({ variant: 'pie', slices: rooms.slice(0, 3) }), doNote: 'Three parts, largest first.', dont: chart({ variant: 'pie', slices: [rooms[3], rooms[0], rooms[2], rooms[1]] }), dontNote: 'No order: the eye cannot rank the parts.' },
    },
  },
  modifiers: [
    {
      name: 'centerValue and centerLabel',
      rules: <p>A donut prints the formatted total and the word Total in its hole. Pass <code>centerValue</code> and <code>centerLabel</code> when the figure is something else, such as <em>72%</em> and <em>Charged</em>.</p>,
      pair: { do: <Frame><PieChart label="Battery" centerValue="72%" centerLabel="Charged" slices={[{ name: 'Charged', value: 72 }, { name: 'Free', value: 28 }]} /></Frame>, doNote: 'The figure in the hole is the one that matters.', dont: <Frame><PieChart label="Battery" slices={[{ name: 'Charged', value: 72 }, { name: 'Free', value: 28 }]} /></Frame>, dontNote: 'The hole says 100, the sum of the parts.' },
    },
  ],
  related: [['/components/bar-chart', 'BarChart', 'Values across categories.'], ['/components/meter', 'Meter', 'One level on a printed scale.'], ['/components/progress', 'Progress', 'How far a task has got.']],
  references: [
    { title: 'WAI · Complex images', url: 'https://www.w3.org/WAI/tutorials/images/complex/', why: 'Why a chart needs a text alternative as well as a drawing.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the parts differ by pattern and a printed name.' },
    { title: 'Edward Tufte · The Visual Display of Quantitative Information', url: 'https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/', why: 'Label the parts directly and keep the ink for the data.' },
  ],
};
