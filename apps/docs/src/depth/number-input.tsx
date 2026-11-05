// Usage tab for NumberInput (component-depth.md U1–U14). NumberInput is a number read in a recessed window, stepped by two keys.
import { Button, NumberInput, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const temp = <NumberInput label="Target temperature" unit="°C" min={5} max={30} step={0.5} defaultValue={21.5} />;

export const NUMBER_INPUT: Depth = {
  overview: (
    <>
      <p>NumberInput sets one number that has a known step, such as a target temperature, a delay in minutes or a quantity. The figure is read in a recessed window, with its unit after it, and a minus key and a plus key stand either side.</p>
      <p>You can type the number, press the arrow keys or hold a key to repeat. It is the precise way to set a number. For a rough setting along a range, where the position matters more than the digits, use a Slider. For the one main setting of a unit, turned with a thumb, use a Rotary.</p>
    </>
  ),
  whenToUse: ['To set a number with a known step and limits, where the exact figure matters.', 'To set a quantity or a duration that people also want to type.', 'To set a number in a form, next to other fields.'],
  whenNot: [
    { situation: 'Setting a level along a range where the position matters more than the digits', to: '/components/slider', label: 'Slider' },
    { situation: 'Turning the one main setting of a unit', to: '/components/rotary', label: 'Rotary' },
    { situation: 'Entering text, an ID or a phone number that only looks like a number', to: '/components/input', label: 'Input' },
  ],
  variants: { na: 'NumberInput has one look, a window between two keys. The two sizes are covered under Sizes.' },
  anatomy: {
    render: temp,
    parts: [
      { part: 'Label', selector: '[data-component="NumberInput"] > label', what: 'The printed name above the row. It is also the accessible name.' },
      { part: 'Minus key', selector: '[data-component="NumberInput"] > div > button:first-of-type', what: 'A 44px round key that lowers the value by one step.' },
      { part: 'Window', selector: '[data-component="NumberInput"] > div > div', what: 'The recess that holds the value and the unit.' },
      { part: 'Value', selector: '[data-component="NumberInput"] input', what: 'The figure in tabular numerals, aligned to the end of the window.' },
      { part: 'Unit', selector: '[data-component="NumberInput"] > div > div > span', what: 'The unit printed after the value, in secondary ink.' },
      { part: 'Plus key', selector: '[data-component="NumberInput"] > div > button:last-of-type', what: 'A 44px round key that raises the value by one step.' },
    ],
  },
  sizes: {
    md: { use: 'The default: a 44px window between 44px keys, for forms and sheets.', pairs: 'Sits level with Input, Select and Button at md.' },
    lg: { use: 'A 52px window between 52px keys with larger figures, for the main number of a phone sheet.', pairs: 'Pairs with a lg Input or a lg Button.' },
  },
  emphasis: { na: 'NumberInput is never the loud part of a unit. Both keys are body-coloured and the window is ink, so the orange stays on the unit’s primary control.' },
  placement: {
    rows: [['A form', 'The field stands in the column with its label above, like an Input.'], ['A settings sheet', 'Under the Switch or Select that turns the setting on, with the orange key last.'], ['Beside a Slider', 'Use the Slider for the rough move and the NumberInput for the exact figure of the same setting.']],
    examples: [{ title: 'In a settings sheet', render: <Unit><Stack gap="lg">{temp}<Button kind="primary">Save</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['NumberInput + Switch', 'The switch turns a schedule on and the field sets its delay.'], ['NumberInput + Button', 'The orange key that saves comes after the last field.'], ['NumberInput + Slider', 'The slider moves the setting by feel and the field names its exact value.']],
    avoid: [{ title: 'a NumberInput for a postcode or a card number', why: 'It steps and clamps the value and drops leading zeros. Use an Input with inputMode numeric.', render: <Unit><NumberInput label="Postcode" defaultValue={1000} /></Unit> }],
  },
  content: {
    formula: <p>Name the quantity with a noun, as in <em>Target temperature</em> or <em>Delay start by</em>, and put the unit in the <code>unit</code> prop, not in the label.</p>,
    pair: {
      do: <NumberInput label="Delay start by" unit="min" defaultValue={30} />, doNote: 'A noun, and the unit printed in the window.',
      dont: <NumberInput label="Delay in minutes" defaultValue={30} />, dontNote: 'The unit sits in the label, so the figure stands alone in the window.',
    },
    overflow: { text: 'A long label wraps above the row. A long number shrinks the space left for the value and the window never grows past its column.', render: <Unit><NumberInput label="Delay before the washer starts its night cycle after the door has been closed" unit="min" defaultValue={30} /></Unit> },
    rtl: { text: 'In right-to-left languages the minus key sits on the right and the figure keeps its end alignment.', render: <div dir="rtl"><NumberInput label="درجة الحرارة" unit="°م" min={5} max={30} defaultValue={21} /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap above the row and the keys do not move.', render: <NumberInput label="Gewünschte Raumtemperatur" unit="°C" defaultValue={21} /> },
  },
  behaviours: {
    states: [
      ['Default', 'A recess with the figure and two raised keys.', 'Announced as a spin button with its value, minimum and maximum.'],
      ['Hover', 'A key’s symbol darkens one step.', 'No change.'],
      ['Pressed', 'A key drops by its height and returns on the spring.', 'The new value is announced.'],
      ['Focus', 'A dark ring around the window.', 'The label and the value are read.'],
      ['At the limit', 'The key that would pass the limit goes flat and fades.', 'The key is announced as unavailable.'],
      ['Invalid', 'The window edge turns critical red and a glyph and words print under the row.', 'aria-invalid and the message is read with the field.'],
      ['Read-only', 'The recess and ink stay; both keys go flat.', 'Announced as read-only.'],
      ['Disabled', 'The recess shadow goes and the figure fades.', 'Announced as unavailable.'],
    ],
    interactions: [
      ['Keyboard', 'ArrowUp, ArrowDown', 'Raises or lowers the value by one step.', 'spin button'],
      ['Keyboard', 'PageUp, PageDown', 'Moves the value by the page step, ten steps by default.', 'spin button'],
      ['Keyboard', 'Home, End', 'Jumps to the minimum or the maximum, when they are set.', 'spin button'],
      ['Keyboard', 'Enter, Tab', 'Commits typed text. Clamps it into range and prints it.', 'native'],
      ['Pointer', 'Press a key', 'Steps once, then repeats while it is held.', 'IconButton'],
      ['Touch', 'Tap a key', 'Steps once without opening the on-screen keyboard.', 'IconButton'],
      ['Screen reader', 'Adjust', 'The value, minimum and maximum are read, and up and down actions step it.', 'role spinbutton'],
    ],
    loading: <p>NumberInput has no loading state. While a value is being fetched, leave it empty and disable the field.</p>,
    focus: <p>Focus lands on the window. The two keys are not tab stops, because the arrow keys do the same job; they stay reachable by pointer, touch and screen reader. Pressing a key does not move focus.</p>,
  },
  deepDive: { na: 'NumberInput has no variants, so there is no section per variant.' },
  modifiers: [
    {
      name: 'min, max and step',
      rules: <p>Set <code>min</code> and <code>max</code> when the number has limits: the keys stop there, and typed text is raised or lowered to the limit when the field loses focus. <code>step</code> is the distance one press moves and sets the decimals kept, so <code>0.5</code> keeps one. The value is clamped, not snapped to a step.</p>,
      pair: { do: <NumberInput label="Spin speed" unit="rpm" min={400} max={1600} step={100} defaultValue={1000} />, doNote: 'Limits and a step that fit the appliance.', dont: <NumberInput label="Spin speed" unit="rpm" defaultValue={1000} />, dontNote: 'No limits: 1 rpm per press and no stop.' },
    },
    {
      name: 'unit',
      rules: <p>Print the unit after the value in <code>unit</code>. It is read out with the field. Use a short unit such as <code>°C</code> or <code>min</code>.</p>,
      pair: { do: <NumberInput label="Delay" unit="min" defaultValue={30} />, doNote: 'A short unit in the window.', dont: <NumberInput label="Delay" unit="minutes after the door closes" defaultValue={30} />, dontNote: 'A sentence in the unit slot squeezes the figure.' },
    },
    {
      name: 'error',
      rules: <p>Use <code>error</code> for a problem the limits cannot catch, such as a value that clashes with another field. The message names the problem and what to do.</p>,
      pair: { do: <NumberInput label="Cycle length" unit="min" defaultValue={45} error="Under 60 minutes the heat dry cannot run. Raise it or turn heat dry off." />, doNote: 'The problem and the way out.', dont: <NumberInput label="Cycle length" unit="min" defaultValue={45} error="Invalid." />, dontNote: 'It names no problem and no way out.' },
    },
    {
      name: 'readOnly and disabled',
      rules: <p><code>readOnly</code> keeps the figure readable and copyable while it cannot change, such as a value set by a schedule. <code>disabled</code> takes the field out of the form and fades it.</p>,
      pair: { do: <NumberInput label="Set by schedule" unit="°C" defaultValue={19} readOnly />, doNote: 'The figure stays readable.', dont: <NumberInput label="Set by schedule" unit="°C" defaultValue={19} disabled />, dontNote: 'Disabled fades the figure the person wants to read.' },
    },
  ],
  related: [
    ['/components/slider', 'Slider', 'A level along a range, set by position. Pair it with a NumberInput when people also need the exact figure.'],
    ['/components/rotary', 'Rotary', 'The one main setting of a unit, turned with a thumb.'],
    ['/components/input', 'Input', 'Text, an ID or a code. Use it when stepping makes no sense.'],
  ],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Spinbutton pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/', why: 'The keyboard map and the role NumberInput follows.' },
    { title: 'GOV.UK Design System · Text input, asking for numbers', url: 'https://design-system.service.gov.uk/components/text-input/#asking-for-whole-numbers', why: 'Why numbers that are not quantities, such as postcodes, belong in a text field.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why the keys are 44px.' },
  ],
};
