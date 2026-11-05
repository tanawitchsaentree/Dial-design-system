// Usage tab for Input (component-depth.md U1–U14). Input is a window recessed into the body that takes text.
import { Button, Input, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const INPUT: Depth = {
  overview: (
    <>
      <p>Input takes a short piece of text, such as a room name, a password or a temperature. It is a well cut into the body of the unit. The light falls into it from the top left, so it reads as a recess and not as a box on top.</p>
      <p>The name of the field is printed above the well, on the same line as the other printing on the unit. It stays there while you type. A placeholder is never the name.</p>
    </>
  ),
  whenToUse: ['To enter a short piece of free text, such as a device name.', 'To enter an exact number with a unit, when a fader would be too coarse.', 'For a password or a code the device asks for.'],
  whenNot: [
    { situation: 'Picking one of a known list of options', to: '/components/select', label: 'Select' },
    { situation: 'Setting an amount along a range', to: '/components/slider', label: 'Slider' },
    { situation: 'The main setting of a unit, such as its temperature', to: '/components/rotary', label: 'Rotary' },
  ],
  variants: { na: 'Input has one look, a recessed well with the label above it. The hint, the error and the unit are options, covered under Modifiers.' },
  anatomy: {
    render: <Input label="Target temperature" unit="°C" defaultValue="21.5" hint="Between 5 and 30." />,
    parts: [
      { part: 'Label', selector: '[data-component="Input"] > label', what: 'The printed name, above the start of the well.' },
      { part: 'Well', selector: '[data-component="Input"] > div', what: 'A recess the width of the column, with a hairline edge and shade on its top-left inner edge.' },
      { part: 'Text', selector: '[data-component="Input"] input', what: 'The typed value in primary ink, on a line box tall enough for Thai marks.' },
      { part: 'Unit', selector: '[data-component="Input"] > div > span', what: 'The printed unit after the value, inside the well.' },
      { part: 'Hint', selector: '[data-component="Input"] > p', what: 'A short line under the well in secondary ink.' },
    ],
  },
  sizes: {
    md: { use: '44px well. Fields in a unit and in settings sheets.', pairs: 'Other 44px controls, such as Button, Select and Switch.' },
    lg: { use: '52px well with larger text. The main field of a sheet on a phone.', pairs: 'A large Button below it, one field per row.' },
  },
  emphasis: { na: 'A field is never the loud part of a unit. It has no orange and no emphasis levels; the unit’s one orange key does the action.' },
  placement: {
    rows: [['One field per row, full width', 'The usual place, in a settings sheet or under a unit’s display.'], ['Above the action', 'The key that saves the value comes after the last field.']],
    examples: [{ title: 'In a settings sheet', render: <Unit><Stack gap="md"><Input label="Name" defaultValue="Bedroom heater" /><Button kind="primary">Save</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Input + Button', 'The field takes the value and the orange key saves it.'], ['Input + Select', 'Free text next to a choice from a list, each with its own printed label.']],
    avoid: [{ title: 'a placeholder in place of the label', why: 'The words disappear as soon as someone types, and the field has no name left.', render: <Unit><Input label="" aria-label="Room name" placeholder="Room name" /></Unit> }],
  },
  content: {
    formula: <p>Name the thing the field holds, as in <em>Room name</em>, <em>Wi-Fi password</em> or <em>Target temperature</em>, and leave the action to the key. Put the unit in <code>unit</code>, the format in <code>hint</code>, and say what is wrong in <code>error</code>.</p>,
    pair: {
      do: <Input label="Delay start by" unit="min" defaultValue="30" />, doNote: 'The label names the setting and the unit is printed after the value.',
      dont: <Input label="Please type the delay in minutes here" defaultValue="30" />, dontNote: 'An instruction as the label, with the unit buried in it.',
    },
    overflow: { text: 'A long label wraps above the well. A long value scrolls inside the well, and the well keeps its width while you type.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><Input label="Name shown on the lamp above the dining table" defaultValue="Dining table pendant, left side" /></div> },
    rtl: { text: 'In right-to-left languages the label starts on the right and the unit sits on the left of the value.', render: <div dir="rtl"><Input label="درجة الحرارة" unit="°C" defaultValue="21" /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. The label wraps and the well does not change.', render: <Input label="Zieltemperatur im Wohnzimmer" unit="°C" defaultValue="21" /> },
  },
  behaviours: {
    states: [
      ['Rest', 'A recess with a hairline edge and shade on its top-left inner edge.', 'The label is printed above it.'],
      ['Focus', 'The same dark 2px ring as every part, around the whole well.', 'The well does not grow or move.'],
      ['Typing', 'Text runs in the well and scrolls when it is long.', 'The well keeps its width, and Thai marks are not cut.'],
      ['Invalid', 'The edge turns red and the message is printed below with a glyph.', 'Never orange, and never colour alone.'],
      ['Read-only', 'The well stays recessed and the text can be selected and copied.', 'It stays in the tab order.'],
      ['Disabled', 'The well loses its shadow and the field fades to half.', 'It leaves the tab order.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus into the field and shows the ring.', 'native input'],
      ['Keyboard', 'Typing', 'Enters text. The arrow keys move the caret.', 'native input'],
      ['Pointer', 'Press the well', 'Places the caret where you pressed.', 'native input'],
      ['Screen reader', 'Read', 'Announced with its label, its value, its unit, its hint and, when invalid, the error.', 'aria-describedby, aria-invalid'],
    ],
    loading: <p>Input has no loading state. If the device checks a value, say so on the unit’s display and keep the text where the person typed it.</p>,
    focus: <p>A field is not focused on page load, except the first field of a sheet that opens only to ask for it, such as a Wi-Fi password.</p>,
  },
  deepDive: { na: 'Input has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'unit',
      rules: <p>Prints the unit after the value, inside the well. It is part of the field’s description, so a screen reader says it too. Keep it short, such as <em>°C</em>, <em>min</em> or <em>%</em>.</p>,
      pair: { do: <Input label="Target temperature" unit="°C" defaultValue="21.5" />, doNote: 'The unit is printed beside the value.', dont: <Input label="Target temperature (°C)" defaultValue="21.5 °C" />, dontNote: 'The unit is typed into the value, so the device has to parse it out.' },
    },
    {
      name: 'hint',
      rules: <p>A short line under the well that says what to enter, such as a range or a format. One sentence at most.</p>,
      pair: { do: <Input label="Night setback" unit="°C" hint="Between 5 and 20." defaultValue="17" />, doNote: 'The range, in a few words.', dont: <Input label="Night setback" unit="°C" hint="This is the temperature that the heater will hold during the night hours, which you can set in the schedule." defaultValue="17" />, dontNote: 'A paragraph that belongs in a help page.' },
    },
    {
      name: 'error',
      rules: <p>Marks the field invalid and prints the problem under the well with a glyph. Say what to do, as in <em>Use at least 8 characters.</em> Show it after the person leaves the field or submits. The first key press is too early.</p>,
      pair: { do: <Input label="Wi-Fi password" type="password" defaultValue="1234" error="Use at least 8 characters." />, doNote: 'The fix, in words, with a glyph.', dont: <Input label="Wi-Fi password" type="password" defaultValue="1234" error="Invalid." />, dontNote: 'It says something is wrong but not what to do.' },
    },
  ],
  related: [['/components/select', 'Select', 'A choice from a known list.'], ['/components/slider', 'Slider', 'An amount along a range.'], ['/components/rotary', 'Rotary', 'The main setting of a unit.']],
  references: [
    { title: 'WCAG 2.2 · 3.3.2 Labels or Instructions', url: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html', why: 'Why the label is printed and stays while typing.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the error has a glyph and words as well as a red edge.' },
    { title: 'GOV.UK Design System · Text input', url: 'https://design-system.service.gov.uk/components/text-input/', why: 'Labels above the field, hints and error messages in words.' },
  ],
};
