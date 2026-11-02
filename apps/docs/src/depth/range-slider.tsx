// Usage tab for RangeSlider (component-depth.md U1–U14). RangeSlider is Slider with two caps in one groove.
import { RangeSlider, Rotary, Slider, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const deg = (v: number) => `${v} °C`;

export const RANGE_SLIDER: Depth = {
  overview: (
    <>
      <p>RangeSlider sets a band between a low and a high end, such as the temperatures a heating schedule may run between, or the warmest and coolest light a lamp may take. It is Slider with a second cap. Both caps ride the same narrow groove under the same printed ruler, and each one settles into the nearest step on the spring.</p>
      <p>Both caps are frosted glass, dial’s one accent material, and the groove between them is lit in their tint. Set <code>tint</code> to warm for a heating band and cool for a cooling band; leave it neutral for anything else. The tint stays close to the plastic, so the band reads without a second orange.</p>
      <p>The caps stop at each other, so the low end can never pass the high end. The ruler shows the band, because the ticks inside it print darker and thicker. The groove itself stays empty, and nothing is orange, because the orange belongs to the knob of the unit.</p>
    </>
  ),
  whenToUse: [
    'To set a band with a lowest and a highest value, such as a comfort band or quiet hours.',
    'When the person should see where the band sits in the whole range.',
    'For a secondary setting next to a knob that sets the main value.',
  ],
  whenNot: [
    { situation: 'A single amount, such as volume or brightness', to: '/components/slider', label: 'Slider' },
    { situation: 'The main setting of the unit, such as the target temperature', to: '/components/rotary', label: 'Rotary' },
    { situation: 'A level the person reads and does not set', to: '/components/meter', label: 'Meter' },
  ],
  variants: { na: 'RangeSlider has one look, two glass caps in a recessed groove. The tint, the numerals, the steps and the gap are options, covered under Modifiers.' },
  anatomy: {
    render: <RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale formatValue={deg} />,
    parts: [
      { part: 'Label', selector: '[data-component="RangeSlider"] > div:first-child > span:first-child', what: 'The printed name, above the start of the groove. It names both caps.' },
      { part: 'Values', selector: '[data-component="RangeSlider"] > div:first-child > span:last-child', what: 'The low and the high value, above the end of the groove, with tabular figures.' },
      { part: 'Ruler', selector: '[data-component="RangeSlider"] > div:nth-child(2) > div:first-child', what: 'One printed tick per step. Ticks inside the band print darker and twice as thick.' },
      { part: 'Groove', selector: '[data-component="RangeSlider"] > div:nth-child(2) > div:nth-child(2)', what: 'One narrow slot recessed into the body, shared by both caps.' },
      { part: 'Low cap', selector: '[data-component="RangeSlider"] [data-thumb="low"] > div', what: 'A raised cap of frosted glass in the band’s tint, with one ink line. It stops at the high cap.' },
      { part: 'High cap', selector: '[data-component="RangeSlider"] [data-thumb="high"] > div', what: 'The same cap for the high end. It stops at the low cap.' },
      { part: 'Numerals', selector: '[data-component="RangeSlider"] > div:last-child', what: 'With scale, the ruler values are printed under the groove in the smallest size.' },
    ],
  },
  sizes: { na: 'RangeSlider has one size. The track is 44px tall and as long as its column, and never shorter than 220px. Each cap has its own 44px target.' },
  emphasis: {
    text: <p>A range is a quiet control. It never takes the orange. When a unit has a knob, the knob sets the main value and the range sits under it, as the band around that value.</p>,
    pair: {
      do: <Unit><Stack gap="md" align="center"><Rotary label="Target" min={16} max={26} defaultValue={21} formatValue={deg} /><RangeSlider label="Allowed band" min={14} max={26} step={1} defaultValue={[19, 23]} formatValue={deg} /></Stack></Unit>,
      doNote: 'An orange knob for the target, a plastic range for the band around it.',
      dont: <Unit><Stack gap="md"><RangeSlider label="Day band" min={14} max={26} step={1} defaultValue={[19, 23]} formatValue={deg} /><RangeSlider label="Night band" min={14} max={26} step={1} defaultValue={[16, 19]} formatValue={deg} /><RangeSlider label="Away band" min={14} max={26} step={1} defaultValue={[14, 17]} formatValue={deg} /></Stack></Unit>,
      dontNote: 'Three ranges of the same weight in one unit, and nothing says which matters most.',
    },
  },
  placement: {
    rows: [['Under the knob of a unit, across its width', 'The band around the value the knob sets.'], ['A row in a schedule or settings sheet', 'One range per row, with its label above it.']],
    examples: [{ title: 'In a schedule row', render: <Unit><Stack gap="md"><p className="flush">Weekdays</p><RangeSlider label="Heating band" min={14} max={26} step={1} defaultValue={[18, 22]} scale formatValue={deg} /></Stack></Unit> }],
  },
  combinations: {
    good: [['Rotary + RangeSlider', 'The knob for the target, the range for the band around it.'], ['RangeSlider + Display', 'The display says the band in large type while the caps set it.']],
    avoid: [{ title: 'two Sliders for one band', why: 'Two separate faders let the low end pass the high end, and nothing shows that they belong together.', render: <Unit><Stack gap="md"><Slider label="Lowest" min={14} max={26} step={1} defaultValue={23} /><Slider label="Highest" min={14} max={26} step={1} defaultValue={19} /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the band the caps set, as in <em>Heating band</em>, <em>Quiet hours</em> or <em>Colour range</em>. Put the unit in <code>formatValue</code>. When low and high are not the right words for the two ends, set <code>lowLabel</code> and <code>highLabel</code>, such as Warmest and Coolest.</p>,
    pair: {
      do: <RangeSlider label="Quiet hours" min={0} max={24} step={1} defaultValue={[22, 24]} formatValue={(v) => `${v}:00`} />, doNote: 'The label names the band and the values carry the hour.',
      dont: <RangeSlider label="Drag both handles to pick the start and end" min={0} max={24} step={1} defaultValue={[22, 24]} />, dontNote: 'An instruction as the label, and bare numbers with no unit.',
    },
    overflow: { text: 'A long label wraps above the groove and the values stay at the end. The track keeps its length.', render: <div data-overflow-demo="" style={{ inlineSize: 240 }}><RangeSlider label="Temperature band for the bedroom at night" min={14} max={26} step={1} defaultValue={[16, 19]} formatValue={deg} /></div> },
    rtl: { text: 'In right-to-left languages the groove starts on the right. The low cap is on the right and the arrow keys follow the direction of the groove.', render: <div dir="rtl"><RangeSlider label="نطاق الحرارة" min={14} max={26} step={1} defaultValue={[18, 22]} scale /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The label wraps and the groove does not change.', render: <RangeSlider label="Temperaturbereich der Heizung" min={14} max={26} step={1} defaultValue={[18, 22]} formatValue={deg} /> },
  },
  behaviours: {
    states: [
      ['Rest', 'Both caps sit on their steps, raised by their height.', 'The values above the groove say both ends.'],
      ['Hover', 'The ink line on the cap under the pointer darkens one step.', 'The cap never lifts or grows.'],
      ['Dragging', 'The nearer cap follows the pointer and stops at the other cap.', 'The values change as it passes each step.'],
      ['Released', 'The cap settles into the nearest step on the spring, in about 245ms.', 'With reduced motion it jumps there at once.'],
      ['Focus', 'A dark 2px ring around the focused cap.', 'The ring shows which end the keys will move.'],
      ['Disabled', 'Both caps lose their height and the range fades to half.', 'Both leave the tab order and do not move.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the low cap, then to the high cap.', 'two role slider'],
      ['Keyboard', 'Arrow keys', 'Move the focused cap one step, up to the other cap.', 'role slider'],
      ['Keyboard', 'Page Up / Page Down', 'Move a tenth of the range, at least two steps.', 'role slider'],
      ['Keyboard', 'Home / End', 'Move the focused cap as far as it can go.', 'role slider'],
      ['Pointer', 'Press, drag, release', 'The nearer cap comes to the press, follows the pointer and settles into the nearest step.', 'pointer capture'],
      ['Screen reader', 'Read', 'Each cap is announced with the label and its own name, such as Heating band Low, its value text and the range it may reach.', 'aria-valuetext'],
    ],
    loading: <p>RangeSlider has no loading state. If the device takes time to apply the band, say so on the unit’s display and keep the caps where the person left them.</p>,
    focus: <p>RangeSlider is never focused on page load. Pressing the track focuses the cap that moved, so the arrow keys work right after a drag.</p>,
  },
  deepDive: { na: 'RangeSlider has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'minGap',
      rules: <p>Keeps the caps at least this far apart, for a band that must never be narrower, such as a heating band of at least two degrees. The default is 0, so both caps may stand on one value.</p>,
      pair: { do: <RangeSlider label="Comfort band" min={14} max={26} step={1} minGap={2} defaultValue={[20, 22]} formatValue={deg} />, doNote: 'The heater needs room to work, so the band stays at least 2 °C wide.', dont: <RangeSlider label="Comfort band" min={14} max={26} step={1} defaultValue={[21, 21]} formatValue={deg} />, dontNote: 'A band of zero width that the heater cannot hold.' },
    },
    {
      name: 'scale',
      rules: <p>Prints the ruler’s numerals under the groove. Use it when the numbers mean something to the person, such as degrees or hours.</p>,
      pair: { do: <RangeSlider label="Quiet hours" min={0} max={24} step={2} defaultValue={[8, 16]} scale formatValue={(v) => `${v}:00`} />, doNote: 'Hours of the day on a scale people know.', dont: <RangeSlider label="Warmth" min={0} max={1} step={0.1} defaultValue={[0.2, 0.6]} scale />, dontNote: 'Numerals from 0 to 1 that mean nothing to the person.' },
    },
    {
      name: 'lowLabel and highLabel',
      rules: <p>Name the two caps for screen readers. The defaults are Low and High. Change them when the two ends have better names, such as Warmest and Coolest for a lamp, or From and To for hours.</p>,
      pair: { do: <RangeSlider label="Colour range" min={2200} max={6500} step={100} defaultValue={[2700, 4000]} lowLabel="Warmest" highLabel="Coolest" formatValue={(v) => `${v} K`} />, doNote: 'The caps are announced as Colour range Warmest and Colour range Coolest.', dont: <RangeSlider label="Colour range" min={2200} max={6500} step={100} defaultValue={[2700, 4000]} lowLabel="Thumb 1" highLabel="Thumb 2" formatValue={(v) => `${v} K`} />, dontNote: 'Names that describe the widget and say nothing about the light.' },
    },
  ],
  related: [['/components/slider', 'Slider', 'One amount, with one cap.'], ['/components/rotary', 'Rotary', 'The main setting of the unit, as the orange knob.'], ['/components/meter', 'Meter', 'A level that is read and never set.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Multi-Thumb Slider pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/', why: 'The keyboard map, and why each thumb’s range stops at the other one.' },
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why each value can also be reached with a single press or a key.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
