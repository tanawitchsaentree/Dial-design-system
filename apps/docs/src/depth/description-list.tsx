// Usage tab for DescriptionList (component-depth.md U1–U14). A list of terms and values printed on the inset line.
import { DescriptionDetail, DescriptionList, DescriptionTerm, Stack, Table, TableBody, TableCell, TableRow } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const basic = (
  <DescriptionList>
    <DescriptionTerm>Model</DescriptionTerm>
    <DescriptionDetail>ht 4 heater</DescriptionDetail>
    <DescriptionTerm>Power draw</DescriptionTerm>
    <DescriptionDetail numeric>1 840 W</DescriptionDetail>
    <DescriptionTerm>Room</DescriptionTerm>
    <DescriptionDetail>Living room</DescriptionDetail>
  </DescriptionList>
);

export const DESCRIPTION_LIST: Depth = {
  overview: (
    <>
      <p>DescriptionList prints facts about one thing: a model, a power draw, a service date. Each term is a small label on the body’s inset line and its value is printed under it or beside it. A seam is cut between one fact and the next.</p>
      <p>It is printing, not a control. It takes no focus, has no hover and uses no orange.</p>
    </>
  ),
  whenToUse: ['To list the facts about one device or one room, such as a model and a power draw.', 'To show a settings summary before the person confirms it.', 'To print the details of one record in a sheet.'],
  whenNot: [
    { situation: 'Many rows with the same columns, to compare', to: '/components/table', label: 'Table' },
    { situation: 'One figure with its unit in a window', to: '/components/stat', label: 'Stat' },
    { situation: 'Rows a person can open or press', to: '/components/list', label: 'List' },
  ],
  variants: { na: 'DescriptionList has one look, terms and values with a seam between pairs. The layout is the orientation prop, covered under Modifiers.' },
  anatomy: {
    render: basic,
    parts: [
      { part: 'Term', selector: '[data-component="DescriptionList"] > dt:first-child', what: 'The name of a fact at label size in secondary ink, on the inset line.' },
      { part: 'Detail', selector: '[data-component="DescriptionList"] > dd:nth-child(2)', what: 'The value at body size in primary ink with tabular numerals.' },
      { part: 'Seam', selector: '[data-component="DescriptionList"] > dt:nth-child(3)', what: 'A cut line above the term that starts the next fact: divider tone over the material’s lit edge.' },
    ],
  },
  sizes: { na: 'DescriptionList has no size prop. Terms are label size and values are body size, so the list reads the same in every unit.' },
  emphasis: {
    text: <p>Nothing in the list is louder than the rest. A term is secondary ink and a value is primary ink, and that is the whole hierarchy. Keep the orange key out of it.</p>,
    pair: { do: basic, doNote: 'Terms are quiet and values are plain.', dont: <Unit><Stack gap="md"><DescriptionList><DescriptionTerm><strong>Model</strong></DescriptionTerm><DescriptionDetail><strong>ht 4 heater</strong></DescriptionDetail></DescriptionList></Stack></Unit>, dontNote: 'Bold on both sides, so neither the term nor the value leads.' },
  },
  placement: {
    rows: [['In a unit body under a Heading', 'The list takes the full width of the body.'], ['In a sheet, inline', 'Terms in one column and values beside them.']],
    examples: [{ title: 'Details in a unit', render: <Unit><DescriptionList orientation="inline"><DescriptionTerm>Model</DescriptionTerm><DescriptionDetail>ht 4 heater</DescriptionDetail><DescriptionTerm>Voltage</DescriptionTerm><DescriptionDetail numeric>230 V</DescriptionDetail></DescriptionList></Unit> }],
  },
  combinations: {
    good: [['DescriptionList + Heading', 'The Heading names the thing, the list holds its facts.'], ['DescriptionList + Button', 'The orange key sits under the list, apart from the printing.']],
    avoid: [{ title: 'a DescriptionList for rows that share columns', why: 'Three devices with the same four facts are a table. A list repeats every term for each device.', render: <Unit><Table label="Heaters"><TableBody><TableRow><TableCell>ht 4</TableCell><TableCell>1 840 W</TableCell></TableRow></TableBody></Table></Unit> }],
  },
  content: {
    formula: <p>Write each term as a noun, such as <em>Power draw</em>, with no colon. Write the value with its unit, such as <em>1 840 W</em>. Mark a figure <code>numeric</code> so it lines up in the inline layout.</p>,
    pair: {
      do: basic, doNote: 'Nouns for terms, units in the values.',
      dont: <DescriptionList><DescriptionTerm>Model:</DescriptionTerm><DescriptionDetail>ht 4 heater</DescriptionDetail><DescriptionTerm>Draw:</DescriptionTerm><DescriptionDetail>1840</DescriptionDetail></DescriptionList>, dontNote: 'Colons repeat what the layout says, and the figure has no unit.',
    },
    overflow: { text: 'A long value wraps inside its column and the terms stay on the inset line. A long term wraps in the term column.', render: <DescriptionList orientation="inline"><DescriptionTerm>Schedule</DescriptionTerm><DescriptionDetail>Weekdays from 06:30 to 08:00 and from 17:30 to 22:30, weekends from 08:00 to 23:00</DescriptionDetail></DescriptionList> },
    rtl: { text: 'In right-to-left languages the terms start on the right edge and numeric values line up on the left. The digits keep their own order.', render: <div dir="rtl"><DescriptionList orientation="inline"><DescriptionTerm>الطراز</DescriptionTerm><DescriptionDetail>سخان ht 4</DescriptionDetail><DescriptionTerm>الاستهلاك</DescriptionTerm><DescriptionDetail numeric>1 840 W</DescriptionDetail></DescriptionList></div> },
    expansion: { text: 'German and Finnish terms can run 30% longer. The inline term column grows to the longest term and values move with it, together.', render: <DescriptionList orientation="inline"><DescriptionTerm>Leistungsaufnahme</DescriptionTerm><DescriptionDetail numeric>1 840 W</DescriptionDetail><DescriptionTerm>Letzte Wartung</DescriptionTerm><DescriptionDetail numeric>12. März 2026</DescriptionDetail></DescriptionList> },
  },
  behaviours: {
    states: [
      ['Stacked', 'Each term over its values, one column.', 'Read as term, then value.'],
      ['Inline', 'Terms in one column with the values beside them.', 'Same reading order as stacked.'],
      ['Numeric value', 'Lines up on the end edge in the inline layout.', 'No change.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Does not stop on a DescriptionList. It is not a control.', 'none'],
      ['Screen reader', 'Read', 'A description list, with each term announced before its value.', 'term, definition'],
    ],
    loading: <p>DescriptionList has no loading state. While a value is unknown, print a dash in the value, as <code>–</code>, so the pair keeps its place.</p>,
    focus: <p>A DescriptionList takes no focus. If a value must be pressable, put a Link or a Button inside the value.</p>,
  },
  deepDive: { na: 'DescriptionList has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'orientation',
      rules: <p><code>stacked</code> (default) puts each term over its values and fits a narrow unit. <code>inline</code> puts the terms in one column and the values beside them, which reads faster in a wide sheet. Use one orientation in a unit.</p>,
      pair: { do: <DescriptionList orientation="inline"><DescriptionTerm>Model</DescriptionTerm><DescriptionDetail>ht 4 heater</DescriptionDetail><DescriptionTerm>Draw</DescriptionTerm><DescriptionDetail numeric>1 840 W</DescriptionDetail></DescriptionList>, doNote: 'One column of terms and one of values.', dont: <Stack gap="md"><DescriptionList><DescriptionTerm>Model</DescriptionTerm><DescriptionDetail>ht 4 heater</DescriptionDetail></DescriptionList><DescriptionList orientation="inline"><DescriptionTerm>Draw</DescriptionTerm><DescriptionDetail numeric>1 840 W</DescriptionDetail></DescriptionList></Stack>, dontNote: 'Two layouts in one unit, so the terms are on two different lines.' },
    },
    {
      name: 'numeric',
      rules: <p>Set <code>numeric</code> on a value that is a figure. In the inline layout it lines up on the end edge so figures of different length share their last digit. In the stacked layout it changes nothing.</p>,
      pair: { do: <DescriptionList orientation="inline"><DescriptionTerm>Draw</DescriptionTerm><DescriptionDetail numeric>1 840 W</DescriptionDetail><DescriptionTerm>Voltage</DescriptionTerm><DescriptionDetail numeric>230 V</DescriptionDetail></DescriptionList>, doNote: 'Figures share their last digit.', dont: <DescriptionList orientation="inline"><DescriptionTerm>Draw</DescriptionTerm><DescriptionDetail numeric>Off</DescriptionDetail><DescriptionTerm>Voltage</DescriptionTerm><DescriptionDetail numeric>Varies by room</DescriptionDetail></DescriptionList>, dontNote: 'Words are not figures and should start on the inset line.' },
    },
  ],
  related: [['/components/table', 'Table', 'Rows of readings that share columns.'], ['/components/stat', 'Stat', 'One figure in a recessed window.'], ['/components/divider', 'Divider', 'The seam used between pairs.']],
  references: [
    { title: 'WAI-ARIA · term and definition roles', url: 'https://www.w3.org/TR/wai-aria-1.2/#term', why: 'How a term is paired with its value for assistive technology.' },
    { title: 'HTML · the dl element', url: 'https://html.spec.whatwg.org/multipage/grouping-content.html#the-dl-element', why: 'The grouping rules for terms and values, including several values per term.' },
    { title: 'Carbon Design System · Structured list', url: 'https://carbondesignsystem.com/components/structured-list/usage/', why: 'How other systems print label and value rows.' },
  ],
};
