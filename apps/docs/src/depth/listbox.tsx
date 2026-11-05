// Usage tab for Listbox (component-depth.md U1–U14). Listbox is a list that stays open in a recessed window.
import { Icon, Listbox, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const MODES = [
  { value: 'comfort', label: 'Comfort' },
  { value: 'eco', label: 'Eco' },
  { value: 'away', label: 'Away' },
  { value: 'boost', label: 'Boost', disabled: true },
];
const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
];
const DEVICES = [
  { value: 'lamp', label: 'Floor lamp', leading: <Icon name="lamp" size="sm" /> },
  { value: 'heat', label: 'Radiator', leading: <Icon name="heat" size="sm" /> },
];

export const LISTBOX: Depth = {
  overview: (
    <>
      <p>Listbox prints every choice at once in one recessed window, the way a panel prints all its settings on the case. The chosen row is told by a tick and a heavier word. Nothing opens, so nobody has to learn what the list holds by pressing something.</p>
      <p>It is the open form of Select, and it takes more than one choice when you set <code>multiple</code>. It has one tab stop. Inside it the arrow keys walk the rows, and typing a letter jumps to the next row that starts with it.</p>
    </>
  ),
  whenToUse: ['To choose from three to ten options that fit on the screen without scrolling.', 'To choose several rooms, devices or days at once.', 'When the person should see all the options before choosing.'],
  whenNot: [
    { situation: 'A long list that would crowd the unit', to: '/components/select', label: 'Select' },
    { situation: 'Two or three modes that read as one control', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'A yes or no on one setting', to: '/components/switch', label: 'Switch' },
  ],
  variants: { na: 'Listbox has one look, a recessed window of rows. Choosing one row or many is the multiple prop, covered under Modifiers.' },
  anatomy: {
    render: <Listbox label="Heating mode" options={MODES} defaultValue="eco" />,
    parts: [
      { part: 'Label', selector: '[data-component="Listbox"] > span:first-child', what: 'The printed name above the window. It is also the list’s accessible name.' },
      { part: 'Window', selector: '[data-component="Listbox"] > [role="listbox"]', what: 'A recess with the inverse light that holds the rows and scrolls when there are many.' },
      { part: 'Row', selector: '[data-component="Listbox"] [role="option"]', what: 'One option, at least 44px tall. The reached row becomes a plate with a hairline.' },
      { part: 'Tick', selector: '[data-component="Listbox"] [role="option"] svg', what: 'A printed check that shows on each chosen row and stays empty on the others, so the words do not shift.' },
    ],
  },
  sizes: {
    md: { use: '44px rows. Lists in a unit and in settings sheets.', pairs: 'Other 44px controls such as Input, Select and Button.' },
    lg: { use: '52px rows with larger text. The main choice of a sheet on a phone.', pairs: 'A large Select or Button in the same sheet.' },
  },
  emphasis: { na: 'A listbox is never the loud part of a unit. It has no orange, and a chosen row is marked by a tick and weight.' },
  placement: {
    rows: [['In a form column', 'The window takes the full width of the column, under its label.'], ['In a sheet', 'Keep it to the rows that fit; the window scrolls past six.']],
    examples: [{ title: 'In a settings unit', render: <Unit><Listbox label="Heating mode" options={MODES} defaultValue="eco" /></Unit> }],
  },
  combinations: {
    good: [['Listbox + Button', 'The orange key that applies the choice comes after the list.'], ['Listbox + Text', 'A line under the list can count the rows chosen.']],
    avoid: [{ title: 'two listboxes side by side', why: 'Each needs the full column to keep its rows readable. Stack them, or use a Select for the second.', render: <Unit><Stack gap="sm"><Listbox label="Mode" options={MODES.slice(0, 2)} defaultValue="eco" /><Listbox label="Rooms" multiple options={ROOMS.slice(0, 2)} /></Stack></Unit> }],
  },
  content: {
    formula: <p>Name the list with a noun that says what is being chosen, as in <em>Heating mode</em> or <em>Rooms</em>. Write each option as a short noun or phrase, with no number and no full stop.</p>,
    pair: {
      do: <Listbox label="Heating mode" options={MODES.slice(0, 2)} defaultValue="eco" />, doNote: 'A noun for the list and a noun for each row.',
      dont: <Listbox label="Please select one of the following" options={[{ value: 'a', label: '1. Comfort.' }, { value: 'b', label: '2. Eco.' }]} />, dontNote: 'A sentence for a label, and numbers and stops in the rows.',
    },
    overflow: { text: 'A long label wraps inside its row, and the row grows. The tick stays at the start edge.', render: <Listbox label="Programme" options={[{ value: 'a', label: 'Synthetics at 40 degrees with an extra rinse and a long spin' }, { value: 'b', label: 'Quick 30' }]} defaultValue="b" /> },
    rtl: { text: 'In right-to-left languages the tick and the words swap sides and the window keeps its edges.', render: <div dir="rtl"><Listbox label="الوضع" options={[{ value: 'a', label: 'راحة' }, { value: 'b', label: 'اقتصادي' }]} defaultValue="b" /></div> },
    expansion: { text: 'German and Finnish labels can run 30% longer. They wrap and the rows grow with them.', render: <Listbox label="Betriebsart" options={[{ value: 'a', label: 'Komforttemperatur' }, { value: 'b', label: 'Absenkbetrieb' }]} defaultValue="a" /> },
  },
  behaviours: {
    states: [
      ['Default', 'Words in secondary ink, an empty tick column.', 'Each row is an option.'],
      ['Reached', 'A plate with a hairline behind the row, so it shows without colour.', 'Named by aria-activedescendant.'],
      ['Chosen', 'A tick and a medium weight in primary ink.', 'aria-selected="true".'],
      ['Row disabled', 'The row fades to half and the arrows skip it.', 'aria-disabled="true".'],
      ['List disabled', 'The window loses its shadow and fades to half.', 'aria-disabled on the listbox; no tab stop.'],
      ['Focus', 'A dark ring around the window.', 'The listbox holds focus, not the rows.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'One tab stop for the whole list. Focus lands on the first chosen row, or the first row.', 'native'],
      ['Keyboard', 'Arrow Up and Arrow Down', 'Move the reached row and skip rows that are disabled.', 'aria-activedescendant'],
      ['Keyboard', 'Home, End, Page Up, Page Down', 'Jump to the first or last row, or ten rows.', 'aria-activedescendant'],
      ['Keyboard', 'Letters', 'Jump to the next row whose label starts with what you type.', 'type-ahead, 500ms'],
      ['Keyboard', 'Space or Enter', 'Choose the reached row; in multiple, toggle it.', 'aria-selected'],
      ['Keyboard', 'Shift with arrows, Control with A', 'In multiple, toggle each row you reach, or choose all.', 'aria-multiselectable'],
      ['Pointer', 'Click', 'Choose the row, or toggle it in multiple.', 'aria-selected'],
    ],
    loading: <p>Listbox has no loading state. Show it when the options are known, or print a line in its place.</p>,
    focus: <p>Focus goes to the window, never to a row. The first Tab lands on the first chosen row, or the first row that can be chosen.</p>,
  },
  deepDive: { na: 'Listbox has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'multiple',
      rules: <p>Lets any number of rows be chosen. Space toggles the reached row and the value becomes an array in list order. Use it when the choices are not exclusive, such as rooms or days.</p>,
      pair: { do: <Listbox multiple label="Rooms" options={ROOMS} defaultValue={['kitchen']} />, doNote: 'Rooms are not exclusive.', dont: <Listbox multiple label="Heating mode" options={MODES.slice(0, 3)} defaultValue={['eco', 'away']} />, dontNote: 'Two modes cannot run together.' },
    },
    {
      name: 'leading (option)',
      rules: <p>A small mark before the words, such as a dot-matrix icon. It is decoration only, so the label must still say what the row is.</p>,
      pair: { do: <Listbox label="Device" options={DEVICES} defaultValue="lamp" />, doNote: 'An icon with a label that names it.', dont: <Listbox label="Device" options={[{ value: 'lamp', label: '', leading: <Icon name="lamp" size="sm" /> }, { value: 'heat', label: '', leading: <Icon name="heat" size="sm" /> }]} />, dontNote: 'An icon with no words cannot be read out or typed to.' },
    },
    {
      name: 'disabled',
      rules: <p>On the list, nothing can be chosen and Tab skips it. On one option, that row stays readable but the arrows skip it. Say next to the row why it is off.</p>,
      pair: { do: <Listbox label="Mode" options={[{ value: 'eco', label: 'Eco' }, { value: 'boost', label: 'Boost, needs the hub online', disabled: true }]} defaultValue="eco" />, doNote: 'The row says why it is off.', dont: <Listbox label="Mode" options={[{ value: 'eco', label: 'Eco' }, { value: 'boost', label: 'Boost', disabled: true }]} defaultValue="eco" />, dontNote: 'Nothing says why Boost is off.' },
    },
  ],
  related: [['/components/select', 'Select', 'The same rows in a panel that opens, for long lists.'], ['/components/segmented-control', 'SegmentedControl', 'Two to four modes as keys.'], ['/components/checkbox', 'Checkbox', 'One yes or no among a few.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Listbox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/', why: 'The keyboard map and the roles Listbox follows.' },
    { title: 'WCAG 2.2 · 1.4.1 Use of Color', url: 'https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html', why: 'Why a chosen row is a tick and weight and not only a colour.' },
    { title: 'GOV.UK Design System · Select', url: 'https://design-system.service.gov.uk/components/select/', why: 'When a list should be a select or an open list.' },
  ],
};
