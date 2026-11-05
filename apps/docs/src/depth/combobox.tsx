// Usage tab for Combobox (component-depth.md U1–U14). Combobox is a text field that lists its options and narrows them as you type.
import { Avatar, Combobox, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'kids', label: 'Kids room' },
  { value: 'living', label: 'Living room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
];
const PEOPLE = [
  { value: 'maya', label: 'Maya Chen', leading: <Avatar name="Maya Chen" size="sm" /> },
  { value: 'noah', label: 'Noah Okafor', leading: <Avatar name="Noah Okafor" size="sm" /> },
  { value: 'mina', label: 'Mina Park', leading: <Avatar name="Mina Park" size="sm" /> },
];

export const COMBOBOX: Depth = {
  overview: (
    <>
      <p>Combobox is Input’s recessed well with a list under it. The person can read the options, or type a few letters and watch the list narrow to the rows that contain them. The letters that match are set in a heavier weight.</p>
      <p>Only a listed option can be chosen. Text that matches nothing is dropped when the person leaves the field, and the words go back to the last choice. Use it when the list is too long to read through, which is the point where Select stops being comfortable.</p>
    </>
  ),
  whenToUse: ['To choose one option from more than about eight, where typing is faster than scrolling.', 'When people know the word they want, such as a room, a person or a programme.', 'When each option can carry a small mark, such as an avatar, to tell similar names apart.'],
  whenNot: [
    { situation: 'Three to seven options that fit on the screen', to: '/components/select', label: 'Select' },
    { situation: 'Options that should all stay visible', to: '/components/listbox', label: 'Listbox' },
    { situation: 'Free text that is not checked against a list', to: '/components/input', label: 'Input' },
  ],
  variants: { na: 'Combobox has one look, a recessed well with a list under it. Its height is the size prop, covered under Sizes.' },
  anatomy: {
    render: <Combobox label="Room" placeholder="Type a room" options={ROOMS} defaultValue="kitchen" />,
    parts: [
      { part: 'Label', selector: '[data-component="Combobox"] > label', what: 'The printed name above the well. It names the field for assistive tech.' },
      { part: 'Field', selector: '[data-component="Combobox"] input[role="combobox"]', what: 'The text you type in, inside a recess with the inverse light. Focus stays here while the list is open.' },
      { part: 'Toggle', selector: '[data-component="Combobox"] button', what: 'A 44px key at the end of the well that opens and closes the list. It is not a tab stop.' },
    ],
  },
  sizes: {
    md: { use: '44px well and rows. Forms and settings sheets.', pairs: 'Other 44px controls such as Input, Select and Button.' },
    lg: { use: '52px well and rows with larger text. The main field of a sheet on a phone.', pairs: 'A large Input or Button in the same sheet.' },
  },
  emphasis: { na: 'A combobox is never the loud part of a unit. It has no orange, and the chosen row is marked by a tick and weight.' },
  placement: {
    rows: [['In a form column', 'The well takes the full width of the column, under its label. The list opens over what follows it.'], ['In a sheet on a phone', 'Use the lg size, and leave room below so the list is not cut off.']],
    examples: [{ title: 'In a settings unit', render: <Unit><Combobox label="Room" options={ROOMS} defaultValue="kitchen" /></Unit> }],
  },
  combinations: {
    good: [['Combobox + Avatar', 'A leading avatar tells apart people with similar names.'], ['Combobox + Button', 'The orange key that applies the choice comes after the field.']],
    avoid: [{ title: 'a combobox with three options', why: 'With so few rows nobody needs to type. Use a Select, or a Listbox if the rows should stay in view.', render: <Unit><Combobox label="Mode" options={[{ value: 'a', label: 'Comfort' }, { value: 'b', label: 'Eco' }, { value: 'c', label: 'Away' }]} defaultValue="b" /></Unit> }],
  },
  content: {
    formula: <p>Name the field with a noun that says what is being chosen, as in <em>Room</em> or <em>Share the schedule with</em>. Write each option as a short noun or a name, with no number and no full stop. Put the distinguishing word first, because the list matches anywhere in the label but the eye reads from the start.</p>,
    pair: {
      do: <Combobox label="Room" options={ROOMS.slice(0, 3)} defaultValue="kitchen" />, doNote: 'A noun for the field and a noun for each row.',
      dont: <Combobox label="Type to search for a room" options={[{ value: 'a', label: '1. Kitchen.' }, { value: 'b', label: '2. Kids room.' }]} />, dontNote: 'An instruction for a label, and numbers and stops in the rows.',
    },
    overflow: { text: 'A long label wraps inside its row, and the row grows. In the closed well a long choice is cut with an ellipsis.', render: <Combobox label="Programme" options={[{ value: 'a', label: 'Synthetics at 40 degrees with an extra rinse and a long spin' }, { value: 'b', label: 'Quick 30' }]} defaultValue="b" /> },
    rtl: { text: 'In right-to-left languages the tick, the mark and the words swap sides, and the toggle sits at the left.', render: <div dir="rtl"><Combobox label="الغرفة" options={[{ value: 'a', label: 'المطبخ' }, { value: 'b', label: 'غرفة النوم' }]} defaultValue="b" /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap and the rows grow with them.', render: <Combobox label="Betriebsart" options={[{ value: 'a', label: 'Komforttemperatur' }, { value: 'b', label: 'Absenkbetrieb' }]} defaultValue="a" /> },
  },
  behaviours: {
    states: [
      ['Default', 'The chosen words in primary ink, or a grey prompt before anything is chosen.', 'A text field with role combobox.'],
      ['Open', 'The list floats under the well and the chevron is turned over.', 'aria-expanded="true".'],
      ['Reached', 'A recessed plate behind the row, so it shows without colour.', 'Named by aria-activedescendant.'],
      ['Chosen', 'A tick and a medium weight in primary ink.', 'aria-selected="true".'],
      ['No match', 'One line in the list that says nothing matches. The list stays open.', 'Announced through a polite status.'],
      ['Row disabled', 'The row fades to half and the arrows skip it.', 'aria-disabled="true".'],
      ['Invalid', 'A red edge, and the message under the well with a glyph.', 'aria-invalid and aria-describedby.'],
      ['Disabled', 'The well loses its shadow and fades to half.', 'The field is disabled.'],
      ['Focus', 'A dark ring around the well.', 'The field holds focus, never a row.'],
    ],
    interactions: [
      ['Keyboard', 'Letters', 'Type to narrow the list. The first row that can be chosen is reached.', 'aria-autocomplete="list"'],
      ['Keyboard', 'Arrow Down and Arrow Up', 'Open the list, or move the reached row and skip disabled rows.', 'aria-activedescendant'],
      ['Keyboard', 'Page Up, Page Down', 'Jump ten rows.', 'aria-activedescendant'],
      ['Keyboard', 'Enter', 'Choose the reached row and close the list.', 'aria-selected'],
      ['Keyboard', 'Escape', 'Close the list and put back the chosen words. Focus stays in the field.', 'aria-expanded'],
      ['Keyboard', 'Tab', 'Leave the field. The list closes and text that is not an option is dropped.', 'native'],
      ['Pointer', 'Click the field or the toggle', 'Open the list with every row.', 'aria-expanded'],
      ['Pointer', 'Click a row', 'Choose it and close the list.', 'aria-selected'],
    ],
    loading: <p>Combobox has no loading state of its own. For options that load as you type, listen to <code>onInputChange</code>, pass the rows you receive, and keep the previous rows until the new ones arrive.</p>,
    focus: <p>Focus stays in the field the whole time, including while the list is open. The reached row is named through aria-activedescendant, so a screen reader reads it without focus moving.</p>,
  },
  deepDive: { na: 'Combobox has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'filter',
      rules: <p>Decides which options stay for the typed text. The default keeps options whose label contains the text, ignoring case. Pass your own to match a code or a nickname that is not in the label.</p>,
      pair: { do: <Combobox label="Room" options={ROOMS} defaultValue="kitchen" />, doNote: 'The default matches words in the label.', dont: <Combobox label="Room" options={ROOMS} filter={() => true} defaultValue="kitchen" />, dontNote: 'A filter that keeps every row makes typing do nothing.' },
    },
    {
      name: 'leading (option)',
      rules: <p>A small mark before the words, such as an avatar or a dot-matrix icon. The chosen option’s mark also shows at the start of the well. It is decoration only, so the label must still say who or what the row is.</p>,
      pair: { do: <Combobox label="Share with" options={PEOPLE} defaultValue="mina" />, doNote: 'An avatar with a name beside it.', dont: <Combobox label="Share with" options={PEOPLE.map((p) => ({ ...p, label: '' }))} />, dontNote: 'An avatar with no name cannot be typed to or read out.' },
    },
    {
      name: 'error and hint',
      rules: <p><code>hint</code> prints one short line under the well. <code>error</code> replaces it with the problem, marked with a glyph and words so it never relies on red. Say what to do, as in <em>Choose a room from the list</em>.</p>,
      pair: { do: <Combobox label="Room" options={ROOMS} error="Choose a room from the list." />, doNote: 'The message says what to do.', dont: <Combobox label="Room" options={ROOMS} error="Invalid." />, dontNote: 'One word does not say what is wrong.' },
    },
    {
      name: 'disabled',
      rules: <p>On the field, nothing can be typed or chosen. On one option, that row stays readable but the arrows skip it. Say in the row why it is off.</p>,
      pair: { do: <Stack gap="sm"><Combobox label="Mode" options={[{ value: 'eco', label: 'Eco' }, { value: 'boost', label: 'Boost, needs the hub online', disabled: true }]} defaultValue="eco" /></Stack>, doNote: 'The row says why it is off.', dont: <Combobox label="Mode" options={[{ value: 'eco', label: 'Eco' }, { value: 'boost', label: 'Boost', disabled: true }]} defaultValue="eco" />, dontNote: 'Nothing says why Boost is off.' },
    },
  ],
  related: [['/components/select', 'Select', 'The same list without typing, for shorter lists.'], ['/components/listbox', 'Listbox', 'The rows always open, in a window.'], ['/components/input', 'Input', 'Free text that is not checked against a list.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Combobox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/', why: 'The roles and the keyboard map Combobox follows, with list autocomplete.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why the chosen row is a tick and weight, and the matched letters are heavier, not only coloured.' },
    { title: 'WAI-ARIA Authoring Practices · Editable combobox with list autocomplete', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-autocomplete-list/', why: 'A worked example of typing to narrow a list.' },
  ],
};
