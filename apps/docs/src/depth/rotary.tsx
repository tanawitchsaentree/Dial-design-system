// Usage tab for Rotary (component-depth.md U1–U14). Rotary is the knob, dial's signature control.
import { Button, Rotary, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const temp = (v: number) => `${v} °C`;

export const ROTARY: Depth = {
  overview: (
    <>
      <p>Rotary is the knob. It sets the one value a unit exists for, such as the temperature of a heater, the station of a radio or the time on an oven. It is a flat disc with one printed index line, over a ring of ticks that marks every step across 270 degrees.</p>
      <p>The primary knob is the unit’s one orange part. You turn it by dragging up or down, or with the arrow keys, and it settles into the nearest step on a spring. Its value and its label are printed under it.</p>
    </>
  ),
  whenToUse: ['For the main setting of a device, such as a temperature or a station.', 'For a value with clear steps that people turn through, such as a timer.', 'As a body-coloured key knob for a second dial on the same unit.'],
  whenNot: [
    { situation: 'A secondary amount along a long range', to: '/components/slider', label: 'Slider' },
    { situation: 'Starting or stopping something', to: '/components/button', label: 'Button' },
    { situation: 'Turning something on or off', to: '/components/switch', label: 'Switch' },
  ],
  variants: {
    primary: { purpose: 'The unit’s main setting. A flat orange disc with a darker rim.', pairing: 'Once per unit. Pair it with plastic keys, faders and key knobs.' },
    key: { purpose: 'A secondary dial. A body-coloured disc with a grey rim and grey printing.', pairing: 'Beside a primary knob, or alone when the unit has an orange key.' },
  },
  anatomy: {
    render: <Rotary size="lg" label="Temperature" min={16} max={26} defaultValue={21} formatValue={temp} />,
    parts: [
      { part: 'Tick ring', selector: '[data-component="Rotary"] > div:first-child > span', what: 'One printed tick per step across 270 degrees, on the case around the disc.' },
      { part: 'Disc', selector: '[data-component="Rotary"] [role="slider"]', what: 'A flat raised disc with a rim, and a short shadow down and to the right.' },
      { part: 'Index line', selector: '[data-component="Rotary"] [role="slider"] span', what: 'One ink line from the rim inward. It points at the current step.' },
      { part: 'Value', selector: '[data-component="Rotary"] > span:nth-child(2)', what: 'The current value with its unit, in tabular figures.' },
      { part: 'Label', selector: '[data-component="Rotary"] > span:last-child', what: 'The printed name of the knob. It is also the name a screen reader reads.' },
    ],
    perVariant: 'The primary disc is orange with a darker orange rim and dark ink. The key disc is plastic with a grey rim and grey ink.',
  },
  sizes: {
    sm: { use: '44px across. A secondary dial in a tight unit or a row of settings.', pairs: '44px keys and switches.' },
    md: { use: '72px across. The default for a knob in a card.', pairs: 'A display and a fader in a card of about 200px.' },
    lg: { use: '108px across, 0.36 of a 300px unit. The main knob of a device card.', pairs: 'A wide display on top and keys beside it, as on anchor card A.' },
  },
  emphasis: {
    text: <p>One orange part per unit. If the unit has a primary knob, every other control on it is plastic, and that means keys, faders and key knobs. Never put an orange key next to an orange knob.</p>,
    pair: {
      do: <Unit><Stack direction="row" gap="xl" align="end"><Rotary label="Temperature" min={16} max={26} defaultValue={21} formatValue={temp} /><Rotary kind="key" size="sm" label="Fan" min={0} max={5} defaultValue={2} /></Stack></Unit>,
      doNote: 'One orange knob and a key knob beside it.',
      dont: <Unit><Stack direction="row" gap="xl" align="end"><Rotary label="Temperature" min={16} max={26} defaultValue={21} formatValue={temp} /><Rotary label="Fan" min={0} max={5} defaultValue={2} /></Stack></Unit>,
      dontNote: 'Two orange knobs, and neither reads as the main setting.',
    },
  },
  placement: {
    rows: [['Under the display, to the left', 'Where the hand expects the main control, as on anchor card A.'], ['Centred in a small unit', 'When the knob is the only control, under its display.']],
    examples: [{ title: 'Under a display', render: <Unit><Stack gap="md" align="center"><p className="flush">Heating · 21 °C</p><Rotary unitSide={300} label="Set temperature" min={16} max={26} defaultValue={21} formatValue={temp} /></Stack></Unit> }],
  },
  combinations: {
    good: [['Primary Rotary + Slider', 'The knob for the main setting, a plastic fader for a second amount.'], ['Primary Rotary + key Buttons', 'The knob sets the value, plastic keys pick the mode.']],
    avoid: [{ title: 'an orange knob next to an orange key', why: 'Two orange parts in one unit split attention, and the person does not know where to start.', render: <Unit><Stack direction="row" gap="xl" align="center"><Rotary size="sm" label="Timer" max={60} step={5} defaultValue={20} /><Button kind="primary">Start</Button></Stack></Unit> }],
  },
  content: {
    formula: <p>The label names the setting, as in <em>Temperature</em>, <em>Station</em> or <em>Timer</em>. The value carries the unit through <code>formatValue</code>, as in <em>21 °C</em> or <em>20 min</em>.</p>,
    pair: {
      do: <Rotary size="sm" label="Timer" max={60} step={5} defaultValue={20} formatValue={(v) => `${v} min`} />, doNote: 'The label names it and the value has its unit.',
      dont: <Rotary size="sm" label="Turn" max={60} step={5} defaultValue={20} />, dontNote: 'Turn says nothing, and 20 has no unit.',
    },
    overflow: { text: 'A long label wraps under the knob. The knob keeps its size and its place.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-narrow))' }}><Rotary size="md" label="Temperature in the guest room" min={16} max={26} defaultValue={20} formatValue={temp} /></div> },
    rtl: { text: 'In right-to-left languages the knob still turns clockwise to go up, like a knob on any device. Only the text around it follows the direction.', render: <div dir="rtl"><Rotary size="md" label="درجة الحرارة" min={16} max={26} defaultValue={20} formatValue={temp} /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The label wraps under the knob and the disc does not move.', render: <Rotary size="md" label="Raumtemperatur" min={16} max={26} defaultValue={20} formatValue={temp} /> },
  },
  behaviours: {
    states: [
      ['Rest', 'The index line points at the current step.', 'The value under the knob says the step.'],
      ['Hover', 'The orange moves one step lighter. On a key knob, the index darkens.', 'The knob never lifts or grows.'],
      ['Turning', 'The disc follows the pointer as it moves up or down.', 'The value changes as the index passes each tick.'],
      ['Released', 'The disc settles into the nearest step on the spring, in about 245ms.', 'With reduced motion it jumps there at once.'],
      ['Focus', 'A dark 2px ring with a gap around the disc.', 'The same ring as on every part.'],
      ['Disabled', 'The disc loses its height and fades to half.', 'It leaves the tab order and does not turn.'],
    ],
    interactions: [
      ['Keyboard', 'Arrow keys', 'Turn one step. Up and right go up.', 'role slider'],
      ['Keyboard', 'Page Up / Page Down', 'Turn a tenth of the range, at least two steps.', 'role slider'],
      ['Keyboard', 'Home / End', 'Turn to the first or the last step.', 'role slider'],
      ['Pointer', 'Press and drag up or down', 'Up turns clockwise. Release settles into the nearest step.', 'pointer capture'],
      ['Pointer', 'Press on the tick ring', 'Turns the knob straight to that step, with no drag.', 'pointer'],
      ['Screen reader', 'Read', 'Announced as a slider with its label, its value text and its range.', 'aria-valuetext'],
    ],
    loading: <p>Rotary has no loading state. While the device reaches the new value, show the progress on the unit’s display and leave the knob where the person turned it.</p>,
    focus: <p>Rotary is never focused on page load. It comes first in the unit’s tab order after the display, because it is the main control.</p>,
  },
  deepDive: {
    primary: {
      purpose: <p>The primary knob is the reason the unit exists. It is the largest round part and the only orange one, so people find it first.</p>,
      context: <Unit><Stack gap="md" align="center"><p className="flush">Oven · 180 °C</p><Rotary size="lg" label="Temperature" min={50} max={250} step={10} defaultValue={180} formatValue={(v) => `${v} °C`} /></Stack></Unit>,
      practices: ['Use it once per unit.', 'Give it the largest clear area in the unit.', 'Leave out orange keys on the same unit.'],
      pair: { do: <Unit><Rotary label="Station" min={88} max={108} step={2} defaultValue={96} formatValue={(v) => `${v} MHz`} /></Unit>, doNote: 'One orange knob for the station.', dont: <Unit><Stack direction="row" gap="xl" align="end"><Rotary size="sm" label="Station" min={88} max={108} step={2} defaultValue={96} /><Rotary size="sm" label="Volume" defaultValue={4} /></Stack></Unit>, dontNote: 'Two small orange knobs of the same weight.' },
    },
    key: {
      purpose: <p>The key knob is a second dial on the same unit. It turns the same way as the primary knob, but spends no colour.</p>,
      context: <Unit><Stack direction="row" gap="xl" align="end"><Rotary label="Temperature" min={16} max={26} defaultValue={21} formatValue={temp} /><Rotary kind="key" size="sm" label="Fan" min={0} max={5} defaultValue={2} /></Stack></Unit>,
      practices: ['Make it smaller than the primary knob.', 'Use it for a setting with few steps, such as fan speed.'],
      pair: { do: <Rotary kind="key" size="sm" label="Fan" min={0} max={5} defaultValue={2} />, doNote: 'A small key knob for the fan.', dont: <Rotary kind="key" size="lg" label="Fan" min={0} max={5} defaultValue={2} />, dontNote: 'A key knob larger than the main one takes its place.' },
    },
  },
  modifiers: [
    {
      name: 'unitSide',
      rules: <p>Sizes the knob from the unit it sits on. The diameter is 0.36 of the unit’s short side, as on anchor card A. <code>diameter</code> sets it in pixels instead. Neither goes below 44px.</p>,
      pair: { do: <Unit><Rotary unitSide={240} label="Temperature" min={16} max={26} defaultValue={21} formatValue={temp} /></Unit>, doNote: 'The knob takes 0.36 of a 240px unit.', dont: <Unit><Rotary diameter={200} label="Temperature" min={16} max={26} defaultValue={21} formatValue={temp} /></Unit>, dontNote: 'A knob that fills the unit swells into a toy.' },
    },
  ],
  related: [['/components/slider', 'Slider', 'A secondary amount along a range.'], ['/components/button', 'Button', 'An action rather than a value.'], ['/components/switch', 'Switch', 'Only on and off.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Slider pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/', why: 'A knob is announced and driven as a slider.' },
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why a press on the tick ring also turns the knob, with no drag.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
