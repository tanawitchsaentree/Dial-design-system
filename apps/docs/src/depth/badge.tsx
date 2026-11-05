// Usage tab for Badge (component-depth.md U1–U14). Badge is printing on the case: a shaped lamp and a word.
import { Badge, Display, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const Line = ({ name, children }: { name: string; children: React.ReactNode }) => (
  <Stack direction="row" align="center" gap="md" style={{ justifyContent: 'space-between', maxInlineSize: 'var(--ds-layout-frame-sm)' }}><span>{name}</span>{children}</Stack>
);

export const BADGE: Depth = {
  overview: (
    <>
      <p>Badge prints a status on the case as a small lamp and a word, such as Online or Door open. It is flat printing, with no box, no fill and no shadow. It sits on the text line next to the thing it describes.</p>
      <p>A lit lamp is a small glass bead. Its body lets the plastic show through in the status hue and its edge carries the full mark, so the shape still stands out. The word next to it stays ink on plastic and never sits on the glass.</p>
      <p>Each tone has its own shape. Positive is a dot, warning a triangle, critical a square, info a diamond and neutral a ring. The word is always there too, so the status never depends on colour. No tone is orange.</p>
    </>
  ),
  whenToUse: ['To show the state of a device in a list or on a unit, such as Online or Offline.', 'To count devices in a state, such as 3 offline.', 'Next to a name, on the same line.'],
  whenNot: [
    { situation: 'The person can press it', to: '/components/chip', label: 'Chip' },
    { situation: 'A number or value that changes', to: '/components/display', label: 'Display' },
    { situation: 'A message that needs a reply', to: '/components/toast', label: 'Toast' },
  ],
  variants: {
    neutral: { purpose: 'No particular state, such as Standby, Paused or Not set up. A hollow ring.', pairing: 'Beside positive and critical badges in a list, for the rows that are neither.' },
    positive: { purpose: 'Working as it should, such as Online, Done or Up to date. A filled dot.', pairing: 'The usual state of a row. Most rows in a list carry it, or none.' },
    warning: { purpose: 'Needs care soon but still works, such as Filter due or Low battery. A triangle.', pairing: 'Beside the control or setting that fixes it.' },
    critical: { purpose: 'Stopped or unsafe, such as Offline, Door open or Leak. A filled square.', pairing: 'At the top of a list, with what to do next nearby.' },
    info: { purpose: 'Something to know that does no harm, such as Update ready or New. A diamond.', pairing: 'Beside the item it is about, with the action on its page.' },
  },
  anatomy: {
    render: <Badge tone="critical" count={3}>offline</Badge>,
    parts: [
      { part: 'Line', selector: '[data-component="Badge"]', what: 'One inline line of printing on the text line.' },
      { part: 'Lamp', selector: '[data-component="Badge"] svg', what: 'A 10px glyph, its shape set by the tone. A lit tone is a glass bead with a full edge.' },
      { part: 'Count', selector: '[data-component="Badge"] > span:nth-of-type(1)', what: 'An optional number in tabular figures and medium weight.' },
      { part: 'Word', selector: '[data-component="Badge"] > span:last-of-type', what: 'The status word in ink, caption size, never tinted.' },
    ],
  },
  sizes: { na: 'Badge has one size. It prints caption text beside a 10px lamp.' },
  emphasis: {
    text: <p>A badge is quiet printing. One badge per row or per unit is enough. When every row is fine, leave the positive badges out and show only the rows that need care.</p>,
    pair: {
      do: <Stack gap="xs"><Line name="Kitchen lamp"><span /></Line><Line name="Hall speaker"><Badge tone="critical">Offline</Badge></Line><Line name="Bedroom heater"><span /></Line></Stack>,
      doNote: 'Only the row that needs care has a badge.',
      dont: <Stack gap="xs"><Line name="Kitchen lamp"><Stack direction="row" gap="sm"><Badge tone="positive">Online</Badge><Badge tone="info">New</Badge><Badge tone="neutral">Idle</Badge></Stack></Line></Stack>,
      dontNote: 'Three badges on one row. Pick the one that matters.',
    },
  },
  placement: {
    rows: [['At the end of a list row', 'The state of the device named at the start.'], ['On the line under a display', 'The state of the unit, printed beside the model name.']],
    examples: [{ title: 'Under the display', render: <Unit><Stack gap="md"><Display label="Washer" value="0:38" digits={4} /><Stack direction="row" style={{ justifyContent: 'space-between' }}><Badge tone="warning">Door open</Badge><span>washer 2</span></Stack></Stack></Unit> }],
  },
  combinations: {
    good: [['Badge + a list row', 'The name at the start, the state at the end.'], ['Badges with counts in a summary line', 'How many devices are in each state.']],
    avoid: [{ title: 'two states for one device', why: 'A device is in one state at a time. Show the one that needs care first.', render: <Line name="Hall speaker"><Stack direction="row" gap="sm"><Badge tone="warning">Low battery</Badge><Badge tone="critical">Offline</Badge></Stack></Line> }],
  },
  content: {
    formula: <p>Name the state in one to three words, such as <em>Online</em>, <em>Filter due</em> or <em>Door open</em>. With a count, write the word after the number in lowercase, as in <em>3 offline</em>.</p>,
    pair: {
      do: <Badge tone="critical">Door open</Badge>, doNote: 'Says what is wrong.',
      dont: <Badge tone="critical">Error</Badge>, dontNote: 'Something is wrong, and the reader has to guess what.',
    },
    overflow: { text: 'A long word wraps under itself, and the lamp stays on the first line. Keep the word short.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-narrow))' }}><Badge tone="warning">Water tank almost empty, fill it soon</Badge></div> },
    rtl: { text: 'In right-to-left languages the lamp sits to the right of the word.', render: <div dir="rtl"><Badge tone="positive">متصل</Badge></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The line grows sideways.', render: <Badge tone="warning">Filterwechsel fällig</Badge> },
  },
  behaviours: {
    states: [
      ['Static', 'A printed lamp and a word.', 'Badge has no hover, press or focus. It is not a control.'],
      ['Changing', 'The glyph and the word swap at once.', 'Nothing fades, pulses or blinks.'],
      ['Forced colours', 'Every glyph is drawn in the text colour.', 'The shapes still tell the tones apart.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Skips the badge, because it is printing.', 'no tabindex'],
      ['Screen reader', 'Read', 'Reads the count and the word. The glyph is hidden, because the word says the same.', 'aria-hidden glyph'],
    ],
    loading: <p>Before a device reports its state, use a neutral badge with a word such as Checking.</p>,
    focus: <p>Badge never takes focus. If the state needs an action, put a Button next to it.</p>,
  },
  deepDive: {
    neutral: {
      purpose: <p>Neutral says the device is fine but not doing anything. It is a hollow ring, so it reads as empty next to the filled tones.</p>,
      context: <Line name="Bedroom heater"><Badge tone="neutral">Standby</Badge></Line>,
      practices: ['Use it for paused, idle or not set up.', 'Do not use it to soften a problem.'],
      pair: { do: <Badge tone="neutral">Standby</Badge>, doNote: 'A device that is waiting.', dont: <Badge tone="neutral">Offline</Badge>, dontNote: 'Offline is a problem. Use critical.' },
    },
    positive: {
      purpose: <p>Positive says the device works as it should. It is a filled green dot.</p>,
      context: <Line name="Kitchen lamp"><Badge tone="positive">Online</Badge></Line>,
      practices: ['Use it where people check that things are fine.', 'Leave it out in long lists where nearly every row would carry it.'],
      pair: { do: <Badge tone="positive">Up to date</Badge>, doNote: 'A state that is good.', dont: <Badge tone="positive">Update ready</Badge>, dontNote: 'This is news. Use info.' },
    },
    warning: {
      purpose: <p>Warning says the device still works but needs care soon. It is an amber triangle with an ink edge.</p>,
      context: <Line name="Air purifier"><Badge tone="warning">Filter due</Badge></Line>,
      practices: ['Say what needs care.', 'Put the fix nearby.'],
      pair: { do: <Badge tone="warning">Low battery</Badge>, doNote: 'It still works, for now.', dont: <Badge tone="warning">Leak</Badge>, dontNote: 'A leak cannot wait. Use critical.' },
    },
    critical: {
      purpose: <p>Critical says the device has stopped or is unsafe. It is a filled red square.</p>,
      context: <Line name="Hall speaker"><Badge tone="critical">Offline</Badge></Line>,
      practices: ['Use it for states that need action now.', 'Keep it rare, so it still means something.'],
      pair: { do: <Badge tone="critical">Door open</Badge>, doNote: 'The washer cannot start.', dont: <Badge tone="critical">Paused</Badge>, dontNote: 'Paused is not a problem. Use neutral.' },
    },
    info: {
      purpose: <p>Info says there is something to know and no harm. It is a dark diamond.</p>,
      context: <Line name="Thermostat"><Badge tone="info">Update ready</Badge></Line>,
      practices: ['Use it for news, such as updates, new devices and tips.', 'Remove it once the person has seen it.'],
      pair: { do: <Badge tone="info">Update ready</Badge>, doNote: 'News about the device.', dont: <Badge tone="info">Filter due</Badge>, dontNote: 'This needs care. Use warning.' },
    },
  },
  modifiers: [
    {
      name: 'count',
      rules: <p>Prints a number before the word, in tabular figures. Use it in summaries, as in <em>3 offline</em>. The word that follows is lowercase.</p>,
      pair: { do: <Badge tone="critical" count={3}>offline</Badge>, doNote: 'A number and a word.', dont: <Badge tone="critical" count={3}>3 offline</Badge>, dontNote: 'The number is printed twice.' },
    },
  ],
  related: [['/components/chip', 'Chip', 'The person can press it.'], ['/components/display', 'Display', 'A value that changes.'], ['/components/progress', 'Progress', 'How far a task has run.']],
  references: [
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why each tone has a shape and a word.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'Why the amber triangle carries an ink edge.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
