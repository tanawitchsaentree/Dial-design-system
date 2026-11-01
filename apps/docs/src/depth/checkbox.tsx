// Usage tab for Checkbox (component-depth.md U1–U14). Checkbox is a small square key that prints a tick.
import { Button, Checkbox, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const CHECKBOX: Depth = {
  overview: (
    <>
      <p>Checkbox turns one option on or off, often as one of several options in a list. It is a small square key of matte plastic with its name printed beside it. Press the key or the name, and the key drops and comes back on a spring. When the option is on, a tick in ink appears on the key.</p>
      <p>The tick is printing ink, never orange, because orange belongs to the one main control of a unit. On, off and mixed are three different shapes, a tick, an empty key and a dash. You can read the state without seeing colour.</p>
    </>
  ),
  whenToUse: ['For options that add to a program, such as Pre-wash or Extra rinse.', 'For a list where any number of items can be on.', 'For a single yes or no that takes effect when a form is sent.'],
  whenNot: [
    { situation: 'A setting that takes effect at once', to: '/components/switch', label: 'Switch' },
    { situation: 'Picking exactly one of a few modes', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Running an action', to: '/components/button', label: 'Button' },
  ],
  variants: { na: 'Checkbox has one look. Its states (off, on, mixed, disabled) are not kinds.' },
  anatomy: {
    render: <Checkbox label="Eco mode" defaultChecked />,
    parts: [
      { part: 'Row', selector: '[data-component="Checkbox"]', what: 'The native label holds the key and the name together, 44px tall. Any of it presses the key.' },
      { part: 'Key', selector: '[data-component="Checkbox"] > span:nth-of-type(1)', what: 'A 24px square key with a ring edge and a short shadow down and to the right.' },
      { part: 'Tick', selector: '[data-component="Checkbox"] svg', what: 'A 2px ink tick on the key face when on, a dash when mixed.' },
      { part: 'Printed name', selector: '[data-component="Checkbox"] > span:nth-of-type(2)', what: 'The label in regular weight, printed beside the key.' },
    ],
  },
  sizes: { na: 'Checkbox has one size, a 24px key in a 44px row.' },
  emphasis: {
    text: <p>Checkboxes are never the loud part of a unit. They print no orange. The orange key that runs the program sits after them.</p>,
    pair: {
      do: <Unit><Stack gap="sm"><Checkbox label="Pre-wash" defaultChecked /><Button kind="primary">Start wash</Button></Stack></Unit>,
      doNote: 'An ink tick, then the one orange key.',
      dont: <Unit><Stack gap="sm"><Checkbox label="Pre-wash" defaultChecked /><Checkbox label="Extra rinse" defaultChecked /><Checkbox label="Eco mode" defaultChecked /><Checkbox label="Steam" defaultChecked /><Checkbox label="Quick" defaultChecked /><Checkbox label="Night" defaultChecked /></Stack></Unit>,
      dontNote: 'Six options on one unit. Put the rarely used ones on a settings sheet.',
    },
  },
  placement: {
    rows: [['Under the display, before the main key', 'Options that change the program the main key starts.'], ['In a settings sheet', 'A list of options, one per row.']],
    examples: [{ title: 'Washer options', render: <Unit><Stack gap="md"><p className="flush">Washer · Cotton 40°</p><Stack gap="xs"><Checkbox label="Pre-wash" /><Checkbox label="Extra rinse" defaultChecked /></Stack><Button kind="primary">Start wash</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Checkboxes + one primary Button', 'Options, then the action that uses them.'], ['A parent checkbox + child checkboxes', 'The parent shows a dash when only some children are on.']],
    avoid: [{ title: 'a checkbox that acts at once next to a Switch', why: 'Two controls that look different but both act at once confuse people. Use Switch for both.', render: <Unit><Stack gap="xs"><Checkbox label="Lamp on" defaultChecked /><Checkbox label="Heating on" /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the option rather than the action, such as <em>Pre-wash</em>, <em>Child lock</em> or <em>Eco mode</em>. Sentence case, no full stop, and phrased so that a tick means yes.</p>,
    pair: {
      do: <Checkbox label="Child lock" />, doNote: 'A tick means the lock is on.',
      dont: <Checkbox label="Don’t lock the door" />, dontNote: 'A tick on a negative is hard to read.',
    },
    overflow: { text: 'A long name wraps onto more lines beside the key. The key stays on the first line.', render: <div data-overflow-demo="" style={{ inlineSize: 220 }}><Checkbox label="Send me a message when the wash has finished and the door unlocks" /></div> },
    rtl: { text: 'In right-to-left languages the key moves to the right of its name.', render: <div dir="rtl"><Checkbox label="غسيل مسبق" defaultChecked /></div> },
    expansion: { text: 'German and Finnish names can run 30% longer. The row grows sideways and the key keeps its size.', render: <Checkbox label="Zusätzlicher Spülgang" defaultChecked /> },
  },
  behaviours: {
    states: [
      ['Off', 'An empty key, raised by its height.', 'The ring edge holds 3:1 against the body.'],
      ['On', 'A 2px ink tick on the key face.', 'The tick appears at once, with no animation.'],
      ['Mixed', 'A short ink dash on the key face.', 'Announced as mixed. Pressing it turns everything on.'],
      ['Hover', 'The key’s edge darkens one step.', 'The key never lifts.'],
      ['Pressed', 'Drops by 3px in 65ms and the shadow collapses under it.', 'Returns on the spring when released.'],
      ['Focus', 'A dark 2px ring around the key.', 'Drawn from the hidden native input.'],
      ['Disabled', 'Flat, no shadow, at half opacity.', 'It cannot be pressed. The tick stays readable.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the checkbox.', 'native input'],
      ['Keyboard', 'Space', 'Turns the option on or off.', 'native input'],
      ['Pointer', 'Press the key or the name', 'The key drops and returns, and the option flips.', 'native label'],
      ['Screen reader', 'Read', 'Announced as a checkbox with its name and its state, which is checked, unchecked or mixed.', 'role checkbox'],
    ],
    loading: <p>Checkbox has no loading state. If a device must confirm the change, show that on the unit’s display.</p>,
    focus: <p>Checkbox is never focused on page load. In a sheet, focus goes to the first field, which may be the first checkbox.</p>,
  },
  deepDive: { na: 'Checkbox has one kind, covered above.' },
  modifiers: [
    {
      name: 'indeterminate',
      rules: <p>Shows a dash for a parent option when only some of its children are on. Set it from the children’s state. Pressing the parent turns all of them on.</p>,
      pair: { do: <Stack gap="xs"><Checkbox label="All lamps" indeterminate /><Checkbox label="Kitchen lamp" defaultChecked /><Checkbox label="Hall lamp" /></Stack>, doNote: 'The parent shows a dash because one of two lamps is on.', dont: <Checkbox label="Maybe" indeterminate />, dontNote: 'Mixed is not a third answer. Use it only for a parent of a list.' },
    },
  ],
  related: [['/components/switch', 'Switch', 'The setting takes effect at once.'], ['/components/button', 'Button', 'Run an action.'], ['/components/icon-button', 'IconButton', 'An action shown as a symbol.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Checkbox pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/', why: 'Keyboard, role and mixed-state expectations.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why on and off differ in shape, not only in colour.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the whole 44px row is the target.' },
  ],
};
