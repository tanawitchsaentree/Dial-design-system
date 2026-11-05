// Usage tab for SegmentedControl (component-depth.md U1–U14). A bank of latching keys, like a radio's band keys.
import { Button, Icon, SegmentedControl, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const BANDS = [{ value: 'fm', label: 'FM' }, { value: 'am', label: 'AM' }, { value: 'aux', label: 'AUX' }];
const MODES = [{ value: 'heat', label: 'Heat' }, { value: 'eco', label: 'Eco' }, { value: 'frost', label: 'Frost' }];

export const SEGMENTED_CONTROL: Depth = {
  overview: (
    <>
      <p>SegmentedControl picks exactly one of a few modes on a device. It is a bank of keys that hold each other, like the FM, AM and AUX keys on a radio. Press a key and it latches down. The key that was down springs back up.</p>
      <p>The chosen key is shown three ways at once. It sits down at height 0 with no shadow, as a key of frosted ink grey glass. Its small lamp lights as a glass bead. Its word turns medium weight and holds 4.5:1 on the glass. It is never orange, because orange belongs to the one main control of a unit.</p>
    </>
  ),
  whenToUse: ['Picking one mode from two to five, such as a heater’s Heat, Eco and Frost.', 'A setting that takes effect at once and that people change often.', 'A choice where seeing every option at once helps.'],
  whenNot: [
    { situation: 'Moving between sections of a screen', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Turning one thing on or off', to: '/components/switch', label: 'Switch' },
    { situation: 'A value on a scale, such as speed 1 to 10', to: '/components/rotary', label: 'Rotary' },
  ],
  variants: { na: 'SegmentedControl has one look. Its states (released, latched, disabled) are not kinds.' },
  anatomy: {
    render: <SegmentedControl label="Band" options={BANDS} defaultValue="fm" />,
    parts: [
      { part: 'Printed label', selector: '[data-component="SegmentedControl"] > span', what: 'The group name above the bank, in regular weight. It names the radio group.' },
      { part: 'Bank', selector: '[data-component="SegmentedControl"] [role="radiogroup"]', what: 'A recessed strip that holds the keys side by side.' },
      { part: 'Key', selector: '[data-component="SegmentedControl"] [role="radio"]', what: 'A plastic key, 44px tall, with a ring edge and a short shadow down and to the right.' },
      { part: 'Lamp', selector: '[data-component="SegmentedControl"] [role="radio"] > span:first-child', what: 'A 6px recess on each key, lit as a glass bead on the latched key.' },
      { part: 'Word', selector: '[data-component="SegmentedControl"] [role="radio"] > span:last-child', what: 'The option name on the key, medium weight when latched.' },
    ],
  },
  sizes: {
    md: { use: '44px keys. Mode keys inside a unit.', pairs: 'Button, Switch and IconButton at md.' },
    lg: { use: '52px keys with body-size words. The main setting of a sheet on a phone.', pairs: 'A lg primary Button at the bottom of the same sheet.' },
  },
  emphasis: {
    text: <p>A bank of mode keys is never the loud part of a unit. It prints no orange. The one orange key, the one that starts or plays, sits after it.</p>,
    pair: {
      do: <Unit><Stack gap="md" align="start"><SegmentedControl label="Band" options={BANDS} defaultValue="fm" /><Button kind="primary">Play</Button></Stack></Unit>,
      doNote: 'Band keys in ink, then the one orange key.',
      dont: <Unit><Stack gap="md" align="start"><SegmentedControl label="Band" options={BANDS} defaultValue="fm" /><SegmentedControl label="Mode" options={MODES} defaultValue="eco" /><SegmentedControl label="Speed" options={[{ value: '1', label: 'Low' }, { value: '2', label: 'High' }]} defaultValue="1" /></Stack></Unit>,
      dontNote: 'Three banks in one unit. The unit is doing three jobs; split it.',
    },
  },
  placement: {
    rows: [['Under the display, before the main key', 'The mode the main key will run in.'], ['At the top of a settings sheet', 'The one setting that changes the rest of the sheet.']],
    examples: [{ title: 'Radio unit', render: <Unit><Stack gap="md" align="start"><p className="flush">Kitchen radio · 98.4 MHz</p><SegmentedControl label="Band" options={BANDS} defaultValue="fm" /><Button kind="primary">Play</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['SegmentedControl + one primary Button', 'Pick the mode, then start it.'], ['Display + SegmentedControl', 'The display says what the latched mode is doing.']],
    avoid: [{ title: 'a SegmentedControl used to move between screens', why: 'Keys change the device. People expect pressing Kitchen to change a setting. Use Tabs for sections.', render: <SegmentedControl label="Room" options={[{ value: 'l', label: 'Living' }, { value: 'k', label: 'Kitchen' }]} defaultValue="l" /> }],
  },
  content: {
    formula: <p>One or two words per key, naming the mode, as in <em>Heat</em>, <em>Eco</em> or <em>FM</em>. Sentence case, or the short form printed on the device. The group label names the setting, as in <em>Mode</em> or <em>Band</em>.</p>,
    pair: {
      do: <SegmentedControl label="Mode" options={MODES} defaultValue="eco" />, doNote: 'Short mode names, one setting.',
      dont: <SegmentedControl label="Mode" options={[{ value: 'a', label: 'Heat the room' }, { value: 'b', label: 'Save energy' }]} defaultValue="a" />, dontNote: 'Sentences on keys crowd the bank.',
    },
    overflow: { text: 'Words do not wrap on a key. Keys share the width equally, so keep words short or use fewer keys.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-sm))' }}><SegmentedControl label="Program" options={[{ value: 'c', label: 'Cotton' }, { value: 's', label: 'Synthetic' }, { value: 'w', label: 'Wool' }]} defaultValue="s" /></div> },
    rtl: { text: 'In right-to-left languages the first key sits on the right, and the arrow keys follow the reading order.', render: <div dir="rtl"><SegmentedControl label="الموجة" options={[{ value: 'fm', label: 'FM' }, { value: 'am', label: 'AM' }, { value: 'aux', label: 'AUX' }]} defaultValue="fm" /></div> },
    expansion: { text: 'German words can run 30% longer. The bank grows sideways; check that it still fits the unit.', render: <SegmentedControl label="Modus" options={[{ value: 'h', label: 'Heizen' }, { value: 'e', label: 'Sparen' }, { value: 'f', label: 'Frostschutz' }]} defaultValue="h" /> },
  },
  behaviours: {
    states: [
      ['Released', 'A key raised by its height, lamp unlit, word in secondary ink.', 'The ring edge holds 3:1 against the bank.'],
      ['Latched', 'Down at height 0, no shadow, a frosted grey glass face, lamp lit, word in medium weight. Matte with reduced transparency.', 'Only one key is latched at a time.'],
      ['Hover', 'The word darkens one step.', 'The key never lifts.'],
      ['Pressed', 'Drops by 3px in 65ms and the shadow collapses.', 'It stays down; the key that was latched returns on the spring.'],
      ['Focus', 'A dark 2px ring around the focused key.', 'The bank is one tab stop.'],
      ['Disabled', 'Every key flat at half opacity.', 'The latched lamp stays readable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus into the bank, to the latched key.', 'roving tabindex'],
      ['Keyboard', 'Arrow keys', 'Move to the next or previous key and latch it. The ends wrap.', 'role radio'],
      ['Keyboard', 'Home / End', 'Latch the first or the last key.', 'role radio'],
      ['Keyboard', 'Space', 'Latches the focused key when none is latched yet.', 'native button'],
      ['Pointer', 'Press a key', 'The key drops and stays down; the other key returns.', 'native button'],
      ['Screen reader', 'Read', 'Announced as a radio group with its label, each key as a radio, checked or not checked.', 'role radiogroup'],
    ],
    loading: <p>SegmentedControl has no loading state. If the device must confirm the new mode, show that on the unit’s display.</p>,
    focus: <p>SegmentedControl is never focused on page load. Tab lands on the latched key, or on the first key when none is latched.</p>,
  },
  deepDive: { na: 'SegmentedControl has one kind, covered above.' },
  modifiers: [
    {
      name: 'icon',
      rules: <p>An option may carry a symbol printed before its word, in the same ink. Use symbols on every key or on none. The word stays; the symbol never replaces it.</p>,
      pair: {
        do: <SegmentedControl label="Lamp colour" options={[{ value: 'w', label: 'Warm', icon: <Icon name="lamp" /> }, { value: 'n', label: 'Night', icon: <Icon name="schedule" /> }]} defaultValue="w" />,
        doNote: 'A symbol and a word on every key.',
        dont: <SegmentedControl label="Lamp colour" options={[{ value: 'w', label: 'Warm', icon: <Icon name="lamp" /> }, { value: 'n', label: 'Night' }]} defaultValue="w" />,
        dontNote: 'A symbol on one key only makes the keys uneven.',
      },
    },
    {
      name: 'disabled',
      rules: <p>Disable the bank while the device cannot change mode, such as a washer during a wash. Say why on the display or in the label.</p>,
      pair: { do: <SegmentedControl label="Program (locked while washing)" options={MODES} defaultValue="eco" disabled />, doNote: 'The label says why it is locked.', dont: <SegmentedControl label="Mode" options={MODES} defaultValue="eco" disabled />, dontNote: 'A locked bank with no reason.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Move between sections of a screen.'], ['/components/switch', 'Switch', 'One setting, on or off.'], ['/components/checkbox', 'Checkbox', 'Any number of options at once.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Radio Group pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/', why: 'Roving tabindex, arrows that move and check, Home and End.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the latched key is told by depth, lamp and weight.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why every key is at least 44px.' },
  ],
};
