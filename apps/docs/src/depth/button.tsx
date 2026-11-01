// Usage tab for Button (component-depth.md U1–U14). Button is a key on the case of an appliance.
import { Button, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const BUTTON: Depth = {
  overview: (
    <>
      <p>Button starts, stops or confirms one thing. It is a key of the same matte plastic as the unit it sits on. When you press it, it drops by its height and its shadow disappears under it. When you let go, it comes back on a spring.</p>
      <p>Each unit holds one orange key at most: the action the unit exists for, such as Start wash on a washer card. Every other key is body-coloured with grey printing. That way the main action is the first thing anyone finds.</p>
    </>
  ),
  whenToUse: ['To start, stop, pause or confirm an action on a device.', 'For the main action of a sheet or dialog, as the one orange key.', 'For secondary actions next to it, as plastic keys.'],
  whenNot: [
    { situation: 'An action shown as an icon only', to: '/components/icon-button', label: 'IconButton' },
    { situation: 'Turning something on or off that stays on', to: '/components/switch', label: 'Switch' },
    { situation: 'Picking one of a few modes', to: '/components/segmented-control', label: 'SegmentedControl' },
  ],
  variants: {
    key: { purpose: 'Every action except the main one. Body-coloured plastic with printed ink.', pairing: 'Sits beside a primary key, or alone when the unit has no main action.' },
    primary: { purpose: 'The one action the unit exists for. Dyed orange with a darker rim.', pairing: 'Once per unit. Pair it with plastic keys, never with a second primary.' },
  },
  anatomy: {
    render: <Button kind="primary">Start wash</Button>,
    parts: [
      { part: 'Key body', selector: '[data-component="Button"]', what: 'A capsule of matte plastic, 44px tall, with a short shadow down and to the right.' },
      { part: 'Printed word', selector: '[data-component="Button"] span', what: 'The label in medium weight, printed on the key.' },
    ],
    perVariant: 'The primary key is dyed orange and carries a darker rim. The plastic key has no rim.',
  },
  sizes: {
    md: { use: '44px tall. Keys inside a unit and in toolbars.', pairs: 'Other 44px controls: Switch, IconButton, Select.' },
    lg: { use: '52px tall. The main action at the bottom of a sheet on a phone.', pairs: 'A full-width layout, with one key per row.' },
  },
  emphasis: {
    text: <p>One orange key per unit. If two actions seem equally important, the unit is doing two jobs. Split it into two units, or make one of them a plastic key.</p>,
    pair: {
      do: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start</Button><Button>Schedule</Button></Stack></Unit>,
      doNote: 'One orange key, and a plastic key beside it.',
      dont: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start</Button><Button kind="primary">Schedule</Button></Stack></Unit>,
      dontNote: 'Two orange keys in one unit compete, and neither reads as the main action.',
    },
  },
  placement: {
    rows: [['Bottom of a unit, after the display', 'The usual place for a device action, where the hand expects it.'], ['Bottom of a sheet or dialog', 'The main action last, with Cancel before it.']],
    examples: [{ title: 'Under a display', render: <Unit><Stack gap="md"><p className="flush">Washer · 38 min left</p><Stack direction="row" gap="sm"><Button kind="primary">Pause</Button><Button>Stop</Button></Stack></Stack></Unit> }],
  },
  combinations: {
    good: [['Primary + plastic keys', 'The main action and the alternatives.'], ['Plastic keys only', 'A unit with no single main action, such as a list of presets.']],
    avoid: [{ title: 'an orange key next to an orange knob', why: 'The knob is already the unit’s loud part, so a second orange part splits attention.', render: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Boost</Button><Button kind="primary">Eco</Button></Stack></Unit> }],
  },
  content: {
    formula: <p>A verb, then the object if it is not obvious: <em>Start wash</em>, <em>Turn off</em>, <em>Save schedule</em>. Sentence case, no full stop.</p>,
    pair: {
      do: <Button kind="primary">Start wash</Button>, doNote: 'A verb that says what happens.',
      dont: <Button kind="primary">OK</Button>, dontNote: 'OK says nothing about what will happen.',
    },
    overflow: { text: 'A long label wraps onto a second line and the key grows taller, so the whole word stays on the key.', render: <div style={{ inlineSize: 180 }}><Button full>Turn off every lamp in the living room</Button></div> },
    rtl: { text: 'In right-to-left languages the order of keys mirrors and the word stays centred.', render: <div dir="rtl"><Stack direction="row" gap="sm"><Button kind="primary">ابدأ</Button><Button>إلغاء</Button></Stack></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The key widens with the word.', render: <Stack direction="row" gap="sm"><Button kind="primary">Waschgang starten</Button><Button>Abbrechen</Button></Stack> },
  },
  behaviours: {
    states: [
      ['Rest', 'Raised by its height, with a short shadow down and to the right.', 'The printed ink is the secondary step on plastic keys.'],
      ['Hover', 'The ink darkens one step. On the primary key, the orange moves one step lighter.', 'The key never lifts or grows.'],
      ['Pressed', 'Drops by 3px in 65ms and the shadow collapses under it.', 'Returns on the spring in about 245ms when released.'],
      ['Focus', 'A dark 2px ring outside the key.', 'The ring is the same on every part.'],
      ['Disabled', 'Flat, no shadow, at half opacity.', 'It cannot be pressed and stays in the tab order only if the native button does.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the key.', 'native button'],
      ['Keyboard', 'Space or Enter', 'Presses the key and runs the action.', 'native button'],
      ['Pointer', 'Press and release', 'Drops at once, returns on the spring, runs on release.', 'native button'],
      ['Screen reader', 'Read', 'Announced as a button with its word.', 'role button'],
    ],
    loading: <p>Button has no loading state of its own. While a device takes time to answer, show the progress on the unit’s display and keep the key as it is.</p>,
    focus: <p>Button is never focused on page load. In a dialog, focus goes to the first field, or to the plastic key when there is nothing to fill in.</p>,
  },
  deepDive: {
    key: {
      purpose: <p>The plastic key carries every action that is not the reason the unit exists. It spends no colour, so it never competes with the orange part.</p>,
      context: <Unit><Stack direction="row" gap="sm"><Button>Schedule</Button><Button>History</Button></Stack></Unit>,
      practices: ['Use it for alternatives and for Cancel.', 'Keep its label short enough to fit on one line in a unit.'],
      pair: { do: <Button>Cancel</Button>, doNote: 'Cancel as a plastic key.', dont: <Button kind="primary">Cancel</Button>, dontNote: 'Cancel in orange reads as the main action.' },
    },
    primary: {
      purpose: <p>The primary key is the one orange part of a unit that has no knob. It marks the action the unit exists for.</p>,
      context: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start wash</Button><Button>Schedule</Button></Stack></Unit>,
      practices: ['Use it once per unit.', 'Leave it out when the unit already has an orange knob.', 'Put it last in a row of keys in a dialog.'],
      pair: { do: <Unit><Button kind="primary">Start</Button></Unit>, doNote: 'One orange key in the unit.', dont: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start</Button><Button kind="primary">Stop</Button></Stack></Unit>, dontNote: 'Two orange keys in the unit.' },
    },
  },
  modifiers: [
    {
      name: 'full',
      rules: <p>Stretches the key to the inner width of its unit. Use it for the single main action at the bottom of a sheet on a phone.</p>,
      pair: { do: <div style={{ inlineSize: 260 }}><Button kind="primary" full>Start wash</Button></div>, doNote: 'One full-width main action.', dont: <div style={{ inlineSize: 260 }}><Stack gap="sm"><Button full>Schedule</Button><Button full>History</Button><Button full>Settings</Button></Stack></div>, dontNote: 'A stack of full-width plastic keys reads like a menu. Use a list.' },
    },
  ],
  related: [['/components/icon-button', 'IconButton', 'The action is an icon with no word.'], ['/components/switch', 'Switch', 'Something stays on or off.'], ['/components/segmented-control', 'SegmentedControl', 'One of a few modes.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Keyboard and role expectations for a button.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why every key keeps a 44px target.' },
    { title: 'Vitsœ · Dieter Rams: ten principles for good design', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
