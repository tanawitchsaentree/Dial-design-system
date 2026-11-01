// Usage tab for Select (component-depth.md U1–U14). Select is Input's recessed well that opens a plastic list.
import { Button, Select, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const PROGRAMMES = [
  { value: 'eco', label: 'Eco 40–60' },
  { value: 'cotton', label: 'Cotton 40°' },
  { value: 'synthetics', label: 'Synthetics' },
  { value: 'wool', label: 'Wool and hand wash' },
];
const MODES = [{ value: 'heat', label: 'Heat' }, { value: 'cool', label: 'Cool' }];

export const SELECT: Depth = {
  overview: (
    <>
      <p>Select picks one option from a list, such as a programme, a room or a time zone. When it is closed, it is the same recessed well as Input, with a printed chevron at the end. When it is open, it shows a panel of plastic above the page, right under the well.</p>
      <p>The chosen option has a printed tick and a heavier weight. It is never filled with orange or any other colour. The row under the keyboard or the pointer is a small recess, so you can see where you are without a coloured bar.</p>
      <p>Select follows the select-only combobox pattern. Focus stays on the well the whole time, and the list is read through aria-activedescendant, so a screen reader hears each option as you move. It can be controlled with value and onValueChange, or left to keep its own value with defaultValue. Give it a name and it sends the chosen value with a form through a hidden input, like a native select would.</p>
      <p>Use Select when the options are known in advance and there are too many to show at once. When people need to see every option to decide, show them all with SegmentedControl or a group of Checkboxes instead.</p>
    </>
  ),
  whenToUse: ['To pick one of four or more named options.', 'When the list is too long to show all options at once.', 'For a setting in a sheet, next to text fields.', 'For a choice that people make once and then rarely change, such as the time zone of a home.'],
  whenNot: [
    { situation: 'Picking one of two to five modes you want to see all the time', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Turning something on or off', to: '/components/switch', label: 'Switch' },
    { situation: 'Typing a value that is not in a list', to: '/components/input', label: 'Input' },
    { situation: 'Choosing several options at once', to: '/components/checkbox', label: 'Checkbox' },
    { situation: 'Setting a number along a range', to: '/components/slider', label: 'Slider' },
  ],
  variants: { na: 'Select has one look, a recessed well that opens a plastic panel below it. The placeholder is an option, covered under Modifiers.' },
  anatomy: {
    render: <Select label="Programme" options={PROGRAMMES} defaultValue="cotton" />,
    parts: [
      { part: 'Label', selector: '[data-component="Select"] > span', what: 'The printed name, above the start of the well.' },
      { part: 'Well', selector: '[data-component="Select"] [role="combobox"]', what: 'The same recess as Input, the width of the column.' },
      { part: 'Value', selector: '[data-component="Select"] [role="combobox"] > span', what: 'The chosen option in primary ink, or the placeholder in secondary ink.' },
      { part: 'Chevron', selector: '[data-component="Select"] [role="combobox"] > svg', what: 'A printed chevron at the end of the well. It turns over while the list is open.' },
      { part: 'Panel', selector: '[data-component="Select"] [role="listbox"]', what: 'A plastic panel above the page, with one short shadow. Hidden until opened.' },
    ],
  },
  sizes: {
    md: { use: '44px well. Selects in a unit and in settings sheets.', pairs: 'Other 44px controls such as Input, Button and Switch.' },
    lg: { use: '52px well with larger text. The main choice of a sheet on a phone.', pairs: 'A large Input or Button in the same sheet.' },
  },
  emphasis: { na: 'A select is never the loud part of a unit. It has no orange, and the chosen option is marked in ink and weight.' },
  placement: {
    rows: [['One per row, full width', 'In a settings sheet, under its label, with fields around it.'], ['Under a unit’s display', 'A programme or mode chooser, above the orange key that starts it.'], ['Near the bottom of the screen', 'The panel opens under the well, so leave room below it or the list runs past the visible area.']],
    examples: [{ title: 'Under a display', render: <Unit><Stack gap="md"><p className="flush">Washer, ready</p><Select label="Programme" options={PROGRAMMES} defaultValue="eco" /><Button kind="primary">Start wash</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['Select + Button', 'The select picks the programme and the orange key starts it.'], ['Select + Input', 'A choice from a list next to free text, each with its own label.'], ['Select + Display', 'The display repeats the choice in its own words once the select closes, so the unit says what it will do.']],
    avoid: [{ title: 'a select with two options', why: 'Two options hide behind a press for no reason. A switch or a segmented control shows both at once.', render: <Unit><Select label="Mode" options={MODES} defaultValue="heat" /></Unit> }],
  },
  content: {
    formula: <><p>Label the setting with a noun, such as <em>Programme</em>, <em>Room</em> or <em>Time zone</em>. Options are short nouns in sentence case, sorted in the order people expect. That is by use for programmes, by time for schedules and by the alphabet for long lists such as time zones.</p><p>Start each option with the word that tells it apart, because type-ahead jumps on the first letters and the closed well may cut the end of a long option. Keep options parallel, so every one is a noun or every one is a time. Leave out a None option unless choosing nothing is a real setting, and then name it, for example No scene.</p></>,
    pair: {
      do: <Select label="Room" options={[{ value: 'k', label: 'Kitchen' }, { value: 'l', label: 'Living room' }]} defaultValue="k" />, doNote: 'The label names the setting and the options are nouns.',
      dont: <Select label="Please choose a room from the list" options={[{ value: 'k', label: 'The kitchen room' }, { value: 'l', label: 'The living room' }]} defaultValue="k" />, dontNote: 'An instruction as the label, and filler words in every option.',
    },
    overflow: { text: 'A long option is cut with an ellipsis on the closed well, so the well keeps its size. In the open panel it wraps onto a second line.', render: <div data-overflow-demo="" style={{ inlineSize: 240 }}><Select label="Scene" options={[{ value: 'a', label: 'Evening in the living room with the reading lamp on' }]} defaultValue="a" /></div> },
    rtl: { text: 'In right-to-left languages the label starts on the right and the chevron moves to the left end of the well.', render: <div dir="rtl"><Select label="الغرفة" options={[{ value: 'k', label: 'المطبخ' }, { value: 'l', label: 'غرفة المعيشة' }]} defaultValue="k" /></div> },
    expansion: { text: 'German and Finnish options can run 30% longer. The panel is as wide as the well and long options wrap.', render: <Select label="Programm" options={[{ value: 'k', label: 'Koch- und Buntwäsche' }, { value: 'p', label: 'Pflegeleicht' }]} defaultValue="k" /> },
  },
  behaviours: {
    states: [
      ['Closed', 'A recess with the chosen option and a printed chevron.', 'The label is printed above it.'],
      ['Focus', 'The same dark 2px ring as every part, around the well.', 'It stays on the well while the list is open.'],
      ['Open', 'The panel appears under the well at once, with no fade or slide.', 'The chevron turns over.'],
      ['Active row', 'The row under the keys or the pointer becomes a small recess.', 'Never a coloured bar.'],
      ['Chosen', 'A printed tick and medium weight in primary ink.', 'Never orange and never a fill.'],
      ['Disabled', 'The well loses its shadow and fades to half.', 'It cannot be opened and leaves the tab order.'],
    ],
    interactions: [
      ['Keyboard', 'Down, Up, Enter or Space', 'Opens the list on the chosen option.', 'role combobox, aria-expanded'],
      ['Keyboard', 'Arrow keys, Home, End, Page Up, Page Down', 'Move through the open list.', 'aria-activedescendant'],
      ['Keyboard', 'Letters', 'Jump to the next option that starts with what you typed.', 'type-ahead'],
      ['Keyboard', 'Enter or Space', 'Choose the active option and close.', 'aria-selected'],
      ['Keyboard', 'Escape', 'Close without choosing. Focus stays on the well.', 'aria-expanded'],
      ['Pointer', 'Press the well, press an option', 'Opens the list, then chooses and closes. A press outside closes it.', 'listbox, option'],
      ['Screen reader', 'Read', 'Announced as a combobox with its label and the chosen option; options are read with their position.', 'role listbox, role option'],
    ],
    loading: <p>Select has no loading state. Load the options before you show the field. If they can change, say so on the unit’s display. Choosing an option calls onValueChange at once. When the device has to confirm the change, keep the new value in the well and show the wait on the display.</p>,
    focus: <p>Select is never focused on page load. While the list is open, focus stays on the well and the active row is pointed to with aria-activedescendant.</p>,
  },
  deepDive: { na: 'Select has a single variant, so one look covers every use.' },
  modifiers: [
    {
      name: 'placeholder',
      rules: <p>A grey prompt in the well before anything is chosen. Use it when there is no sensible default. It never replaces the label.</p>,
      pair: { do: <Select label="Play on" placeholder="Choose a speaker" options={[{ value: 'k', label: 'Kitchen speaker' }]} />, doNote: 'A label above and a prompt inside.', dont: <Select label="Mode" placeholder="Choose" options={MODES} defaultValue="heat" />, dontNote: 'A placeholder on a field that always has a value, so it is never seen.' },
    },
    {
      name: 'disabled',
      rules: <p>The field cannot be opened and Tab skips it. The chosen value stays readable. Say on the unit why, for example while a wash is running.</p>,
      pair: { do: <Stack gap="sm"><p className="flush">Washing, 38 min left</p><Select label="Programme" options={PROGRAMMES} defaultValue="cotton" disabled /></Stack>, doNote: 'The display says why the choice is locked.', dont: <Select label="Programme" options={PROGRAMMES} defaultValue="cotton" disabled />, dontNote: 'A locked field with no reason anywhere.' },
    },
  ],
  related: [['/components/input', 'Input', 'Free text in the same well.'], ['/components/switch', 'Switch', 'Only on and off.'], ['/components/segmented-control', 'SegmentedControl', 'A few modes, all visible.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Select-only combobox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/', why: 'The roles, the keyboard map and type-ahead this select follows.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the chosen option is a tick and a weight instead of a fill.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
