// Usage tab for Text (component-depth.md U1–U14). Text is the printing on the case of an appliance.
import { Heading, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const TEXT: Depth = {
  overview: (
    <>
      <p>Text prints words on a unit: the name of a control, a reading, a note, a paragraph on a sheet. It works like the printing on the case of an appliance. There is one typeface, two weights and grey ink, and the words sit flat on the plastic.</p>
      <p>Hierarchy comes from size and position, not from colour or bold. The name of a part sits on the inset line next to it, and a note sits under it in the lighter ink. Numbers that change use tabular figures, so the line beside them never moves.</p>
    </>
  ),
  whenToUse: ['To name a control or a reading on a unit.', 'For a short note under a part, such as a unit or a schedule.', 'For paragraphs of prose on a sheet or a page.', 'For a field label, rendered as a label element.'],
  whenNot: [
    { situation: 'The name of a unit, a section or a page', to: '/components/heading', label: 'Heading' },
    { situation: 'The live state of a device, such as a temperature', to: '/components/display', label: 'Display' },
    { situation: 'A status with a lamp and a word', to: '/components/badge', label: 'Badge' },
  ],
  variants: {
    primary: { purpose: 'The darkest ink on plastic, for what you read first: names, readings and prose.', pairing: 'Sits above or beside secondary text that adds a detail.' },
    secondary: { purpose: 'One step lighter, for notes, units and times that support the primary line.', pairing: 'Always next to a primary line or a heading. It still holds 4.5:1 on plastic.' },
  },
  anatomy: {
    render: <Stack gap="xs"><Text size="label" weight="medium">Living room</Text><Text size="caption" tone="secondary" numeric>Eco from 23:00</Text></Stack>,
    parts: [
      { part: 'Printed line', selector: '[data-component="Text"]', what: 'One element of text in the system grotesk, flat on the surface, with no outer margin.' },
      { part: 'Tabular figures', selector: '[data-component="Text"][data-size="caption"]', what: 'With numeric on, every digit takes the same width, so 11:15 and 23:00 line up.' },
    ],
    perVariant: 'Primary and secondary differ only in ink. Size, weight and position stay the same.',
  },
  sizes: {
    micro: { use: '11px. The model name in lowercase and numerals on a scale.', pairs: 'A caption wordmark on the same bottom inset line.' },
    caption: { use: '13px. The wordmark and short notes under a part.', pairs: 'A label or a heading above it.' },
    label: { use: '14px. The name of a control or a reading next to it.', pairs: 'Button and the other 44px controls, whose word is the same size.' },
    body: { use: '15px. One or two sentences inside a unit.', pairs: 'A level 3 heading above it.' },
    reading: { use: '16px. Prose on a sheet or a page, capped at the reading measure.', pairs: 'A level 2 heading above it, with body text for short asides.' },
  },
  emphasis: {
    text: <p>Use the medium weight for names and keep everything else regular. Primary ink is the default, so give a line the secondary tone only when it supports another line. Never make words orange: the orange belongs to the unit’s one control.</p>,
    pair: {
      do: <Unit><Stack gap="xs"><Text size="label" weight="medium">Washer</Text><Text size="caption" tone="secondary">Cotton 40°</Text></Stack></Unit>,
      doNote: 'The name in medium weight, the detail in the lighter ink.',
      dont: <Unit><Stack gap="xs"><Text size="label" weight="medium">Washer</Text><Text size="label" weight="medium">Cotton 40°</Text></Stack></Unit>,
      dontNote: 'Two lines in the same weight and ink, so neither reads first.',
    },
  },
  placement: {
    rows: [['On the inset line beside a part', 'The name of a control or reading, like printing next to a key.'], ['Under a part', 'A note or a unit in the lighter ink.'], ['Bottom of a unit', 'The wordmark on the left and the model name in lowercase on the right.'], ['On a sheet', 'Reading prose, capped at the measure.']],
    examples: [{ title: 'Printing on a unit', render: <Unit><Stack gap="md"><Heading level={3}>Bedroom heater</Heading><Text size="label" tone="secondary" numeric>Target 19.0°</Text><Stack direction="row" gap="md"><Text as="span" size="caption" weight="medium">dial</Text><Text as="span" size="micro" tone="secondary">hc 21</Text></Stack></Stack></Unit> }],
  },
  combinations: {
    good: [['Heading + secondary Text', 'A unit name with one line of detail.'], ['Label Text + Button', 'A printed name beside a key, at the same size as the word on the key.']],
    avoid: [{ title: 'many sizes in one unit', why: 'Four sizes in one small unit make hierarchy noisy. Two or three steps are enough.', render: <Unit><Stack gap="xs"><Text size="reading">Heater</Text><Text size="body">Living room</Text><Text size="label">21.5°</Text><Text size="micro">Eco</Text></Stack></Unit> }],
  },
  content: {
    formula: <p>Sentence case and plain words. A label is a noun: <em>Volume</em>, <em>Target</em>. A note says the detail: <em>Eco from 23:00</em>. Write the model name in lowercase, and never let it be the only name of a device.</p>,
    pair: {
      do: <Text size="label">Target 22.0°</Text>, doNote: 'Sentence case, the unit next to the number.',
      dont: <Text size="label">TARGET TEMPERATURE SETTING</Text>, dontNote: 'Capitals shout, and the words repeat what the reading already says.',
    },
    overflow: { text: 'Text wraps onto the next line within its column. A long word breaks so it never runs out of the unit.', render: <div data-overflow-demo style={{ inlineSize: 180, overflowWrap: 'anywhere' }}><Text size="label">Kitchen extractor hood boost schedule</Text></div> },
    rtl: { text: 'In right-to-left languages text starts on the right and the measure applies the same way.', render: <div dir="rtl"><Text size="body">المدفأة تحافظ على درجة حرارة الغرفة</Text></div> },
    expansion: { text: 'German and Finnish run about 30% longer. Lines wrap, so keep labels short enough for one line in a unit.', render: <Text size="label">Zieltemperatur 22,0° · Sparbetrieb ab 23:00</Text> },
  },
  behaviours: {
    states: [
      ['Rest', 'Flat ink on the surface, with no shadow and no outline.', 'Text has no hover, focus or pressed state.'],
      ['Changing number', 'With numeric on, digits keep a fixed width as they change.', 'The text does not animate.'],
    ],
    interactions: [
      ['Pointer', 'Select', 'Selects the words like any text.', 'native text'],
      ['Screen reader', 'Read', 'Read as part of the flow. As a label, it names its field.', 'p, span, div or label'],
    ],
    loading: <p>Text has no loading state. While a value is unknown, print a dash in its place and keep the line where it is.</p>,
    focus: <p>Text never takes focus. A label element passes focus to its field when clicked.</p>,
  },
  deepDive: {
    primary: {
      purpose: <p>Primary ink carries the words you read first: the name of a part, a reading, a paragraph. It is the darkest grey the plastic carries.</p>,
      context: <Unit><Text size="body">The washer finishes at 11:15.</Text></Unit>,
      practices: ['Use it for names, readings and prose.', 'Keep it as the default and leave the tone prop out.'],
      pair: { do: <Text size="label" weight="medium">Living room</Text>, doNote: 'The name in primary ink.', dont: <Text size="label" tone="secondary" weight="medium">Living room</Text>, dontNote: 'The name in the lighter ink reads like a note.' },
    },
    secondary: {
      purpose: <p>Secondary ink is one step lighter. It marks a line as support for the line above or beside it: a unit, a time, a short note.</p>,
      context: <Unit><Stack gap="xs"><Text size="label" weight="medium">Heater</Text><Text size="caption" tone="secondary">Eco from 23:00</Text></Stack></Unit>,
      practices: ['Use it next to a primary line or a heading.', 'Do not use it for a whole paragraph.'],
      pair: { do: <Stack gap="xs"><Text size="label">Target 22.0°</Text><Text size="caption" tone="secondary">Set by schedule</Text></Stack>, doNote: 'A note under its reading.', dont: <Text size="reading" tone="secondary">The heater holds the room at the target and drops two degrees at night.</Text>, dontNote: 'A whole paragraph in the lighter ink is harder to read.' },
    },
  },
  modifiers: [
    {
      name: 'numeric',
      rules: <p>Turns on tabular figures. Use it on any number that changes or that lines up in a column: times, readings, counters.</p>,
      pair: { do: <Stack gap="xs"><Text size="label" numeric>11:15</Text><Text size="label" numeric>23:00</Text></Stack>, doNote: 'Times line up digit for digit.', dont: <Stack gap="xs"><Text size="label">11:15</Text><Text size="label">23:00</Text></Stack>, dontNote: 'Proportional digits shift as the number changes.' },
    },
    {
      name: 'weight',
      rules: <p>Medium marks a name. Regular is everything else. There is no bold and no italic.</p>,
      pair: { do: <Text size="label" weight="medium">Volume</Text>, doNote: 'The name of a control in medium.', dont: <Text size="body" weight="medium">The heater holds the room at the target and drops at night.</Text>, dontNote: 'A sentence in medium weight shouts.' },
    },
  ],
  related: [['/components/heading', 'Heading', 'The name of a unit, a section or a page.'], ['/components/display', 'Display', 'The live state of the device, in its window.'], ['/components/badge', 'Badge', 'A status, with a lamp and a word.']],
  references: [
    { title: 'WCAG 2.2 · 1.4.3 Contrast (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html', why: 'Why both inks hold 4.5:1 on plastic.' },
    { title: 'MDN · font-variant-numeric', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric', why: 'How tabular figures work.' },
    { title: 'Vitsœ · Dieter Rams: ten principles for good design', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
