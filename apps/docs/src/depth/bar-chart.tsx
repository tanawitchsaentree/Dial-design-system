// Usage tab for BarChart (component-depth.md U1–U14). BarChart compares values across categories as bars in a recessed window.
import { BarChart, Button, Stack } from 'dial-react';
import type { Depth } from './types';

const Frame = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div>;
const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const days = ['Mon', 'Tue', 'Wed', 'Thu'];
const two = [{ name: 'Heating', values: [12, 18, 9, 15] }, { name: 'Hot water', values: [6, 7, 11, 5] }];
const kwh = (v: number) => `${v} kWh`;
const chart = (extra: Partial<React.ComponentProps<typeof BarChart>> = {}) => (
  <Frame><BarChart label="Energy by day" categories={days} series={two} formatValue={kwh} {...extra} /></Frame>
);

export const BAR_CHART: Depth = {
  overview: (
    <>
      <p>BarChart compares a number across a few categories, such as the energy used on each day of a week. The bars stand in one recessed window with a ruled scale, like the paper of a chart recorder, and each bar prints its own number.</p>
      <p>It draws with native SVG and no chart library. Series are told apart by the pattern in the bar, not by colour, so the chart reads in greyscale and for anyone who cannot tell hues apart. A line under the window says the bar the keys are on, and a hidden table holds every number.</p>
    </>
  ),
  whenToUse: ['To compare values across two to twelve named categories.', 'To compare two or three series over the same categories, such as heating and hot water by day.'],
  whenNot: [
    { situation: 'One level in a range, such as a battery', to: '/components/meter', label: 'Meter' },
    { situation: 'How far a task has got', to: '/components/progress', label: 'Progress' },
    { situation: 'The parts of one whole', to: '/components/pie-chart', label: 'PieChart' },
  ],
  variants: { na: 'BarChart has one look, bars on a ruled scale. Whether they rise or run sideways is the orientation prop, covered under Modifiers.' },
  anatomy: {
    render: chart(),
    parts: [
      { part: 'Window', selector: '[data-component="BarChart"] > div:nth-of-type(2)', what: 'A recess with a hairline edge that holds the drawing.' },
      { part: 'Scale', selector: '[data-component="BarChart"] svg text', what: 'Value numbers on the axis and category names under the bars, in secondary ink.' },
      { part: 'Bar', selector: '[data-component="BarChart"] svg rect:not([width="0"])', what: 'A rectangle outlined in ink and filled with the series pattern.' },
      { part: 'Value', selector: '[data-component="BarChart"] svg text', what: 'The number printed on the end of each bar when it fits.' },
      { part: 'Legend', selector: '[data-component="BarChart"] ul', what: 'Each series name beside a swatch of its pattern.' },
      { part: 'Readout', selector: '[data-component="BarChart"] p', what: 'A polite line that says the bar the keys are on.' },
    ],
  },
  sizes: { na: 'BarChart has no size prop. It fills the width of its column, and height sets the block size of the window in pixels.' },
  emphasis: { na: 'A chart is ink and pattern. Nothing in it is orange, and the key beside it stays the only loud part of the unit.' },
  placement: {
    rows: [['In a unit with a key', 'The chart sits above the orange key and the key stays the only loud part.'], ['In a column of readings', 'Give it the full width of the column; it needs about 300px to print its values.']],
    examples: [{ title: 'In a unit', render: <Unit><Frame><Stack gap="xl"><BarChart label="Water used" categories={['Mon', 'Tue', 'Wed']} series={[{ name: 'Hot', values: [40, 55, 35] }, { name: 'Cold', values: [80, 60, 90] }]} formatValue={(v) => `${v} l`} /><Button kind="primary">Save the report</Button></Stack></Frame></Unit> }],
  },
  combinations: {
    good: [['BarChart + Button', 'The orange key that saves or exports comes after the chart.'], ['BarChart + Meter', 'A Meter shows the level now; the chart shows how it got there.']],
    avoid: [{ title: 'a chart of one bar', why: 'One value has nothing to compare against. Print it in a Stat or a Meter.', render: <Frame><BarChart label="Energy today" categories={['Today']} series={[{ name: 'kWh', values: [12] }]} /></Frame> }],
  },
  content: {
    formula: <p>Name the chart for what it measures and the span it covers, as in <em>Energy by day</em>. Keep category names to one short word. Put the unit in <code>formatValue</code>, not in the category.</p>,
    pair: {
      do: chart({ label: 'Energy by day' }), doNote: 'A noun for the measure, and the span.',
      dont: chart({ label: 'Chart of how much energy was used on each of the days of the week' }), dontNote: 'The title repeats what the chart is.',
    },
    overflow: { text: 'A category name that does not fit its column is cut with an ellipsis. The full name stays in the readout and the table.', render: <Frame><BarChart label="Energy by room" categories={['Living room', 'Master bedroom', 'Utility room', 'Hall']} series={[{ name: 'kWh', values: [9, 6, 4, 2] }]} /></Frame> },
    rtl: { text: 'In right-to-left languages the categories run from the right, the scale sits on the right and the arrow keys follow the reading direction.', render: <div dir="rtl"><Frame><BarChart label="الطاقة اليومية" categories={['الاثنين', 'الثلاثاء', 'الأربعاء']} series={[{ name: 'التدفئة', values: [12, 18, 9] }, { name: 'الماء', values: [6, 7, 11] }]} /></Frame></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. They are cut to the column and the bars do not move.', render: <Frame><BarChart label="Energie nach Tag" categories={['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag']} series={[{ name: 'Heizung', values: [12, 18, 9, 15] }]} /></Frame> },
  },
  behaviours: {
    states: [
      ['Idle', 'The readout shows the key hint in secondary ink.', 'The hint is read when the chart is entered.'],
      ['Active bar', 'The bar takes a heavier outline, and with the keyboard a ring round it.', 'The readout says the category, the series and the value.'],
      ['Empty', 'Bars of zero keep their place with no height, and their value prints as 0.', 'The table still lists every category.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Enters the chart as one stop and activates the first bar.', 'role=application'],
      ['Keyboard', 'Arrow keys', 'Left and Right move between categories and Up and Down between series on a vertical chart. On a horizontal one the pairs swap.', 'arrow keys'],
      ['Keyboard', 'Home, End', 'Go to the first and the last category.', 'Home, End'],
      ['Pointer', 'Press or move', 'Makes the bar under the pointer active and prints it in the readout.', 'pointer'],
      ['Screen reader', 'Read', 'The title names the chart, the readout is a polite live region, and a table lists every value.', 'aria-live, table'],
    ],
    loading: <p>BarChart has no loading state. Render it once the numbers are there, or show a Skeleton in its place.</p>,
    focus: <p>Tab puts the focus on the chart and activates the first bar. The ring is drawn round that bar, not round the window.</p>,
  },
  deepDive: { na: 'BarChart has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'orientation',
      rules: <p><code>vertical</code> is the default and suits up to twelve short names. Use <code>horizontal</code> when the names are long, such as room names: the names stand on the left and the values at the end of each bar.</p>,
      pair: { do: <Frame><BarChart orientation="horizontal" label="Hours the heating ran" categories={['Living room', 'Bedroom', 'Kitchen']} series={[{ name: 'Hours', values: [9, 6, 4.5] }]} formatValue={(v) => `${v} h`} /></Frame>, doNote: 'Long names read in a row.', dont: <Frame><BarChart label="Hours the heating ran" categories={['Living room', 'Bedroom', 'Kitchen']} series={[{ name: 'Hours', values: [9, 6, 4.5] }]} formatValue={(v) => `${v} h`} /></Frame>, dontNote: 'The same names are cut under narrow columns.' },
    },
    {
      name: 'showValues',
      rules: <p>Leave it on. Each bar prints its number when it fits the bar. Turn it off only when a dense chart prints numbers over each other, and keep the readout and the table.</p>,
      pair: { do: chart(), doNote: 'The number is on the bar.', dont: chart({ showValues: false }), dontNote: 'The reader has to read the number off the scale.' },
    },
  ],
  related: [['/components/pie-chart', 'PieChart', 'The parts of one whole.'], ['/components/meter', 'Meter', 'One level on a printed scale.'], ['/components/progress', 'Progress', 'How far a task has got.']],
  references: [
    { title: 'WAI · Complex images', url: 'https://www.w3.org/WAI/tutorials/images/complex/', why: 'Why a chart needs a text alternative as well as a drawing.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the series differ by pattern and a printed number.' },
    { title: 'Edward Tufte · The Visual Display of Quantitative Information', url: 'https://www.edwardtufte.com/book/the-visual-display-of-quantitative-information/', why: 'Label the marks directly and keep the ink for the data.' },
  ],
};
