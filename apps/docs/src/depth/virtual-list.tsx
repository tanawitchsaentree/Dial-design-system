// Usage tab for VirtualList (component-depth.md U1–U14). VirtualList holds a very long list of rows in one short body.
import { Badge, VirtualList } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const Frame = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div>;
const devices = (n = 5000, rows = 4) => (
  <Frame><VirtualList label="Devices" count={n} visibleRows={rows} getItem={(i) => ({ index: i + 1, label: 'Device ' + (i + 1) })} /></Frame>
);

export const VIRTUAL_LIST: Depth = {
  overview: (
    <>
      <p>VirtualList is for a list too long to put in the page, such as every device in a building or every song in a library. It prints a window of rows, the six or so you can see, and swaps them as you scroll.</p>
      <p>The rows look like List rows and read as one listbox. Every row has the same height, which is what lets the scroll be true and the rows come and go without a jump.</p>
    </>
  ),
  whenToUse: ['To show hundreds or thousands of rows that all look alike.', 'To let a person jump to a place in a long list with the keyboard or from code.'],
  whenNot: [
    { situation: 'A short list of rows with a state in words under each name', to: '/components/list', label: 'List' },
    { situation: 'A table with columns', to: '/components/table', label: 'Table' },
    { situation: 'Picking one value from a menu of options', to: '/components/select', label: 'Select' },
  ],
  variants: { na: 'VirtualList has one look, the List body with a scroller inside it. How tall the window is comes from visibleRows.' },
  anatomy: {
    render: devices(),
    parts: [
      { part: 'Body', selector: '[data-component="VirtualList"]', what: 'The plastic body with the unit shadow.' },
      { part: 'Window', selector: '[data-component="VirtualList"] > [role="listbox"]', what: 'The scrolling listbox, the one tab stop.' },
      { part: 'Row', selector: '[data-component="VirtualList"] [role="option"]', what: 'One fixed-height List row, with its index, name and end part.' },
    ],
  },
  sizes: { na: 'VirtualList has one row height, control.lg, so every row is at least 44px. Change how many rows show with visibleRows.' },
  emphasis: { na: 'Nothing in a VirtualList is orange. The chosen row is told by an ink mark and medium weight.' },
  placement: {
    rows: [['A screen of its own', 'The list fills the column and the window shows six rows.'], ['Beside a detail view', 'Choosing a row opens its detail next to it.']],
    examples: [{ title: 'In a unit', render: <Unit>{devices(2000, 3)}</Unit> }],
  },
  combinations: {
    good: [['VirtualList + Badge', 'A Badge at the end of a row tells its state in a lamp and a word.'], ['VirtualList + Button', 'A key outside the list calls scrollToIndex to jump to a row.']],
    avoid: [{ title: 'A VirtualList of five rows', why: 'Five rows fit in the page without windowing. Use List, which also lets a row hold a state in words.', render: <Unit>{devices(5, 5)}</Unit> }],
  },
  content: {
    formula: <p>Name each row with a short noun phrase on one line, as in <em>Kitchen lamp</em>. A row has one fixed height, so a name that runs past the end is cut.</p>,
    pair: {
      do: devices(30, 2), doNote: 'Short names that fit on one line.',
      dont: <Frame><VirtualList label="Long names" count={30} visibleRows={2} getItem={(i) => ({ label: 'The heating schedule for the whole of the upstairs rooms in the winter, number ' + (i + 1) })} /></Frame>, dontNote: 'The name is cut at the end of the row.',
    },
    overflow: { text: 'A name longer than the row is cut. Shorten it, or use List where rows may grow.', render: <Frame><VirtualList label="Long" count={20} visibleRows={2} getItem={() => ({ label: 'A very long name for a device that does not fit on a single line of the row', trailing: <Badge>On</Badge> })} /></Frame> },
    rtl: { text: 'In right-to-left languages the index sits on the right and the mark on the right edge.', render: <div dir="rtl"><Frame><VirtualList label="الأجهزة" count={100} visibleRows={2} getItem={(i) => ({ index: i + 1, label: 'جهاز ' + (i + 1) })} /></Frame></div> },
    expansion: { text: 'German and Finnish names run 30% longer. They stay on one line while they fit.', render: <Frame><VirtualList label="Geräte" count={100} visibleRows={2} getItem={(i) => ({ index: i + 1, label: 'Heizungsthermostat ' + (i + 1) })} /></Frame> },
  },
  behaviours: {
    states: [
      ['Default', 'Rows in secondary and primary ink on the body.', 'A listbox with each row an option.'],
      ['Chosen', 'An ink mark at the start of the row and medium weight.', 'aria-selected="true".'],
      ['Active', 'A dark ring on the row the keys point to.', 'aria-activedescendant names it.'],
      ['Pressed', 'The row sinks into a small recess.', 'No change.'],
      ['Disabled', 'The row fades to half.', 'aria-disabled="true".'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves focus into the window. The first row in view, or the chosen row, becomes active.', 'native'],
      ['Keyboard', 'Arrow Up and Arrow Down', 'Move the active row by one and scroll it into view. Disabled rows are skipped.', 'handled'],
      ['Keyboard', 'Page Up and Page Down', 'Move the active row by one window less a row.', 'handled'],
      ['Keyboard', 'Home and End', 'Move to the first and the last row, however far away.', 'handled'],
      ['Keyboard', 'Enter and Space', 'Choose the active row.', 'handled'],
      ['Pointer', 'Press a row', 'Chooses it.', 'handled'],
      ['Screen reader', 'Read', 'Each row announces its place, such as 12 of 5000, from aria-posinset and aria-setsize.', 'listbox, option'],
    ],
    loading: <p>VirtualList has no loading state. Pass a count you know. If the rows come from a server, show a Skeleton until the first page arrives.</p>,
    focus: <p>Focus goes to the window, not to a row. Moving the active row never moves focus, so a screen reader stays in one place.</p>,
  },
  deepDive: { na: 'VirtualList has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'visibleRows',
      rules: <p>How many rows tall the window is. Between three and eight is easy to scan. If there are fewer rows than this, the body shrinks to fit them.</p>,
      pair: { do: devices(5000, 5), doNote: 'Five rows: the window is short and the page keeps its shape.', dont: devices(5000, 12), dontNote: 'Twelve rows make the body taller than most screens.' },
    },
    {
      name: 'value',
      rules: <p>The chosen row’s index. Pass <code>value</code> and <code>onValueChange</code> to control it, or <code>defaultValue</code> to leave it to the list. Use the index, not the name, because rows have no other identity.</p>,
      pair: { do: <Frame><VirtualList label="Chosen" count={500} visibleRows={3} defaultValue={1} getItem={(i) => ({ label: 'Row ' + (i + 1) })} /></Frame>, doNote: 'The second row starts chosen.', dont: devices(500, 3), dontNote: 'Nothing is chosen, so Enter has nothing to confirm until the keys move.' },
    },
  ],
  related: [['/components/list', 'List', 'A short list whose rows may grow and hold a state in words.'], ['/components/table', 'Table', 'Rows with columns.'], ['/components/listbox', 'Listbox', 'Choosing one value from a short list of options.']],
  references: [
    { title: 'WAI-ARIA APG · Listbox pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/', why: 'The keys and roles the window follows.' },
    { title: 'WAI-ARIA · aria-setsize and aria-posinset', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-posinset', why: 'How rows that are not in the page still report their place.' },
    { title: 'web.dev · Virtualize large lists', url: 'https://web.dev/articles/virtualize-long-lists-react-window', why: 'Why only the rows in view are kept in the page.' },
  ],
};
