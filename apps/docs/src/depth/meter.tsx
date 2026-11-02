// Usage tab for Meter (component-depth.md U1–U14). Meter is a static reading of a level in a known range.
import { Display, Grille, Meter, Progress, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const pct = (v: number) => `${v} %`;
const AIR = { low: 'Clean', mid: 'Fair', high: 'Poor' };
const aqi = (v: number) => `${v} AQI`;

export const METER: Depth = {
  overview: (
    <>
      <p>Meter reads a level that the person does not set, such as the battery, the air in a room, the hardness of the water or the strength of a signal. It is the tuning scale of a radio. A narrow recess holds a printed scale and one ink needle that stands at the reading.</p>
      <p>A range can have a low and a high region. The region the needle is in is named after the reading by its own glyph and a word, and the region names are printed under the scale. Colour never carries the region on its own, and nothing is orange.</p>
      <p>Meter does a different job from its neighbours. Progress fills toward the end of a task and only goes forward. Grille shows activity in holes, such as sound or airflow, with no scale. A meter can sit anywhere in its range and be read to the number.</p>
    </>
  ),
  whenToUse: [
    'To show a level within a known range, such as a battery or the air quality.',
    'When the range has regions people care about, such as low, normal and high.',
    'Beside the display of a unit, for the readings that are not its main state.',
  ],
  whenNot: [
    { situation: 'How far a task has run toward its end', to: '/components/progress', label: 'Progress' },
    { situation: 'Activity such as sound or airflow, shown in holes', to: '/components/grille', label: 'Grille' },
    { situation: 'The one state of the unit, in large digits', to: '/components/display', label: 'Display' },
  ],
  variants: { na: 'Meter has one look, a printed scale with a needle. The regions and the preferred region are options, covered under Modifiers.' },
  anatomy: {
    render: <Meter label="Air quality" value={74} max={150} low={50} high={100} optimum={0} regionLabels={AIR} formatValue={aqi} />,
    parts: [
      { part: 'Label', selector: '[data-component="Meter"] > span:first-child > span:first-child', what: 'What is read, printed above the start of the scale.' },
      { part: 'Reading', selector: '[data-component="Meter"] > span:first-child > span:last-child', what: 'The value with tabular figures, the glyph of its region and the region word.' },
      { part: 'Scale', selector: '[data-component="Meter"] > span:nth-child(2)', what: 'A narrow recess with printed ticks at its floor. The ends and the middle are taller.' },
      { part: 'Region marks', selector: '[data-component="Meter"] > span:nth-child(2) > span:nth-last-child(2)', what: 'Dashed marks across the recess where one region ends and the next begins.' },
      { part: 'Needle', selector: '[data-component="Meter"] > span:nth-child(2) > span:last-child', what: 'One 2px line of ink at the reading. It moves at once and never sweeps.' },
      { part: 'Region names', selector: '[data-component="Meter"] > span:last-child', what: 'Each region named under its span. The current one is in medium weight, and the preferred one carries a printed bracket.' },
    ],
  },
  sizes: { na: 'Meter has one size. The scale is 20px tall and as long as its column, and never shorter than 180px.' },
  emphasis: {
    text: <p>A meter is printing and a recess. It never takes the orange and never glows. The display of the unit says its one state; meters sit under it for the levels around that state.</p>,
    pair: {
      do: <Unit><Stack gap="md"><Display label="Purifier" value="2" unit="fan" detail="Auto" digits={2} /><Meter label="Air quality" value={38} max={150} low={50} high={100} optimum={0} regionLabels={AIR} formatValue={aqi} /></Stack></Unit>,
      doNote: 'The display says what the purifier does, the meter reads the air.',
      dont: <Unit><Stack gap="md"><Meter label="Fan speed" value={2} max={5} /><Meter label="Mode" value={1} max={3} /><Meter label="Air quality" value={38} max={150} /></Stack></Unit>,
      dontNote: 'Settings shown as meters, so the one real reading is lost among them.',
    },
  },
  placement: {
    rows: [['Under the display of a unit', 'The levels around the main state, such as the air or the filter.'], ['A row in a device list', 'The battery of each sensor, one meter per row.']],
    examples: [{ title: 'Sensors in a list', render: <Unit><Stack gap="lg"><Meter label="Hall sensor" value={84} low={20} formatValue={pct} regionLabels={{ low: 'Replace', mid: 'Good' }} /><Meter label="Garden sensor" value={12} low={20} formatValue={pct} regionLabels={{ low: 'Replace', mid: 'Good' }} /></Stack></Unit> }],
  },
  combinations: {
    good: [['Display + Meter', 'The display says the state, the meter reads a level beside it.'], ['Meter + Badge', 'A badge names a fault, the meter shows the level that caused it.']],
    avoid: [
      { title: 'a meter for a task', why: 'A wash cycle only goes forward toward its end. Progress fills a groove and says the time left.', render: <Unit><Stack gap="md"><Meter label="Cotton 40°" value={55} formatValue={pct} /><Progress label="Cotton 40°" value={55} valueText="38 min left" /></Stack></Unit> },
      { title: 'a meter for activity', why: 'Sound and airflow change all the time and have no number people read. Grille shows them in holes.', render: <Unit><Grille label="Airflow" value={6} /></Unit> },
    ],
  },
  content: {
    formula: <p>Name what is read, as in <em>Battery</em>, <em>Air quality</em> or <em>Water hardness</em>. Put the unit in <code>formatValue</code> or the whole reading in <code>valueText</code>. Name the regions in the words of the trade with <code>regionLabels</code>, such as Soft, Medium and Hard.</p>,
    pair: {
      do: <Meter label="Water hardness" value={16} max={30} low={8.4} high={14} optimum={6} regionLabels={{ low: 'Soft', mid: 'Medium', high: 'Hard' }} valueText="16 °dH" />, doNote: 'The regions use the words on a water report.',
      dont: <Meter label="Water hardness" value={16} max={30} low={8.4} high={14} />, dontNote: 'Bare numbers with no unit, and Low and High for water that is soft or hard.',
    },
    overflow: { text: 'A long label wraps and the reading stays at the end of the line. Region names that do not fit their span are cut with an ellipsis and are still announced in full.', render: <div data-overflow-demo="" style={{ inlineSize: 240 }}><Meter label="Battery of the sensor in the garden shed" value={46} low={20} high={80} formatValue={pct} /></div> },
    rtl: { text: 'In right-to-left languages the scale starts on the right. The lowest value is at the right end and the region names follow.', render: <div dir="rtl"><Meter label="البطارية" value={64} low={20} high={80} regionLabels={{ low: 'منخفض', mid: 'عادي', high: 'مرتفع' }} formatValue={pct} /></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The label wraps and the scale does not change.', render: <Meter label="Wasserhärte" value={16} max={30} low={8.4} high={14} regionLabels={{ low: 'Weich', mid: 'Mittelhart', high: 'Hart' }} valueText="16 °dH" /> },
  },
  behaviours: {
    states: [
      ['Reading', 'The needle stands at the value and the reading is printed above.', 'A new value moves the needle at once, with no sweep.'],
      ['In a region', 'The reading carries the region glyph and word.', 'Low points down, normal is a disc, high points up.'],
      ['Preferred region', 'With optimum, the glyph takes the positive mark when the reading is in the preferred region.', 'Two regions away it takes the critical mark. The shape and the word stay.'],
      ['No regions', 'The lowest and highest values are printed under the scale.', 'There is no glyph and no word.'],
    ],
    interactions: [
      ['Keyboard', 'None', 'A meter is read, so it is not in the tab order.', 'no tabindex'],
      ['Pointer', 'None', 'Pressing a meter does nothing.', 'no handler'],
      ['Screen reader', 'Read', 'Announced as a meter with its label and the reading in words, such as 18 %, Low.', 'role meter, aria-valuetext'],
    ],
    loading: <p>Meter has no loading state. Until the device reports a level, leave the meter out and say so on the unit’s display, so a needle never stands at a value nobody measured.</p>,
    focus: <p>A meter never takes focus. Screen readers reach it in reading order.</p>,
  },
  deepDive: { na: 'Meter has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'low and high',
      rules: <p>Split the range into a low region, a middle region and a high region. Readings under <code>low</code> are low, readings over <code>high</code> are high. Set only one of them for a range with two regions, such as a filter that only runs low.</p>,
      pair: { do: <Meter label="Battery" value={14} low={20} high={80} formatValue={pct} />, doNote: 'The glyph and the word say the battery is low.', dont: <Meter label="Battery" value={14} formatValue={pct} />, dontNote: 'No regions, so the person has to judge 14 % alone.' },
    },
    {
      name: 'optimum',
      rules: <p>A value in the preferred region. That region’s name carries a printed bracket, and the glyph takes the positive mark in it and the critical mark two regions away. Leave it out when no region is better than another.</p>,
      pair: { do: <Meter label="Air quality" value={128} max={150} low={50} high={100} optimum={0} regionLabels={AIR} formatValue={aqi} />, doNote: 'Clean air is preferred, so poor air shows the critical mark.', dont: <Meter label="Wi-Fi signal" value={-61} min={-90} max={-30} low={-75} high={-50} optimum={-90} regionLabels={{ low: 'Weak', mid: 'Usable', high: 'Strong' }} formatValue={(v) => `${v} dBm`} />, dontNote: 'The weak end set as preferred, so a strong signal is marked as bad.' },
    },
    {
      name: 'regionLabels',
      rules: <p>Names the regions in the words people use for that reading. The defaults are Low, Normal and High. Keep each name to one short word so it fits under its span.</p>,
      pair: { do: <Meter label="Water hardness" value={6} max={30} low={8.4} high={14} optimum={6} regionLabels={{ low: 'Soft', mid: 'Medium', high: 'Hard' }} valueText="6 °dH" />, doNote: 'Soft, Medium and Hard, as on a water report.', dont: <Meter label="Water hardness" value={6} max={30} low={8.4} high={14} optimum={6} regionLabels={{ low: 'Below the recommended range', mid: 'Within range', high: 'Above range' }} valueText="6 °dH" />, dontNote: 'Long names that cannot fit under their spans.' },
    },
  ],
  related: [['/components/progress', 'Progress', 'How far a task has run.'], ['/components/grille', 'Grille', 'Activity shown in holes.'], ['/components/display', 'Display', 'The one state of the unit.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Meter pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/meter/', why: 'The role, the values and the value text a meter needs, and how it differs from a progress bar.' },
    { title: 'HTML Living Standard · the meter element', url: 'https://html.spec.whatwg.org/multipage/form-elements.html#the-meter-element', why: 'Where low, high and optimum come from.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why each region has its own glyph and word.' },
  ],
};
