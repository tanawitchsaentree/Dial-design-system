// Usage tab for MultiSelect (component-depth.md U1–U14). MultiSelect is Select's well and panel with several choices.
import { Button, MultiSelect, Select, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'hall', label: 'Hall' },
  { value: 'living', label: 'Living room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bath', label: 'Bathroom' },
];
const MODES = [{ value: 'heat', label: 'Heat' }, { value: 'cool', label: 'Cool' }];

export const MULTI_SELECT: Depth = {
  overview: (
    <>
      <p>MultiSelect picks any number of options from a list, such as the rooms a schedule applies to or the speakers a track plays on. Closed, it is the same recessed well as Select. Open, it is a plastic panel under the well, and the panel stays open while you choose.</p>
      <p>The well says the value in words. By default it counts, as in <em>3 chosen</em>, so the well stays one row tall. With <code>display="chips"</code> every chosen value stands in the well as a small key that can be removed on its own.</p>
      <p>A chosen row has a printed tick and a heavier weight, never a colour. Focus stays on the well the whole time and the rows are read through aria-activedescendant. Space or Enter toggles the reached row. Give it a name and every chosen value goes with a form, one hidden input each.</p>
    </>
  ),
  whenToUse: ['To pick any number of named options from a list that is too long to show.', 'For the rooms, days or devices a setting applies to.', 'In a settings sheet, next to text fields and a Select.'],
  whenNot: [
    { situation: 'Picking exactly one option', to: '/components/select', label: 'Select' },
    { situation: 'Showing a short list that fits on the screen', to: '/components/listbox', label: 'Listbox' },
    { situation: 'Two or three yes-or-no choices', to: '/components/checkbox', label: 'Checkbox' },
    { situation: 'Typing values that are not in a list', to: '/components/input', label: 'Input' },
  ],
  variants: {
    count: { purpose: 'Prints how many are chosen, such as 3 chosen. The well stays one row tall.', pairing: 'Beside other 44px fields, in a sheet where the layout must not move.' },
    chips: { purpose: 'Stands each chosen value in the well as a removable Chip.', pairing: 'Short lists where people need to see and remove single values.' },
  },
  anatomy: {
    render: <MultiSelect label="Rooms" placeholder="Choose rooms" options={ROOMS} defaultValue={['kitchen', 'bedroom']} />,
    parts: [
      { part: 'Label', selector: '[data-component="MultiSelect"] > span', what: 'The printed name, above the start of the well.' },
      { part: 'Well', selector: '[data-component="MultiSelect"] [role="combobox"]', what: 'The same recess as Select, the width of the column.' },
      { part: 'Value', selector: '[data-component="MultiSelect"] [role="combobox"] > span', what: 'The count in primary ink, or the placeholder in secondary ink.' },
      { part: 'Chevron', selector: '[data-component="MultiSelect"] [role="combobox"] > svg', what: 'A printed chevron at the end of the well. It turns over while the list is open.' },
      { part: 'Panel', selector: '[data-component="MultiSelect"] [role="listbox"]', what: 'A plastic panel above the page, with one short shadow. Hidden until opened.' },
    ],
  },
  sizes: {
    md: { use: '44px well and 44px rows. Fields in a unit and in settings sheets.', pairs: 'Other 44px controls such as Input, Select and Button.' },
    lg: { use: '52px well with larger text. The main choice of a sheet on a phone.', pairs: 'A large Select or Button in the same sheet.' },
  },
  emphasis: { na: 'A multi-select is never the loud part of a unit. It has no orange, and the chosen rows are marked in ink and weight.' },
  placement: {
    rows: [['One per row, full width', 'In a settings sheet, under its label, with fields around it.'], ['Before the orange key', 'The choices are made first and the key that applies them comes last.'], ['Near the bottom of the screen', 'The panel opens under the well, so leave room below it.']],
    examples: [{ title: 'Before the orange key', render: <Unit><Stack gap="md"><MultiSelect label="Rooms to heat" options={ROOMS} defaultValue={['hall', 'living']} /><Button kind="primary">Apply</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['MultiSelect + Button', 'The multi-select picks the rooms and the orange key applies them.'], ['MultiSelect + Select', 'A mode from one list and the rooms it applies to from another, each with its own label.']],
    avoid: [{ title: 'a multi-select for one choice', why: 'Nobody needs a tick list to pick one value. A Select closes after the pick and says so.', render: <Unit><Select label="Mode" options={MODES} defaultValue="heat" /></Unit> }],
  },
  content: {
    formula: <p>Label the setting with a plural noun, such as <em>Rooms</em> or <em>Speakers</em>. Options are short nouns in sentence case. The placeholder starts with a verb: <em>Choose rooms</em>.</p>,
    pair: {
      do: <MultiSelect label="Rooms" placeholder="Choose rooms" options={ROOMS} defaultValue={['kitchen']} />, doNote: 'A plural noun for the label and a prompt inside.',
      dont: <MultiSelect label="Please tick all the rooms you want" options={ROOMS} defaultValue={['kitchen']} />, dontNote: 'An instruction as the label.',
    },
    overflow: { text: 'In count mode the well never grows. In chips mode the chips wrap onto new rows and the well grows with them. Long options wrap in the panel.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))' }}><MultiSelect display="chips" label="Scenes" options={[{ value: 'a', label: 'Evening in the living room with the reading lamp on' }, { value: 'b', label: 'Morning in the kitchen' }]} defaultValue={['a', 'b']} /></div> },
    rtl: { text: 'In right-to-left languages the label starts on the right and the chevron moves to the left end of the well.', render: <div dir="rtl"><MultiSelect label="الغرف" options={[{ value: 'k', label: 'المطبخ' }, { value: 'l', label: 'غرفة المعيشة' }]} defaultValue={['k']} /></div> },
    expansion: { text: 'German and Finnish options can run 30% longer. The panel is as wide as the well and long options wrap.', render: <MultiSelect label="Räume" options={[{ value: 'k', label: 'Küche und Esszimmer' }, { value: 'w', label: 'Wohnzimmer' }]} defaultValue={['k']} /> },
  },
  behaviours: {
    states: [
      ['Closed', 'A recess with the count, or the chips, and a printed chevron.', 'The label is printed above it.'],
      ['Focus', 'The same dark 2px ring as every part, around the well.', 'It stays on the well while the list is open.'],
      ['Open', 'The panel rises from the well and stays open while you choose.', 'The chevron turns over.'],
      ['Active row', 'The row under the keys or the pointer becomes a small recess.', 'Never a coloured bar.'],
      ['Chosen', 'A printed tick and medium weight in primary ink.', 'Never orange and never a fill.'],
      ['Disabled', 'The well loses its shadow and fades to half.', 'It cannot be opened and leaves the tab order.'],
    ],
    interactions: [
      ['Keyboard', 'Down, Up, Enter or Space', 'Opens the list on the first chosen row.', 'role combobox, aria-expanded'],
      ['Keyboard', 'Arrow keys, Home, End, Page Up, Page Down', 'Move through the open list and skip rows that cannot be chosen.', 'aria-activedescendant'],
      ['Keyboard', 'Space or Enter', 'Toggles the reached row. The list stays open.', 'aria-selected'],
      ['Keyboard', 'Ctrl+A', 'Toggles every row that can be chosen.', 'aria-multiselectable'],
      ['Keyboard', 'Letters', 'Jump to the next row that starts with what you typed.', 'type-ahead'],
      ['Keyboard', 'Escape', 'Close the list. Focus stays on the well.', 'aria-expanded'],
      ['Pointer', 'Press the well, press a row, press a chip’s remove key', 'Opens the list, toggles a row, removes a chip. A press outside closes it.', 'listbox, option'],
      ['Screen reader', 'Read', 'Announced as a combobox with its label and the count; rows are read as selected or not.', 'aria-multiselectable'],
    ],
    loading: <p>MultiSelect has no loading state. Load the options before you show the field. Each toggle calls onValueChange at once; when the device has to confirm, keep the new values in the well and show the wait on the unit’s display.</p>,
    focus: <p>MultiSelect is never focused on page load. While the list is open, focus stays on the well. After a chip is removed, focus moves back to the well.</p>,
  },
  deepDive: {
    count: {
      purpose: <p>The default. The well prints a number, so it stays one row tall whatever is chosen.</p>,
      context: <Unit><MultiSelect label="Heating days" placeholder="Choose days" options={[{ value: 'mon', label: 'Monday' }, { value: 'tue', label: 'Tuesday' }, { value: 'wed', label: 'Wednesday' }]} defaultValue={['mon', 'tue']} /></Unit>,
      practices: ['Use it for long lists, where chips would fill the sheet.', 'Say what was counted in the label: Heating days.', 'Let the unit’s display name the chosen values when they matter.'],
      pair: { do: <MultiSelect label="Heating days" options={ROOMS} defaultValue={['kitchen', 'hall']} />, doNote: 'The number reads in black and white.', dont: <MultiSelect label="Days" options={ROOMS} defaultValue={[]} placeholder="0 chosen" />, dontNote: 'A placeholder that pretends to be a count.' },
    },
    chips: {
      purpose: <p>The well stands each chosen value as a small removable key. Use it when a person needs to see and remove single values.</p>,
      context: <Unit><MultiSelect display="chips" label="Rooms" placeholder="Choose rooms" options={ROOMS} defaultValue={['kitchen', 'bedroom']} /></Unit>,
      practices: ['Keep it to short lists. The well grows by one row for every few chips.', 'Keep option labels short so the chips stay on few rows.', 'Do not place the field where the layout under it must not move.'],
      pair: { do: <MultiSelect display="chips" label="Rooms" options={ROOMS} defaultValue={['kitchen', 'hall']} />, doNote: 'Two short chips.', dont: <MultiSelect display="chips" label="Rooms" options={ROOMS} defaultValue={['kitchen', 'hall', 'living', 'bedroom', 'bath']} />, dontNote: 'Every option chosen: the chips fill the sheet. Count them instead.' },
    },
  },
  modifiers: [
    {
      name: 'placeholder',
      rules: <p>A grey prompt in the well before anything is chosen. It never replaces the label.</p>,
      pair: { do: <MultiSelect label="Play on" placeholder="Choose speakers" options={ROOMS} />, doNote: 'A label above and a prompt inside.', dont: <MultiSelect label="Rooms" placeholder="Choose" options={ROOMS} defaultValue={['hall']} />, dontNote: 'A placeholder on a field that already has values, so it is never seen.' },
    },
    {
      name: 'disabled',
      rules: <p>The field cannot be opened and Tab skips it. The values stay readable. Say on the unit why. A single option can also be disabled with <code>disabled</code> on the option.</p>,
      pair: { do: <Stack gap="sm"><p className="flush">Heating, locked by the schedule</p><MultiSelect label="Rooms" options={ROOMS} defaultValue={['hall']} disabled /></Stack>, doNote: 'The display says why the choice is locked.', dont: <MultiSelect label="Rooms" options={ROOMS} defaultValue={['hall']} disabled />, dontNote: 'A locked field with no reason anywhere.' },
    },
  ],
  related: [['/components/select', 'Select', 'Exactly one option, and the panel closes after it.'], ['/components/listbox', 'Listbox', 'The same rows, always open.'], ['/components/chip', 'Chip', 'The key that stands in the well.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Combobox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/', why: 'The roles and keyboard map the well follows.' },
    { title: 'WAI-ARIA Authoring Practices · Listbox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/', why: 'The multiselectable listbox in the panel.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why a chosen row is a tick and a weight instead of a fill.' },
  ],
};
