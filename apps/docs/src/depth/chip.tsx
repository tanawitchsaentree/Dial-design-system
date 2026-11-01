// Usage tab for Chip (component-depth.md U1–U14). Chip is a small capsule key that latches down when chosen.
import { Button, Chip, Display, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const Row = ({ children }: { children: React.ReactNode }) => <Stack direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>{children}</Stack>;
const noop = () => {};

export const CHIP: Depth = {
  overview: (
    <>
      <p>Chip is a small capsule key for filters and quick presets, such as Eco, Night or Away. Press it and it latches down, like the band keys on an old radio. A latched chip stays pressed, its small lamp fills with ink and its word turns medium. Press it again and the spring brings it back up.</p>
      <p>A removable chip shows a choice that has already been made, such as a room in a filter. It has its own small round key at the end that takes it away. Chips are never orange. The orange belongs to the one main control of the unit.</p>
    </>
  ),
  whenToUse: ['For filters where any number can be on, such as Lamps, Heating and Speakers.', 'For quick presets and options next to the control they change.', 'For choices already made that a person may want to take away again.'],
  whenNot: [
    { situation: 'Picking exactly one of a few modes', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'A setting that takes effect at once and stays', to: '/components/switch', label: 'Switch' },
    { situation: 'A status that nobody presses', to: '/components/badge', label: 'Badge' },
  ],
  variants: { na: 'Chip has one look. Toggle or removable is set by the props it gets, covered under Modifiers.' },
  anatomy: {
    render: <Chip defaultSelected>Eco</Chip>,
    parts: [
      { part: 'Key', selector: '[data-component="Chip"] > button', what: 'A capsule key of matte plastic with a short shadow down and to the right.' },
      { part: 'Lamp', selector: '[data-component="Chip"] button > span:nth-of-type(1)', what: 'A 6px lamp. It is a small recess when off and fills with ink when latched.' },
      { part: 'Printed word', selector: '[data-component="Chip"] button > span:last-of-type', what: 'The label size, regular weight, medium when latched.' },
    ],
    perVariant: 'A removable chip has no lamp. It has a 24px round remove key at the end instead, with a 44px target.',
  },
  sizes: {
    md: { use: '44px tall. Chips on their own row, or the main presets of a unit.', pairs: 'Other 44px controls: Button, Switch, IconButton.' },
    sm: { use: '36px drawn, with a 44px area that still takes the press. Dense filter rows.', pairs: 'Rows of many chips, and lists on a settings sheet.' },
  },
  emphasis: {
    text: <p>Chips are never the loud part of a unit. They print no orange, and a latched chip sits lower than the rest. Keep a row to about five chips. Put the rest behind a Select.</p>,
    pair: {
      do: <Unit><Stack gap="sm"><Row><Chip size="sm" defaultSelected>Pre-wash</Chip><Chip size="sm">Quiet</Chip></Row><Button kind="primary">Start wash</Button></Stack></Unit>,
      doNote: 'Two option chips, then the one orange key.',
      dont: <Unit><Row><Chip size="sm" defaultSelected>Pre-wash</Chip><Chip size="sm" defaultSelected>Quiet</Chip><Chip size="sm" defaultSelected>Steam</Chip><Chip size="sm" defaultSelected>Eco</Chip><Chip size="sm" defaultSelected>Rinse</Chip><Chip size="sm" defaultSelected>Night</Chip><Chip size="sm" defaultSelected>Delay</Chip></Row></Unit>,
      dontNote: 'Seven latched chips. Nothing stands out, and the row wraps.',
    },
  },
  placement: {
    rows: [['Under the display, before the main key', 'Options that change what the main key starts.'], ['Above a list of devices', 'Filters that narrow the list below them.']],
    examples: [{ title: 'Washer options', render: <Unit><Stack gap="md"><Display label="Washer" value="1:34" digits={4} /><Row><Chip size="sm">Pre-wash</Chip><Chip size="sm" defaultSelected>Quiet</Chip></Row><Button kind="primary">Start wash</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Chips + one primary Button', 'Options, then the action that uses them.'], ['Removable chips + a Select', 'The Select adds an item, a chip shows it and can take it away.']],
    avoid: [{ title: 'chips used for pick-one', why: 'Chips can all be on at once. When only one may be on, people expect SegmentedControl.', render: <Unit><Row><Chip defaultSelected>Low</Chip><Chip>Medium</Chip><Chip>High</Chip></Row></Unit> }],
  },
  content: {
    formula: <p>One or two words that name the filter or preset: <em>Eco</em>, <em>Night</em>, <em>Lamps</em>. Sentence case, no full stop, no verb.</p>,
    pair: {
      do: <Chip>Night</Chip>, doNote: 'Names the preset.',
      dont: <Chip>Turn on night mode now</Chip>, dontNote: 'A sentence on a key. Use a Button for an action.',
    },
    overflow: { text: 'A long word makes the key wider. It does not wrap inside the key, so the row of chips wraps instead.', render: <div style={{ inlineSize: 220 }}><Row><Chip size="sm">Kitchen</Chip><Chip size="sm">Downstairs bathroom</Chip><Chip size="sm">Hall</Chip></Row></div> },
    rtl: { text: 'In right-to-left languages the lamp sits to the right of the word, and the remove key moves to the left end.', render: <div dir="rtl"><Row><Chip defaultSelected>ليلي</Chip><Chip onRemove={noop}>المطبخ</Chip></Row></div> },
    expansion: { text: 'German and Finnish words can run 30% longer. The key grows sideways and keeps its height.', render: <Row><Chip defaultSelected>Nachtmodus</Chip><Chip>Abwesenheit</Chip></Row> },
  },
  behaviours: {
    states: [
      ['Off', 'Raised by its height, lamp a small recess, word regular.', 'The key edge holds 3:1 against the body.'],
      ['Latched', 'Stays down by 3px with no shadow. The lamp fills with ink and the word turns medium.', 'The medium width is kept free, so nothing moves sideways.'],
      ['Hover', 'The printed ink darkens one step.', 'The key never lifts.'],
      ['Pressed', 'Drops by 3px in 65ms and the shadow collapses under it.', 'Returns on the spring when released, unless it latched.'],
      ['Reduce motion', 'No travel. A latched chip loses its shadow and keeps its sunken face, ring edge and lit lamp.', 'The state changes at once.'],
      ['Focus', 'A dark 2px ring around the key.', 'The same ring on the remove key.'],
      ['Disabled', 'Flat, no shadow, at half opacity.', 'It cannot be pressed. A lit lamp stays lit.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the chip, then to its remove key if it has one.', 'native button'],
      ['Keyboard', 'Space / Enter', 'Latches or releases a toggle chip. Removes a chip from its remove key.', 'native button'],
      ['Pointer', 'Press the chip', 'The key drops, and latches or springs back.', 'aria-pressed'],
      ['Screen reader', 'Read', 'Announced as a toggle button with its word, pressed or not pressed. The remove key says Remove and the word.', 'aria-pressed'],
    ],
    loading: <p>Chip has no loading state. If a filter takes time, show the result count or a Progress under the row.</p>,
    focus: <p>Chip is never focused on page load. When a removable chip is taken away, move focus to the next chip, or to the control that adds chips.</p>,
  },
  deepDive: { na: 'Chip has one kind. Toggle and removable are covered under Modifiers.' },
  modifiers: [
    {
      name: 'onRemove',
      rules: <p>Makes the chip removable. It loses its lamp and gets a round remove key at the end. Use it for choices already made. A removable chip cannot also latch.</p>,
      pair: { do: <Row><Chip onRemove={noop}>Kitchen</Chip><Chip onRemove={noop}>Hall</Chip></Row>, doNote: 'Rooms already in the filter, each one removable.', dont: <Row><Chip onRemove={noop}>Eco</Chip><Chip onRemove={noop}>Night</Chip></Row>, dontNote: 'Presets that can be removed. People expect to switch a preset off and on again.' },
    },
    {
      name: 'icon',
      rules: <p>Prints a small stroke symbol before the word. The word always stays, because the word names the chip.</p>,
      pair: { do: <Chip icon={<svg viewBox="0 0 16 16"><path d="M12.5 10.5A5.5 5.5 0 0 1 5.5 3.5a5.5 5.5 0 1 0 7 7z" /></svg>}>Night</Chip>, doNote: 'A moon and the word Night.', dont: <Row><Chip icon={<svg viewBox="0 0 16 16"><path d="M12.5 10.5A5.5 5.5 0 0 1 5.5 3.5a5.5 5.5 0 1 0 7 7z" /></svg>}>Night</Chip><Chip icon={<svg viewBox="0 0 16 16"><circle cx="8" cy="8" r="3" /></svg>}>Day</Chip><Chip icon={<svg viewBox="0 0 16 16"><path d="M3 13l10-10" /></svg>}>Away</Chip></Row>, dontNote: 'An icon on every chip adds noise and says nothing new.' },
    },
  ],
  related: [['/components/segmented-control', 'SegmentedControl', 'Only one of a few options may be on.'], ['/components/switch', 'Switch', 'A setting that takes effect at once.'], ['/components/badge', 'Badge', 'A status nobody presses.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button pattern (toggle)', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'aria-pressed for a key that stays on or off.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the small chip and the remove key keep a 44px target.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why a latched chip changes its depth and its lamp as well as its face.' },
  ],
};
