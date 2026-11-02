// Usage tab for Slider (component-depth.md U1–U14). Slider is the fader on the face of an appliance.
import { Rotary, Slider, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const SLIDER: Depth = {
  overview: (
    <>
      <p>Slider sets an amount along a range, such as volume, brightness or fan speed. It is a fader. A frosted glass cap rides in a narrow groove, with a ruler printed above it. You drag the cap, or use the arrow keys, and it settles into the nearest step on a spring.</p>
      <p>The cap is the one part of the fader made of glass, dial’s only accent material. Its tint comes from what the value is. A heating setpoint takes the warm amber range, a cooling setpoint the cool steel range, and everything else the neutral ink grey. The groove behind the cap is lit in the same tint, from the start up to the cap, so the eye finds the cap and the amount at once. The tint stays close to the plastic and is never a second orange.</p>
      <p>The fader is never orange. On a dial unit, the orange part is the knob. The fader is the quiet control next to it, so the cap and the groove stay plastic and ink.</p>
    </>
  ),
  whenToUse: ['To set an amount between two ends, such as volume or brightness.', 'When the person should see where the value sits in the whole range.', 'For a secondary amount on a unit whose main control is a knob.'],
  whenNot: [
    { situation: 'The main control of the unit, such as the temperature of a heater', to: '/components/rotary', label: 'Rotary' },
    { situation: 'Turning something on or off', to: '/components/switch', label: 'Switch' },
    { situation: 'Picking one of two to five named modes', to: '/components/segmented-control', label: 'SegmentedControl' },
  ],
  variants: { na: 'Slider has one look, a glass cap in a recessed groove. The tint, the numerals and the steps are options, covered under Modifiers.' },
  anatomy: {
    render: <Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />,
    parts: [
      { part: 'Label', selector: '[data-component="Slider"] > div:first-child > span:first-child', what: 'The printed name, above the start of the groove.' },
      { part: 'Value', selector: '[data-component="Slider"] > div:first-child > span:last-child', what: 'The current value, above the end of the groove, with tabular figures.' },
      { part: 'Ruler', selector: '[data-component="Slider"] [role="slider"] > div:first-child', what: 'One printed tick per step. The ends and the middle are darker.' },
      { part: 'Groove', selector: '[data-component="Slider"] [role="slider"] > div:nth-child(2)', what: 'A narrow slot recessed into the body. The light falls into it from the top left.' },
      { part: 'Cap', selector: '[data-component="Slider"] [role="slider"] > div:last-child', what: 'A raised cap of frosted glass in the value’s tint, with one ink line. The groove light shows through it, and it casts a short shadow down and to the right.' },
      { part: 'Numerals', selector: '[data-component="Slider"] > div:last-child', what: 'With scale, the ruler values are printed under the groove in the smallest size.' },
    ],
  },
  sizes: { na: 'Slider has one size. The track is 44px tall and as long as its column, and never shorter than 220px.' },
  emphasis: {
    text: <p>A fader is a quiet control. It never takes the orange. When a unit has a knob, the knob is the loud part and the fader sits beside or below it.</p>,
    pair: {
      do: <Unit><Stack gap="md" align="center"><Rotary label="Temperature" min={16} max={26} defaultValue={21} formatValue={(v) => `${v} °C`} /><Slider label="Fan" min={0} max={5} step={1} defaultValue={2} /></Stack></Unit>,
      doNote: 'An orange knob for the main setting and a plastic fader for the fan.',
      dont: <Unit><Stack gap="md"><Slider label="Temperature" min={16} max={26} step={1} defaultValue={21} /><Slider label="Fan" min={0} max={5} step={1} defaultValue={2} /><Slider label="Swing" min={0} max={5} step={1} defaultValue={1} /></Stack></Unit>,
      dontNote: 'Three faders of the same weight, and nothing says which one matters most.',
    },
  },
  placement: {
    rows: [['Bottom of a unit, across its width', 'The usual place, as on the reference radio, under the display and the knob.'], ['A row in a settings sheet', 'One fader per row, with its label above it.']],
    examples: [{ title: 'Under a display', render: <Unit><Stack gap="md"><p className="flush">Radio · 96.0 MHz</p><Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale /></Stack></Unit> }],
  },
  combinations: {
    good: [['Rotary + Slider', 'The knob for the main setting, the fader for a secondary amount.'], ['Slider + Display', 'The display says the value in large digits while the fader sets it.']],
    avoid: [{ title: 'a fader as the only control for an on and off setting', why: 'An amount with two values is a switch. A fader makes the person aim for the ends.', render: <Unit><Slider label="Lamp" min={0} max={1} step={1} defaultValue={1} scale /></Unit> }],
  },
  content: {
    formula: <p>Name the amount the fader sets, as in <em>Volume</em>, <em>Brightness</em> or <em>Fan speed</em>, and leave verbs out. Put the unit in <code>formatValue</code> and keep it out of the label.</p>,
    pair: {
      do: <Slider label="Brightness" min={0} max={100} step={10} defaultValue={60} formatValue={(v) => `${v} %`} />, doNote: 'The label names the amount and the value carries the unit.',
      dont: <Slider label="Drag to change the brightness in percent" min={0} max={100} step={10} defaultValue={60} />, dontNote: 'An instruction as the label, with the unit buried in it.',
    },
    overflow: { text: 'A long label wraps above the groove and the value stays at the end. The track keeps its length.', render: <div data-overflow-demo="" style={{ inlineSize: 240 }}><Slider label="Brightness of the lamp above the dining table" min={0} max={10} step={1} defaultValue={6} /></div> },
    rtl: { text: 'In right-to-left languages the groove starts on the right. The lowest value is on the right and the arrow keys follow the direction of the groove.', render: <div dir="rtl"><Slider label="مستوى الصوت" min={0} max={10} step={1} defaultValue={3} scale /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The label wraps and the groove does not change.', render: <Slider label="Lautstärke der Lautsprecher" min={0} max={10} step={1} defaultValue={5} /> },
  },
  behaviours: {
    states: [
      ['Rest', 'The cap sits on its step, raised by its height.', 'The value above the groove says the step.'],
      ['Hover', 'The ink line on the cap darkens one step.', 'The cap never lifts or grows.'],
      ['Dragging', 'The cap follows the pointer along the groove.', 'The value changes as it passes each step.'],
      ['Released', 'The cap settles into the nearest step on the spring, in about 245ms.', 'With reduced motion it jumps there at once.'],
      ['Focus', 'A dark 2px ring around the whole track.', 'The same ring as on every part.'],
      ['Disabled', 'The cap loses its height and the fader fades to half.', 'It leaves the tab order and does not move.'],
    ],
    interactions: [
      ['Keyboard', 'Arrow keys', 'Move one step.', 'role slider'],
      ['Keyboard', 'Page Up / Page Down', 'Move a tenth of the range, at least two steps.', 'role slider'],
      ['Keyboard', 'Home / End', 'Go to the lowest or the highest value.', 'role slider'],
      ['Pointer', 'Press, drag, release', 'The cap follows the pointer and settles into the nearest step.', 'pointer capture'],
      ['Screen reader', 'Read', 'Announced as a slider with its label, its value text, and its range.', 'aria-valuetext'],
    ],
    loading: <p>Slider has no loading state. If the device takes time to apply the value, say so on the unit’s display and keep the cap where the person left it.</p>,
    focus: <p>Slider is never focused on page load. Pressing the track focuses it, so the arrow keys work right after a drag.</p>,
  },
  deepDive: { na: 'Slider has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'scale',
      rules: <p>Prints the ruler’s numerals under the groove, as on a radio. Use it when the numbers mean something to the person, such as a volume from 0 to 10. Leave it out when only the position matters.</p>,
      pair: { do: <Slider label="Volume" min={0} max={10} step={1} defaultValue={4} scale />, doNote: 'Numerals on a scale people know.', dont: <Slider label="Warmth" min={0} max={1} step={0.1} defaultValue={0.4} scale />, dontNote: 'Numerals from 0 to 1 that mean nothing to the person.' },
    },
    {
      name: 'step',
      rules: <p>Sets the detents. The cap settles into the nearest one and the ruler prints one tick per step, up to 20. Without a step the fader moves freely and the ruler has ten divisions.</p>,
      pair: { do: <Slider label="Fan speed" min={0} max={5} step={1} defaultValue={2} scale />, doNote: 'Five fan speeds, five detents.', dont: <Slider label="Fan speed" min={0} max={5} defaultValue={2.37} />, dontNote: 'A fan with 2.37 as a speed, because there is no step.' },
    },
  ],
  related: [['/components/rotary', 'Rotary', 'The main setting of the unit, as the orange knob.'], ['/components/switch', 'Switch', 'Only on and off.'], ['/components/segmented-control', 'SegmentedControl', 'A few named modes.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Slider pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/', why: 'The keyboard map and the ARIA values a slider needs.' },
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why every step can also be reached by a single press or a key.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
