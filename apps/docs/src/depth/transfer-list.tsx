// Usage tab for TransferList (component-depth.md U1–U14). TransferList moves rows between two Listbox windows.
import { Button, Stack, TransferList } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'bathroom', label: 'Bathroom' },
];
const wide = (children: React.ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: '100%' }}>{children}</div>;

export const TRANSFERLIST: Depth = {
  overview: (
    <>
      <p>TransferList is for choosing a subset from a list that is too long to tick one row at a time, such as the rooms a schedule covers. The rows that are available stand in one window and the rows that are chosen stand in another, with a column of keys between them.</p>
      <p>Nothing is dragged. A person marks rows in a list with Space, then presses a named key or Alt with the arrow toward the other list. A polite status reads out how many rows moved and the new totals.</p>
    </>
  ),
  whenToUse: ['To build a subset from twenty or more rows, where you need to see both the pool and the result.', 'To choose rooms, devices or days that all belong in a schedule.'],
  whenNot: [
    { situation: 'Choosing a few rows from a short list', to: '/components/listbox', label: 'Listbox' },
    { situation: 'Choosing several from a list that should fold away', to: '/components/multi-select', label: 'MultiSelect' },
  ],
  variants: { na: 'TransferList has one look, two windows with a column of keys between. The extra keys that move every row are the moveAll prop, covered under Modifiers.' },
  anatomy: {
    render: <div style={{ inlineSize: '100%' }}><TransferList moveAll label="Rooms on the night schedule" options={ROOMS} defaultValue={['kitchen']} /></div>,
    parts: [
      { part: 'Available window', selector: '[data-component="TransferList"] > div:first-child [role="listbox"]', what: 'A Listbox of the rows not yet chosen, named by its printed label.' },
      { part: 'Keys', selector: '[data-component="TransferList"] > div:nth-child(2)', what: 'Round 44px keys, each named in words, that carry the marked rows across.' },
      { part: 'Chosen window', selector: '[data-component="TransferList"] > div:nth-child(3) [role="listbox"]', what: 'A Listbox of the chosen rows, kept in the order of the options.' },
      { part: 'Count', selector: '[data-component="TransferList"] > div:first-child > p', what: 'Rows in the window and how many are marked, printed under it.' },
    ],
  },
  sizes: {
    md: { use: '44px rows. Settings sheets and forms.', pairs: 'Other 44px controls such as Input and Button.' },
    lg: { use: '52px rows with larger text, for the main choice of a phone sheet.', pairs: 'A large Button in the same sheet.' },
  },
  emphasis: { na: 'TransferList is never the loud part of a unit. Its keys are body-coloured, so the orange stays free for the key that saves the choice.' },
  placement: {
    rows: [['In a settings sheet', 'Give it the full width of the column. Under about 550px wide it stacks, with the keys in a row between the windows.'], ['In a form', 'Put the orange key that saves after it.']],
    examples: [{ title: 'In a settings unit', render: <Unit><Stack gap="lg"><TransferList label="Rooms on the night schedule" options={ROOMS} defaultValue={['kitchen']} /><Button kind="primary">Save schedule</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['TransferList + Button', 'The orange key that saves comes after both windows.'], ['TransferList + Text', 'A line under it can say what the chosen rows will do.']],
    avoid: [{ title: 'a TransferList of three rows', why: 'Two windows and a column of keys cost more than they save. Use a Listbox with multiple.', render: <Unit><TransferList label="Rooms" options={ROOMS.slice(0, 3)} defaultValue={['kitchen']} /></Unit> }],
  },
  content: {
    formula: <p>Name the control with a noun for what is being built, as in <em>Rooms on the night schedule</em>. Keep the two window names as short nouns, such as <em>Available</em> and <em>Chosen</em>, or name them by what they are.</p>,
    pair: {
      do: <TransferList label="Rooms on the schedule" availableLabel="Rooms" chosenLabel="On the schedule" options={ROOMS} defaultValue={['kitchen']} />, doNote: 'Names that say what each window holds.',
      dont: <TransferList label="Select items to transfer" availableLabel="Left" chosenLabel="Right" options={ROOMS} defaultValue={['kitchen']} />, dontNote: 'Left and right mean nothing when the layout stacks or reads right to left.',
    },
    overflow: { text: 'A long row wraps inside its window and the row grows. The windows keep the height of six rows and scroll past that.', render: wide(<TransferList label="Programmes" options={[{ value: 'a', label: 'Synthetics at 40 degrees with an extra rinse and a long spin' }, { value: 'b', label: 'Quick 30' }]} defaultValue={['b']} />) },
    rtl: { text: 'In right-to-left languages the available window sits on the right, the keys point the other way and Alt with the left arrow moves rows to the chosen window.', render: <div dir="rtl">{wide(<TransferList label="الغرف" availableLabel="المتاحة" chosenLabel="المختارة" options={[{ value: 'a', label: 'المطبخ' }, { value: 'b', label: 'غرفة النوم' }]} defaultValue={['b']} addLabel="أضف" removeLabel="أزل" />)}</div> },
    expansion: { text: 'German and Finnish row names can run 30% longer. They wrap and the windows do not change size.', render: wide(<TransferList label="Räume" availableLabel="Verfügbar" chosenLabel="Ausgewählt" options={[{ value: 'a', label: 'Wohnzimmerbeleuchtung' }, { value: 'b', label: 'Schlafzimmerheizung' }]} defaultValue={['a']} />) },
  },
  behaviours: {
    states: [
      ['Default', 'Two windows, each row in secondary ink with an empty tick column.', 'The group is named by label; each window is a listbox.'],
      ['Marked', 'A tick and medium weight in primary ink on the row.', 'aria-selected="true" on the option.'],
      ['Key with nothing to carry', 'The key fades to half and takes no press.', 'The button is disabled.'],
      ['Row disabled', 'The row fades to half and stays in its window.', 'aria-disabled="true"; the arrows skip it.'],
      ['Moved', 'The rows stand in the other window and the counts change.', 'A polite status reads the move and the totals.'],
      ['Focus', 'A dark ring around the window or key that holds it.', 'The listbox holds focus, not the rows.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches the available window, the keys, then the chosen window.', 'native'],
      ['Keyboard', 'Arrows, Home, End, Space', 'Walk the rows and mark them, as in a Listbox.', 'aria-activedescendant'],
      ['Keyboard', 'Enter on a key', 'Carries the marked rows across. Focus goes back to a window that still has rows.', 'button'],
      ['Keyboard', 'Alt with the arrow toward the other window', 'Carries the marked rows across without leaving the list.', 'keydown'],
      ['Pointer', 'Click a row, then a key', 'Marks the row, then carries it.', 'aria-selected'],
    ],
    loading: <p>TransferList has no loading state. Show it when the options are known.</p>,
    focus: <p>The first Tab lands on the available window. After a move, focus returns to the window the rows left, or to the other one when that is empty, so the pressed key can fade without losing the person.</p>,
  },
  deepDive: { na: 'TransferList has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'moveAll',
      rules: <p>Adds two keys that move every row that is not disabled. Use it when most rows tend to go one way, such as starting from all devices and taking a few out.</p>,
      pair: { do: <TransferList moveAll label="Devices" options={ROOMS} defaultValue={['kitchen']} />, doNote: 'A pool of devices where most go in.', dont: <TransferList moveAll label="Rooms" options={ROOMS.slice(0, 2)} />, dontNote: 'Two rows do not need a move-all key.' },
    },
    {
      name: 'disabled (option)',
      rules: <p>A row with <code>disabled</code> stays in the window it is in and the all keys skip it. Say in its label why it cannot move.</p>,
      pair: { do: <TransferList label="Rooms" options={[{ value: 'a', label: 'Kitchen' }, { value: 'b', label: 'Cellar, no sensor', disabled: true }]} />, doNote: 'The row says why it is fixed.', dont: <TransferList label="Rooms" options={[{ value: 'a', label: 'Kitchen' }, { value: 'b', label: 'Cellar', disabled: true }]} />, dontNote: 'Nothing says why Cellar will not move.' },
    },
    {
      name: 'value and onValueChange',
      rules: <p>Pass <code>value</code> with <code>onValueChange</code> to hold the chosen values yourself, or <code>defaultValue</code> to let TransferList hold them. The value is the list of chosen values, in the order of <code>options</code>.</p>,
      pair: { do: <TransferList label="Rooms" options={ROOMS} defaultValue={['hallway']} />, doNote: 'The chosen values are the ones that move.', dont: <TransferList label="Rooms" options={ROOMS} defaultValue={['missing']} />, dontNote: 'A value that is not in options is ignored.' },
    },
  ],
  related: [['/components/listbox', 'Listbox', 'One always-open list; each TransferList window is one.'], ['/components/multi-select', 'MultiSelect', 'Several choices from a list that folds away.'], ['/components/checkbox', 'Checkbox', 'One yes or no among a few.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Rearrangeable Listbox', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/', why: 'Moving options between listboxes with buttons.' },
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why moving a row never needs a drag.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why the move and the totals are read out politely.' },
  ],
};
