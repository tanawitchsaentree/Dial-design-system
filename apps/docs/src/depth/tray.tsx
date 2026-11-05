// Usage tab for Tray (component-depth.md U1–U14). The recess that gathers a unit's small keys.
import { Badge, Button, Card, Icon, IconButton, Stack, Tray } from 'dial-react';
import type { Depth } from './types';

const Prev = () => <IconButton label="Previous track"><Icon name="previous" /></IconButton>;
const Next = () => <IconButton label="Next track"><Icon name="next" /></IconButton>;
const Play = () => <IconButton label="Play" kind="primary" size="lg"><Icon name="play" /></IconButton>;
const Unit = ({ children }: { children: React.ReactNode }) => (
  <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))', maxInlineSize: '100%' }}>
    <Card padding="unit" wordmark="dial" model="player 2">
      <Stack direction="row" gap="md" align="center" style={{ justifyContent: 'space-between' }}>{children}</Stack>
    </Card>
  </div>
);

export const TRAY: Depth = {
  overview: (
    <>
      <p>Tray is a recess pressed into a unit that gathers its small keys, such as previous and next, a mode key and a lamp. The keys stand up from the tray’s floor, and the unit’s one big orange part stays outside it on the open plastic, where it stands alone.</p>
      <p>The tray is the same kind of hole as the display window. It has the well’s inverse light, and its corner nests in the unit the way the window’s does, so the outer radius minus the body’s inset. Inside a Card it reads the card’s radius and inset on its own. Its inset is the same on every side, and so is the gap between keys.</p>
      <p>A tray never shrinks what it holds. Each IconButton and Button keeps its 44px, and on a narrow unit the tray wraps to a second row instead.</p>
    </>
  ),
  whenToUse: [
    'To gather two to five small keys of one unit, so its main control stands alone.',
    'For transport keys around a play key, or mode keys beside a knob.',
    'For a lamp that belongs with those keys, such as Live or Stereo.',
  ],
  whenNot: [
    { situation: 'Choosing one of a few modes, one at a time', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'The unit’s main key', to: '/components/icon-button', label: 'IconButton, primary' },
    { situation: 'A row of actions at the bottom of a card', to: '/components/card', label: 'Card footer' },
  ],
  variants: { na: 'Tray has one look, a recess with a nested corner. What it holds is up to you.' },
  anatomy: {
    render: <Tray label="Playback"><Prev /><Next /><Button>Shuffle</Button><Badge tone="positive">Live</Badge></Tray>,
    parts: [
      { part: 'Tray', selector: '[data-component="Tray"]', what: 'A recess with the well’s inverse light and an 8px inset on every side.' },
      { part: 'Small keys', selector: '[data-component="Tray"] > button', what: 'IconButtons and Buttons at their own 44px size, 8px apart.' },
      { part: 'Lamp', selector: '[data-component="Tray"] > [data-component="Badge"]', what: 'Badge’s lamp and word, printed at the tray’s end.' },
    ],
  },
  sizes: { na: 'Tray has no sizes. It is as tall as its keys plus the inset, and as wide as its keys or its column.' },
  emphasis: {
    text: <p>A tray holds only the quiet keys. The unit’s one orange part never goes in it, because the point of the tray is to let that part stand alone. One tray per unit is the rule; two trays split the keys into two groups to learn.</p>,
    pair: {
      do: <Unit><Tray label="Playback"><Prev /><Next /></Tray><Play /></Unit>,
      doNote: 'Small keys in the tray, the play key alone.',
      dont: <Unit><Tray label="Playback"><Prev /><Play /><Next /></Tray></Unit>,
      dontNote: 'The orange key sunk in the tray with the small ones.',
    },
  },
  placement: {
    rows: [['Beside the loud part', 'On the row with the knob or play key, at the start.'], ['Under the display', 'A row of mode keys under the window, with the knob below.'], ['Alone on a small unit', 'When the unit has no loud part, such as a remote.']],
    examples: [{ title: 'Beside the play key', render: <Unit><Tray label="Playback"><Prev /><Next /><Badge tone="positive">Live</Badge></Tray><Play /></Unit> }],
  },
  combinations: {
    good: [['Tray + IconButton', 'Round small keys such as previous and next.'], ['Tray + Button', 'A word key such as Shuffle or Eco.'], ['Tray + Badge', 'A lamp that belongs with the keys.']],
    avoid: [{ title: 'a tray with one key', why: 'One key gains nothing from a recess around it. Put a single small key straight on the plastic.', render: <Tray label="Repeat"><Button>Repeat</Button></Tray> }],
  },
  content: {
    formula: <p>Name the tray for what its keys do together, such as Playback, Heater keys or Radio keys. The name is read once when focus enters the tray. Each key keeps its own name.</p>,
    pair: {
      do: <Tray label="Playback"><Prev /><Next /></Tray>,
      doNote: 'Named Playback, so the group is heard as one.',
      dont: <Tray label="Buttons"><Prev /><Next /></Tray>,
      dontNote: 'Named Buttons, which says nothing.',
    },
    overflow: { text: 'When the keys do not fit, the tray wraps to a second row with the same inset and gap. No key gets smaller.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-narrow))' }}><Tray label="Radio keys"><Prev /><Next /><Button>FM</Button><Button>DAB</Button></Tray></div> },
    rtl: { text: 'In right-to-left languages the keys run from the right. Previous and next keep their meaning, so swap their glyphs if your icons point.', render: <div dir="rtl"><Tray label="التشغيل"><Next /><Prev /><Button>عشوائي</Button></Tray></div> },
    expansion: { text: 'German and Finnish key words run about 30% longer. The word keys grow and the tray grows with them, or wraps.', render: <Tray label="Wiedergabe"><Prev /><Next /><Button>Zufallswiedergabe</Button></Tray> },
  },
  behaviours: {
    states: [
      ['Default', 'A recess with keys standing up from its floor.', 'A group named by label.'],
      ['Key pressed', 'The key drops into the tray at once and returns on the spring.', 'The key’s own press, unchanged.'],
      ['Key disabled', 'The key lies flat on the tray’s floor.', 'The key is disabled.'],
      ['Wrapped', 'A second row with the same inset and gap.', 'Reading order stays the same.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves through the keys in the tray one by one, as everywhere else.', 'buttons in a group'],
      ['Keyboard', 'Enter or Space', 'Presses the focused key.', 'button'],
      ['Pointer', 'Press a key', 'Presses it; the tray itself does nothing.', 'click'],
      ['Screen reader', 'Enter the tray', 'The group’s name is read once, then each key by its own name.', 'role group, aria-label'],
    ],
    loading: <p>Tray has no loading state. While the unit loads, disable its keys; the tray keeps its size.</p>,
    focus: <p>A tray is not focusable itself. Focus goes straight to its first key, and the tray’s name is read with it.</p>,
  },
  deepDive: { na: 'Tray has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'label',
      rules: <p>Required. The name of the group, read when focus enters it. Use what the keys do together.</p>,
      pair: { do: <Tray label="Heater keys"><Button>Eco</Button><Button>Boost</Button></Tray>, doNote: 'Heater keys, named for what they set.', dont: <Tray label="Group 1"><Button>Eco</Button><Button>Boost</Button></Tray>, dontNote: 'A number, not a name.' },
    },
  ],
  related: [['/components/icon-button', 'IconButton', 'The round small keys a tray holds.'], ['/components/device-card', 'DeviceCard', 'The unit around the tray.'], ['/components/segmented-control', 'SegmentedControl', 'When the keys pick one of a few.']],
  references: [
    { title: 'WAI-ARIA · group role', url: 'https://www.w3.org/TR/wai-aria-1.2/#group', why: 'A named set of related controls.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the tray never shrinks its keys.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
