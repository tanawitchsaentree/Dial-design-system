// Usage tab for DeviceCard (component-depth.md U1–U14). DeviceCard is one appliance on the screen, built from anchor A.
import { DeviceCard } from 'dial-react';
import type { Depth } from './types';

const W = ({ children, o, w = 340 }: { children: React.ReactNode; o?: boolean; w?: number }) => <div data-overflow-demo={o ? '' : undefined} style={{ inlineSize: w }}>{children}</div>;
const radio = { label: 'Radio', value: '88.6', unit: 'MHz', digits: 4 };
const band = [{ label: 'FM', pressed: true }, { label: 'AM', pressed: false }];

export const DEVICE_CARD: Depth = {
  overview: (
    <>
      <p>DeviceCard is one appliance on the screen, such as a radio, a thermostat or a lamp. It is a Card with the system’s own parts mounted on it. The display runs across the top and says what the device is doing now. Below it sits the one orange part, the knob you turn, and beside that the plain keys and a small grille. A ruler fader can run across the bottom. The wordmark and the model are printed on the bottom edge.</p>
      <p>The layout comes from anchor A, the card picked at the start of the system. The knob is 0.36 of the card’s short side. On a narrow screen the parts stack in one column instead of shrinking, so every key, the knob and the fader keep a 44px target.</p>
    </>
  ),
  whenToUse: ['To show one device with its state and the controls that change it.', 'For a device with one main value, such as a temperature, a station or a volume.', 'For a device with no knob, whose main action is one key, such as a lamp.'],
  whenNot: [
    { situation: 'A unit with text and keys, but no display or knob', to: '/components/card', label: 'Card' },
    { situation: 'Only the main value, on its own', to: '/components/rotary', label: 'Rotary' },
    { situation: 'Only the state, read and not changed', to: '/components/display', label: 'Display' },
  ],
  variants: { na: 'DeviceCard has no variant prop. Its layout prop moves the parts; it is covered under Placement and Modifiers.' },
  anatomy: {
    render: <DeviceCard model="tuner 1" display={radio} knob={{ label: 'Tuning', defaultValue: 2 }} keysLabel="Band" keys={band} meter={{ label: 'Volume', value: 4, cols: 10, rows: 4 }} fader={{ label: 'Volume', defaultValue: 4, step: 1 }} />,
    parts: [
      { part: 'Body', selector: '[data-component="DeviceCard"]', what: 'A Card with the unit inset, 0.077 of the short side.' },
      { part: 'Display', selector: '[data-component="DeviceCard"] [data-component="Display"]', what: 'The window across the top that says the state.' },
      { part: 'Knob', selector: '[data-component="DeviceCard"] [data-component="Rotary"]', what: 'The one orange part, 0.36 of the short side.' },
      { part: 'Keys', selector: '[data-component="DeviceCard"] [role="group"]', what: 'Plastic keys for modes, bands or transport.' },
      { part: 'Meter', selector: '[data-component="DeviceCard"] [data-component="Grille"]', what: 'A grille whose holes show a level.' },
      { part: 'Fader', selector: '[data-component="DeviceCard"] [data-component="Slider"]', what: 'A ruler fader across the body for a second amount.' },
    ],
    perVariant: 'In layout tall the parts sit in one column. In compact the knob moves to the right of the display.',
  },
  sizes: { na: 'DeviceCard has no size prop. It fills its column up to a width set by the layout, and its parts follow the short side.' },
  emphasis: {
    text: <p>One orange part per device. With a knob, the knob is orange and every key is plastic. With no knob, the primary key is orange. If you pass both, the primary key is drawn as a plastic key.</p>,
    pair: {
      do: <W><DeviceCard model="wash 1" display={{ label: 'Washer', value: '38', unit: 'min', digits: 3 }} knob={{ label: 'Programme', defaultValue: 3 }} keys={[{ label: 'Start' }]} /></W>,
      doNote: 'The knob is orange; Start is a plastic key.',
      dont: <W><DeviceCard model="wash 1" display={{ label: 'Washer', value: '38', unit: 'min', digits: 3 }} keys={[{ label: 'Start' }, { label: 'Stop' }, { label: 'Pause' }, { label: 'Spin' }]} /></W>,
      dontNote: 'No orange part at all, so nothing says which key the device is for.',
    },
  },
  placement: {
    rows: [
      ['layout a (the default)', 'Most devices. The display is on top, the knob left, keys and grille right, and the fader across.'],
      ['layout tall', 'A device on a wall or in a narrow column. It uses one column, with the knob centred under the display.'],
      ['layout compact', 'A wide slot. The display and keys sit left, and the knob or main key sits right of the display.'],
      ['A 375px phone', 'Any layout fits; below the two-column width the parts take one row each.'],
    ],
    examples: [
      { title: 'layout tall', render: <DeviceCard layout="tall" model="thermostat 1" display={{ label: 'Thermostat', value: '21.5', unit: '°C', digits: 3 }} knob={{ label: 'Temperature', min: 16, max: 26, defaultValue: 22 }} keys={[{ label: 'Eco' }, { label: 'Away' }]} keysLabel="Mode" /> },
      { title: 'layout compact', render: <DeviceCard layout="compact" model="lamp 1" display={{ label: 'Lamp', value: '70', unit: '%', digits: 3 }} primary={{ label: 'Turn off' }} fader={{ label: 'Brightness', min: 0, max: 100, step: 10, defaultValue: 70 }} /> },
    ],
  },
  combinations: {
    good: [['Display + Rotary + keys', 'A device with one main value and a few modes.'], ['Display + primary key + fader', 'A device with no knob, such as a lamp.'], ['Display + Rotary + Grille', 'A value you set and a level you watch, such as a heater.']],
    avoid: [{ title: 'a grille with no reading', why: 'A grille that shows nothing is decoration. Leave meter out when the device has no level to show.', render: <W><DeviceCard model="tuner 1" display={radio} knob={{ label: 'Tuning', defaultValue: 2 }} meter={{ label: 'Nothing', value: 0, cols: 10, rows: 4 }} /></W> }],
  },
  content: {
    formula: <p>Name the device in the display label (<em>Thermostat</em>), print the model in lowercase with a number (<em>thermostat 1</em>), and name each part by what it sets, such as <em>Temperature</em>, <em>Volume</em> or <em>Band</em>.</p>,
    pair: {
      do: <W><DeviceCard model="lamp 1" display={{ label: 'Lamp', value: '70', unit: '%', digits: 3 }} primary={{ label: 'Turn off' }} /></W>,
      doNote: 'The key says what it does.',
      dont: <W><DeviceCard model="lamp 1" display={{ label: 'Lamp', value: '70', unit: '%', digits: 3 }} primary={{ label: 'Toggle' }} /></W>,
      dontNote: 'Toggle does not say whether the lamp goes on or off.',
    },
    overflow: { text: 'A long detail line wraps inside the display, and long key labels wrap onto a second row of keys. The knob keeps its place.', render: <W o><DeviceCard model="wash 1" display={{ label: 'Washer', value: '38', unit: 'min', detail: 'Cotton, 40 degrees, extra rinse, spin 1200', digits: 3 }} knob={{ label: 'Programme', defaultValue: 3 }} keys={[{ label: 'Pre-wash' }, { label: 'Extra rinse' }]} /></W> },
    rtl: { text: 'In right-to-left languages the knob moves to the right and the keys to the left. The wordmark moves to the bottom right.', render: <div dir="rtl"><W><DeviceCard model="tuner 1" display={radio} knob={{ label: 'الموجة', defaultValue: 2 }} keys={band} /></W></div> },
    expansion: { text: 'German and Finnish run about 30% longer. Key labels wrap onto a second row; the body grows taller and never wider.', render: <W><DeviceCard model="thermostat 1" display={{ label: 'Thermostat', value: '21.5', unit: '°C', digits: 3 }} knob={{ label: 'Temperatur', defaultValue: 5 }} keys={[{ label: 'Sparbetrieb' }, { label: 'Abwesend' }]} /></W> },
  },
  behaviours: {
    states: [
      ['Rest', 'The body sits 3px above the page, like anchor A.', 'The parts keep their own states, such as pressed keys and a turning knob.'],
      ['Narrow', 'Below the two-column width every part takes one row.', 'No part draws below 44px.'],
      ['No knob', 'The primary key takes the knob’s place and is orange.', 'With a knob, the primary key is plastic.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Goes to the knob or the primary key first, then the keys, then the fader.', 'source order'],
      ['Keyboard', 'Arrow keys', 'Turn the knob or move the fader one step.', 'Rotary, Slider'],
      ['Pointer', 'Drag the knob, press a key', 'Each part answers like its own component.', 'Rotary, Button'],
      ['Screen reader', 'Read', 'A region named by the display label. The display is announced when its reading changes.', 'role region + status'],
    ],
    loading: <p>DeviceCard has no loading state. While the device answers, the display shows its last reading and the detail line says what is happening.</p>,
    focus: <p>DeviceCard never takes focus itself. The first stop inside it is the knob, or the primary key when there is no knob.</p>,
  },
  deepDive: { na: 'DeviceCard has no variant prop. Its three layouts are covered under Placement and Modifiers.' },
  modifiers: [
    {
      name: 'layout',
      rules: <p>a is the default and follows anchor A. Use tall for a device with no fader in a narrow column, and compact for a wide slot.</p>,
      pair: { do: <DeviceCard layout="compact" model="speaker 1" display={{ kind: 'oled', label: 'Speaker', value: 'So What', detail: 'Playing' }} knob={{ label: 'Volume', defaultValue: 5 }} />, doNote: 'compact in a wide slot.', dont: <W w={260}><DeviceCard layout="compact" model="speaker 1" display={{ kind: 'oled', label: 'Speaker', value: 'So What' }} knob={{ label: 'Volume', defaultValue: 5 }} /></W>, dontNote: 'compact in a narrow slot falls back to one column; pick tall.' },
    },
    {
      name: 'primary',
      rules: <p>The main key when the device has no knob. Give it a verb. Next to a knob it is drawn as a plastic key.</p>,
      pair: { do: <W><DeviceCard model="lamp 1" display={{ label: 'Lamp', value: '70', unit: '%', digits: 3 }} primary={{ label: 'Turn off' }} /></W>, doNote: 'One orange key, no knob.', dont: <W><DeviceCard model="lamp 1" display={{ label: 'Lamp', value: '70', unit: '%', digits: 3 }} knob={{ label: 'Brightness', defaultValue: 7 }} primary={{ label: 'Turn off' }} /></W>, dontNote: 'A knob and a main key: the key loses its orange.' },
    },
    {
      name: 'meter',
      rules: <p>A grille for a level that changes, such as volume or heat. Leave it out when nothing is measured.</p>,
      pair: { do: <W><DeviceCard model="heater 1" display={{ label: 'Heater', value: '3', digits: 1 }} knob={{ label: 'Power', defaultValue: 3 }} meter={{ label: 'Heat output', value: 6, cols: 10, rows: 3 }} /></W>, doNote: 'The grille shows the heat output.', dont: <W><DeviceCard model="clock 1" display={{ label: 'Clock', value: '0645', digits: 4 }} knob={{ label: 'Alarm', defaultValue: 3 }} meter={{ label: 'Pattern', value: 10, cols: 10, rows: 3 }} /></W>, dontNote: 'A full grille that measures nothing.' },
    },
    {
      name: 'fader',
      rules: <p>A ruler fader across the body for a second amount. The main value stays on the knob.</p>,
      pair: { do: <W><DeviceCard model="tuner 1" display={radio} knob={{ label: 'Tuning', defaultValue: 2 }} fader={{ label: 'Volume', defaultValue: 4, step: 1 }} /></W>, doNote: 'Tuning on the knob, volume on the fader.', dont: <W><DeviceCard model="tuner 1" display={radio} fader={{ label: 'Tuning', defaultValue: 2, step: 1 }} /></W>, dontNote: 'The main value on the fader, and no orange part.' },
    },
    {
      name: 'keys',
      rules: <p>Plastic keys for modes and transport. A key with an icon is round; give every key a label in words.</p>,
      pair: { do: <W><DeviceCard model="tuner 1" display={radio} knob={{ label: 'Tuning', defaultValue: 2 }} keysLabel="Band" keys={band} /></W>, doNote: 'Two keys, named as a group.', dont: <W><DeviceCard model="tuner 1" display={radio} knob={{ label: 'Tuning', defaultValue: 2 }} keys={[{ label: 'FM' }, { label: 'AM' }, { label: 'LW' }, { label: 'SW' }, { label: 'DAB' }, { label: 'Aux' }]} /></W>, dontNote: 'Six keys crowd the knob. Move the rest to a settings screen.' },
    },
  ],
  related: [['/components/card', 'Card', 'A unit with no display or knob.'], ['/components/rotary', 'Rotary', 'Only the knob, in your own layout.'], ['/components/display', 'Display', 'Only the window that says the state.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Slider pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/', why: 'The keyboard map of the knob and the fader.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why every part keeps a 44px target on a phone.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
