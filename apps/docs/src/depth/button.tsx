// Usage tab for Button (component-depth.md U1–U14). Button is a key on the case of an appliance.
import { Button, Input, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const BUTTON: Depth = {
  overview: (
    <>
      <p>Button starts, stops or confirms one thing. It is a key of the same matte plastic as the unit it sits on. When you press it, it drops by its height and its shadow disappears under it. When you let go, it comes back on a spring.</p>
      <p>Each unit holds one orange key at most. That key is the action the unit exists for, such as Start wash on a washer card. Every other key is body-coloured with grey printing. That way the main action is the first thing anyone finds.</p>
      <p>Button renders a native button element, so it brings the keyboard, the focus and the screen reader behaviour of the platform with it. Its type is button unless you pass another one, so a key inside a form does not send the form by accident. Pass type submit on the one key that should send it.</p>
      <p>The key carries a word and nothing else. There is no icon slot and no badge slot, because a printed word on a plain key is how the appliances this system comes from label their keys. When a symbol says the action better than a word, use IconButton, which is the same plastic in a round shape.</p>
    </>
  ),
  whenToUse: [
    'To start, stop, pause or confirm an action on a device.',
    'For the main action of a sheet or dialog, as the one orange key.',
    'For secondary actions next to it, as plastic keys.',
    'To send a form, as the one key with type submit at the end of the form.',
    'To open a sheet that asks one question before something hard to undo.',
  ],
  whenNot: [
    { situation: 'An action shown as an icon only', to: '/components/icon-button', label: 'IconButton' },
    { situation: 'Turning something on or off that stays on', to: '/components/switch', label: 'Switch' },
    { situation: 'Picking one of a few modes', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Filtering a list or choosing presets that can be combined', to: '/components/chip', label: 'Chip' },
    { situation: 'Asking for confirmation before a destructive action', to: '/components/dialog', label: 'Dialog' },
    { situation: 'Telling someone an action finished, with an undo', to: '/components/toast', label: 'Toast' },
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
    perVariant: 'The primary key is dyed orange and carries a darker rim. The plastic key has no rim. Both have the same capsule, the same height for their size and the same travel when pressed, so the only thing that tells them apart is the colour of the plastic.',
  },
  sizes: {
    md: { use: '44px tall. Keys inside a unit and in toolbars.', pairs: 'Other 44px controls such as Switch, IconButton and Select.' },
    lg: { use: '52px tall, with wider padding at the ends. The main action at the bottom of a sheet on a phone.', pairs: 'A full-width layout, with one key per row, and Input at size lg above it.' },
  },
  emphasis: {
    text: (
      <>
        <p>One orange key per unit. If two actions seem equally important, the unit is doing two jobs. Split it into two units, or make one of them a plastic key.</p>
        <p>The orange is counted across every part of the unit, so a primary Rotary or a primary IconButton uses it up as well. A screen can hold several units, and each one may keep its own orange part. A sheet over the screen is a unit of its own, so its main action may be orange even when the units behind it already are.</p>
      </>
    ),
    pair: {
      do: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start</Button><Button>Schedule</Button></Stack></Unit>,
      doNote: 'One orange key, and a plastic key beside it.',
      dont: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start</Button><Button kind="primary">Schedule</Button></Stack></Unit>,
      dontNote: 'Two orange keys in one unit compete, and neither reads as the main action.',
    },
  },
  placement: {
    rows: [
      ['Bottom of a unit, after the display', 'The usual place for a device action, where the hand expects it.'],
      ['Bottom of a sheet or dialog', 'The main action last, with Cancel before it.'],
      ['End of a form', 'The submit key after the last field, aligned to the start of the column on a phone and to the end of the row in a wide sheet.'],
      ['Full width on a phone', 'One main action at the bottom of a sheet, at size lg, within reach of the thumb.'],
    ],
    examples: [
      { title: 'Under a display', render: <Unit><Stack gap="md"><p className="flush">Washer, 38 min left</p><Stack direction="row" gap="sm"><Button kind="primary">Pause</Button><Button>Stop</Button></Stack></Stack></Unit> },
      { title: 'At the end of a form', render: <Unit><Stack gap="md"><Input label="Room name" defaultValue="Kitchen" /><Stack direction="row" gap="sm"><Button>Cancel</Button><Button kind="primary" type="submit">Save room</Button></Stack></Stack></Unit> },
    ],
  },
  combinations: {
    good: [
      ['Primary + plastic keys', 'The main action and the alternatives.'],
      ['Plastic keys only', 'A unit with no single main action, such as a list of presets.'],
      ['Plastic key + IconButton', 'A word for the action people look for, and symbols for the ones they already know, such as skip and volume.'],
      ['Primary key + Display', 'The display says the state and the key changes it, such as 38 min left above Pause.'],
    ],
    avoid: [
      { title: 'an orange key next to an orange knob', why: 'The knob is already the unit’s loud part, so a second orange part splits attention.', render: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Boost</Button><Button kind="primary">Eco</Button></Stack></Unit> },
      { title: 'a row of more than three keys', why: 'Past three, people read the words one by one. Move the rarer actions into a sheet, or turn the modes into a SegmentedControl.', render: <Unit><Stack direction="row" gap="sm"><Button>Eco</Button><Button>Quick</Button><Button>Cotton</Button><Button>Wool</Button></Stack></Unit> },
    ],
  },
  content: {
    formula: (
      <>
        <p>Start with a verb, then add the object if it is not obvious, as in <em>Start wash</em>, <em>Turn off</em> and <em>Save schedule</em>. Sentence case, no full stop.</p>
        <p>Use the same verb the device uses. If the display says Paused, the key that resumes it says Resume. In a sheet that asks a question, the main key repeats the verb of the question, so Turn off every lamp is answered by Turn off. Keep it to three words, because a key in a unit is about as wide as its word.</p>
        <p>Leave out words that describe the gesture, such as Click or Tap, and words that describe the key itself, such as Button. Leave out numbers too, since a count belongs on the display, where it can change.</p>
      </>
    ),
    pair: {
      do: <Button kind="primary">Start wash</Button>, doNote: 'A verb that says what happens.',
      dont: <Button kind="primary">OK</Button>, dontNote: 'OK says nothing about what will happen.',
    },
    overflow: { text: 'A long label wraps onto a second line and the key grows taller, so the whole word stays on the key.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-narrow))' }}><Button full>Turn off every lamp in the living room</Button></div> },
    rtl: { text: 'In right-to-left languages the order of keys mirrors and the word stays centred.', render: <div dir="rtl"><Stack direction="row" gap="sm"><Button kind="primary">ابدأ</Button><Button>إلغاء</Button></Stack></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The key widens with the word.', render: <Stack direction="row" gap="sm"><Button kind="primary">Waschgang starten</Button><Button>Abbrechen</Button></Stack> },
  },
  behaviours: {
    states: [
      ['Rest', 'Raised by its height, with a short shadow down and to the right.', 'The printed ink is the secondary step on plastic keys.'],
      ['Hover', 'The ink darkens one step. On the primary key, the orange moves one step lighter.', 'The key never lifts or grows.'],
      ['Pressed', 'Drops by 3px in 65ms, shifts 1px along the shadow, and the shadow collapses under it.', 'Returns on the spring in about 245ms when released.'],
      ['Focus', 'A dark 2px ring outside the key, 2px away from its edge.', 'The ring is the same on every part.'],
      ['Latched', 'With aria-pressed true a plastic key stays down by 3px as frosted grey glass, its word in primary ink at 4.5:1.', 'Only toggle keys latch. The orange key never turns to glass.'],
      ['Disabled', 'Flat, no shadow, at half opacity.', 'It cannot be pressed. A native disabled button also leaves the tab order, so say near the key why it is unavailable.'],
      ['Reduced motion', 'The key does not travel. Ink and colour still change on hover and press.', 'Someone who turned motion off still sees that the press landed.'],
      ['Forced colours', 'The key gets a border in the system button colour.', 'The shadow that shows the key’s edge is removed in that mode, so the border takes its place.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus to the key.', 'native button'],
      ['Keyboard', 'Enter', 'Runs the action as the key goes down.', 'native button'],
      ['Keyboard', 'Space', 'Presses the key, and runs the action when Space is released.', 'native button'],
      ['Pointer', 'Press and release', 'Drops at once, returns on the spring, runs on release.', 'native button'],
      ['Pointer', 'Press, then slide off', 'The key comes back up and nothing runs.', 'native button'],
      ['Touch', 'Tap', 'Same as a pointer press. The whole capsule is the target, at least 44px tall.', 'native button'],
      ['Screen reader', 'Read', 'Announced as a button with its word.', 'role button'],
    ],
    loading: (
      <>
        <p>Button has no loading state of its own. While a device takes time to answer, show the progress on the unit’s display and keep the key as it is.</p>
        <p>If pressing the key twice would start the action twice, disable it until the device answers, and print what is happening on the display, such as Starting. When the answer comes, the display changes and the key is enabled again. For an action that runs for minutes, such as a wash, use Progress on the unit and let the key change its word, for example from Start to Pause.</p>
      </>
    ),
    focus: (
      <>
        <p>Button is never focused on page load. In a dialog, focus goes to the first field, or to the plastic key when there is nothing to fill in.</p>
        <p>Focus moves to the main key only when the next step is plain and safe to take. A destructive key, such as Delete schedule, never gets focus first, so a stray Enter cannot run it.</p>
      </>
    ),
  },
  deepDive: {
    key: {
      purpose: (
        <>
          <p>The plastic key carries every action that is not the reason the unit exists. It spends no colour, so it never competes with the orange part.</p>
          <p>Most keys on a screen are plastic keys. They sit in rows under a display, at the end of a list item, and before the main key in a sheet. Their ink is the secondary grey at rest and turns primary on hover, so the word stays readable without drawing the eye.</p>
        </>
      ),
      context: <Unit><Stack direction="row" gap="sm"><Button>Schedule</Button><Button>History</Button></Stack></Unit>,
      practices: [
        'Use it for alternatives and for Cancel.',
        'Keep its label short enough to fit on one line in a unit.',
        'Use it for a destructive action outside a sheet too, and let the Dialog that follows carry the warning.',
        'Put plastic keys in the order people use them, the most used first.',
      ],
      pair: { do: <Button>Cancel</Button>, doNote: 'Cancel as a plastic key.', dont: <Button kind="primary">Cancel</Button>, dontNote: 'Cancel in orange reads as the main action.' },
    },
    primary: {
      purpose: (
        <>
          <p>The primary key is the one orange part of a unit that has no knob. It marks the action the unit exists for.</p>
          <p>Its ink is the dark ink for orange plastic, which keeps the word above 4.5 to 1. Its darker rim keeps the edge of the key visible against the warm body in light and in dark themes. On hover the orange moves one step lighter, and on press it drops like every other key.</p>
        </>
      ),
      context: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start wash</Button><Button>Schedule</Button></Stack></Unit>,
      practices: [
        'Use it once per unit.',
        'Leave it out when the unit already has an orange knob.',
        'Put it last in a row of keys in a dialog.',
        'Give it the verb of the task, so it reads as the answer to the question on the display.',
        'Keep it enabled whenever the action is possible, so the one orange part is never a dead one.',
      ],
      pair: { do: <Unit><Button kind="primary">Start</Button></Unit>, doNote: 'One orange key in the unit.', dont: <Unit><Stack direction="row" gap="sm"><Button kind="primary">Start</Button><Button kind="primary">Stop</Button></Stack></Unit>, dontNote: 'Two orange keys in the unit.' },
    },
  },
  modifiers: [
    {
      name: 'full',
      rules: <p>Stretches the key to the inner width of its unit. Use it for the single main action at the bottom of a sheet on a phone. A full key keeps its height, and a long word wraps inside it.</p>,
      pair: { do: <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><Button kind="primary" full>Start wash</Button></div>, doNote: 'One full-width main action.', dont: <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><Stack gap="sm"><Button full>Schedule</Button><Button full>History</Button><Button full>Settings</Button></Stack></div>, dontNote: 'A stack of full-width plastic keys reads like a menu. Use a list.' },
    },
    {
      name: 'disabled',
      rules: <p>The native disabled attribute. The key goes flat and fades to half opacity, and Tab skips it. Disable a key only for a short wait, such as while the device answers. When an action is unavailable for longer, keep the key enabled and let the unit explain why when it is pressed, or remove the key.</p>,
      pair: { do: <Unit><Stack gap="sm"><p className="flush">Door open. Close it to start.</p><Button kind="primary" disabled>Start wash</Button></Stack></Unit>, doNote: 'The unit says why the key cannot be pressed.', dont: <Unit><Button kind="primary" disabled>Start wash</Button></Unit>, dontNote: 'A faded key with no reason leaves people guessing.' },
    },
    {
      name: 'type',
      rules: <p>The native type attribute, button by default. Set type submit on the key that sends a form, so Enter in a field sends it too. Keep one submit key per form. Every other key in the form stays type button.</p>,
      pair: { do: <Stack direction="row" gap="sm"><Button>Cancel</Button><Button kind="primary" type="submit">Save</Button></Stack>, doNote: 'Only the main key sends the form.', dont: <Stack direction="row" gap="sm"><Button type="submit">Cancel</Button><Button kind="primary" type="submit">Save</Button></Stack>, dontNote: 'Two submit keys, so Cancel sends the form as well.' },
    },
  ],
  related: [
    ['/components/icon-button', 'IconButton', 'The action is an icon with no word.'],
    ['/components/switch', 'Switch', 'Something stays on or off.'],
    ['/components/segmented-control', 'SegmentedControl', 'One of a few modes.'],
    ['/components/chip', 'Chip', 'A filter or preset that latches and can be combined with others.'],
    ['/components/dialog', 'Dialog', 'The action needs a question answered first.'],
  ],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Button pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/', why: 'Keyboard and role expectations for a button.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why every key keeps a 44px target.' },
    { title: 'MDN · The button element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button', why: 'The type attribute and why a button inside a form submits it by default.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
