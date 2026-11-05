// Usage tab for Sparkline (component-depth.md U1–U14). Sparkline is a trend small enough for a line of text.
import { Display, Sparkline, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const power = [0.4, 0.5, 2.2, 2, 0.9, 1.2, 1.8];
const basic = <Sparkline showValue label="Power, last 7 days" unit="kW" values={power} />;

export const SPARKLINE: Depth = {
  overview: (
    <>
      <p>Sparkline shows which way a reading has gone, small enough to sit in a sentence, a list row or a table cell. It is one ink line with no axes and a solid dot on the last reading. The dot is where the line ends and where the person looks.</p>
      <p>It carries no numbers on the drawing, so the label says what it shows and the accessible name reads the first and last values, the low and the high, and whether the run rose or fell. It is a picture of a trend, not a control.</p>
    </>
  ),
  whenToUse: ['To show the shape of a reading over a period inside a row, a list or a table cell.', 'To put a trend next to a figure in a Stat.', 'To compare the shape of several readings in a column, on one scale.'],
  whenNot: [
    { situation: 'A trend that needs axes, a legend or a way to read single points', to: '/components/line-chart', label: 'LineChart' },
    { situation: 'One figure and its change since a point in time', to: '/components/stat', label: 'Stat' },
    { situation: 'A level in a known range with low and high regions', to: '/components/meter', label: 'Meter' },
  ],
  variants: { na: 'Sparkline has one look, an ink line with a dot on the last reading. The size and the printed value are props, covered under Sizes and Modifiers.' },
  anatomy: {
    render: basic,
    parts: [
      { part: 'Line', selector: '[data-component="Sparkline"] svg polyline', what: 'A two pixel ink line through the readings, oldest first, with no fill under it.' },
      { part: 'Dot', selector: '[data-component="Sparkline"] > span:first-child > span', what: 'A solid ink dot on the last reading.' },
      { part: 'Value', selector: '[data-component="Sparkline"] > span:last-child', what: 'The last value, printed after the line when showValue is set.' },
    ],
  },
  sizes: {
    sm: { use: 'Word height. A line of body text.', pairs: 'Text at body size.' },
    md: { use: 'A little taller than the text. A table cell or a list row.', pairs: 'A row of Text and a Badge.' },
    lg: { use: 'Wide and tall enough to read the shape at a glance.', pairs: 'A Stat or a heading.' },
  },
  emphasis: {
    text: <p>A Sparkline is never louder than the text around it. It is ink, it never takes the orange, and it has no fill. If a trend needs to lead a screen, use a LineChart.</p>,
    pair: { do: <Unit><Sparkline label="Power, last 7 days" unit="kW" values={power} /></Unit>, doNote: 'One small line where a row needs the shape.', dont: <Unit><Sparkline size="lg" label="Power, last 7 days" unit="kW" values={power} /></Unit>, dontNote: 'A large Sparkline alone is a chart with no axes; use a LineChart.' },
  },
  placement: {
    rows: [['Inside a sentence', 'Small, between words, on the text baseline.'], ['In a table cell or list row', 'Medium, in its own column, on one shared scale.']],
    examples: [{ title: 'In a sentence', render: <Unit><Text size="body">Heating ran <Sparkline size="sm" label="Heating power, last 7 days" unit="kW" values={power} /> most of Wednesday.</Text></Unit> }],
  },
  combinations: {
    good: [['Sparkline + Stat', 'The Stat gives the figure; the line gives the run behind it.'], ['Sparkline + Text', 'The text names the reading and the line shows its shape.']],
    avoid: [{ title: 'a Sparkline beside a Display for the same reading', why: 'Two displays say the same thing. Keep the Display for the state now and the line for the run.', render: <Unit><Stack gap="md"><Display label="Power" value="1.8" unit="kW" digits={3} /><Sparkline label="Power, last 7 days" unit="kW" values={power} /></Stack></Unit> }],
  },
  content: {
    formula: <p>Write the label as a noun and a period, as in <em>Power, last 7 days</em>. Pass the unit in <code>unit</code>. Pass the readings oldest first. Do not write “trend” or “chart”: the role already says it.</p>,
    pair: {
      do: <Sparkline label="Power, last 7 days" unit="kW" values={power} />, doNote: 'A noun and a period; the unit is its own prop.',
      dont: <Sparkline label="Sparkline chart of the trend in power" values={power} />, dontNote: 'The label repeats the role and has no period or unit.',
    },
    overflow: { text: 'The drawing has a fixed size set by the size prop and never grows. With showValue the number sits after the line and takes the room it needs.', render: <Sparkline showValue label="Energy, last 7 days" unit="kWh" values={[1200.5, 1210.25, 1198, 1240.75, 1262.5]} /> },
    rtl: { text: 'In right-to-left languages the label and the value follow the page, but the line keeps its order, oldest at the left, like a clock face.', render: <div dir="rtl"><Sparkline showValue label="الطاقة، آخر ٧ أيام" unit="kWh" values={[8.2, 7.9, 9.4, 12.4, 10.1, 6.3, 5.8]} /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They are read aloud and never drawn, so the line does not change.', render: <Sparkline label="Stromverbrauch der letzten sieben Tage" unit="kWh" values={[8.2, 7.9, 9.4, 12.4, 10.1, 6.3, 5.8]} /> },
  },
  behaviours: {
    states: [
      ['Readings', 'An ink line and a solid dot on the last reading.', 'An image named by the label, then the count, the direction, first and last, low and high.'],
      ['No readings', 'A flat rule in the ring tone in the same block.', 'Announced as the label and No readings.'],
      ['With value', 'The last value after the line in tabular numerals.', 'Hidden from assistive tech; the name already carries it.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Does not stop on a Sparkline. It is not a control.', 'none'],
      ['Pointer', 'Hover, press', 'Nothing happens. There is no tooltip.', 'none'],
      ['Screen reader', 'Read', 'An image whose name is the label and a sentence built from the readings.', 'img'],
    ],
    loading: <p>Sparkline has no loading state of its own. While the readings are unknown pass an empty list and it prints a flat rule, or show a Skeleton in its place.</p>,
    focus: <p>A Sparkline takes no focus. If the person needs to read single points, use a LineChart.</p>,
  },
  deepDive: { na: 'Sparkline has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'showValue',
      rules: <p>Set <code>showValue</code> when a row needs the number as well as the shape. The value is the last reading, written with <code>unit</code> or <code>format</code>. Leave it off inside a sentence, where the text already says the number.</p>,
      pair: { do: <Sparkline showValue label="Indoor, last 7 days" unit="°C" values={[20.5, 21, 21.5, 20.8, 21.2, 22, 21.6]} />, doNote: 'A row that shows the shape and the latest number.', dont: <Text size="body">It is 21.6 °C <Sparkline showValue label="Indoor, last 7 days" unit="°C" values={[20.5, 21, 21.5, 20.8, 21.2, 22, 21.6]} /></Text>, dontNote: 'The number is written twice in one sentence.' },
    },
    {
      name: 'min and max',
      rules: <p>By default each line fills its own block, so a flat week and a wild week look equally tall. Pass the same <code>min</code> and <code>max</code> to every Sparkline in a column to draw them on one scale.</p>,
      pair: { do: <Stack gap="md"><Sparkline min={0} max={100} label="Kitchen battery, last 7 days" unit="%" values={[90, 84, 80, 71, 66, 60, 52]} /><Sparkline min={0} max={100} label="Hall battery, last 7 days" unit="%" values={[40, 38, 37, 36, 34, 33, 31]} /></Stack>, doNote: 'One scale from 0 to 100, so the kitchen line sits higher.', dont: <Stack gap="md"><Sparkline label="Kitchen battery, last 7 days" unit="%" values={[90, 84, 80, 71, 66, 60, 52]} /><Sparkline label="Hall battery, last 7 days" unit="%" values={[40, 38, 37, 36, 34, 33, 31]} /></Stack>, dontNote: 'Each fills its own block, so a battery at 31% looks as full as one at 90%.' },
    },
  ],
  related: [['/components/line-chart', 'LineChart', 'A trend with axes, a legend and a cursor.'], ['/components/stat', 'Stat', 'One figure with its change.'], ['/components/meter', 'Meter', 'A level on a printed scale with regions.']],
  references: [
    { title: 'Edward Tufte · Sparkline theory and practice', url: 'https://www.edwardtufte.com/notebook/sparkline-theory-and-practice-edward-tufte/', why: 'Where the word-sized trend graphic comes from.' },
    { title: 'WAI-ARIA · img role', url: 'https://www.w3.org/TR/wai-aria-1.2/#img', why: 'Why the whole drawing is one image with a text name.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why rising and falling are told in text and by shape, not by a green or a red.' },
  ],
};
