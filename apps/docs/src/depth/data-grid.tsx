// Usage tab for DataGrid (component-depth.md U1–U14). DataGrid is a Table you walk by cell.
import { DataGrid, type DataGridColumn } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => (
  <div className="demo-box demo-card">
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>{children}</div>
  </div>
);

type Room = { id: string; room: string; device: string; kwh: number };
const rows: Room[] = [
  { id: 'k', room: 'Kitchen', device: 'Oven', kwh: 12.4 },
  { id: 'l', room: 'Living room', device: 'Heater', kwh: 8.05 },
  { id: 'w', room: 'Laundry', device: 'Washer', kwh: 103.2 },
  { id: 'h', room: 'Hall', device: 'Lamp', kwh: 1.9 },
];
const columns: DataGridColumn<Room>[] = [
  { key: 'room', header: 'Room', accessor: (r) => r.room, sortable: true },
  { key: 'device', header: 'Device', accessor: (r) => r.device },
  { key: 'kwh', header: 'kWh', accessor: (r) => r.kwh, numeric: true, sortable: true },
];
const grid = (extra: Partial<React.ComponentProps<typeof DataGrid<Room>>> = {}) => (
  <DataGrid<Room> caption="Energy by room" columns={columns} rows={rows} {...extra} />
);

export const DATA_GRID: Depth = {
  overview: (
    <>
      <p>DataGrid is a Table you walk by cell. It has one Tab stop; once inside, the arrow keys, Home, End and the Page keys move between cells, so a long grid costs one Tab to enter and one to leave.</p>
      <p>It adds three things to Table: sorting by column, a header that stays in view while the body scrolls, and optional row selection with checkboxes. It keeps Table’s flat printing and seams.</p>
    </>
  ),
  whenToUse: ['To let a person sort, scan and mark rows of the same facts.', 'For a few hundred rows that one person reads across and down.'],
  whenNot: [
    { situation: 'Rows that are only read, never sorted or marked', to: '/components/table', label: 'Table' },
    { situation: 'Thousands of items in one column', to: '/components/virtual-list', label: 'VirtualList' },
    { situation: 'A short list of items to choose from', to: '/components/list', label: 'List' },
  ],
  variants: { na: 'DataGrid has one look, Table’s flat printing. What it does is set by props, covered under Modifiers.' },
  anatomy: {
    render: grid({ selectionMode: 'multiple' }),
    parts: [
      { part: 'Window', selector: '[data-component="DataGrid"]', what: 'The grid. It scrolls inside a fixed number of rows.' },
      { part: 'Header cell', selector: '[data-component="DataGrid"] th[aria-sort]', what: 'A column label. A sortable one shows a chevron and carries aria-sort.' },
      { part: 'Cell', selector: '[data-component="DataGrid"] td[data-c="1"]', what: 'One reading, at least 44px tall. One cell at a time takes the Tab stop.' },
      { part: 'Select key', selector: '[data-component="DataGrid"] td[data-c="0"] input', what: 'A checkbox that marks the row. Its name is hidden from sight and read aloud.' },
    ],
  },
  sizes: { na: 'DataGrid has one size. Cells are at least 44px tall, the touch target.' },
  emphasis: { na: 'A grid is printing and an ink ring. Nothing in it is orange.' },
  placement: {
    rows: [['A page or a card body', 'The grid fills the width of its column. The header fills with the unit’s ground, so keep the grid on a unit.'], ['A sheet that edits many rows', 'Mark rows, then press one orange key below the grid.']],
    examples: [{ title: 'In a unit', render: <Unit>{grid({ visibleRows: 3 })}</Unit> }],
  },
  combinations: {
    good: [['DataGrid + Pagination', 'Page the data yourself and pass the current page as rows.'], ['DataGrid + Button', 'Mark rows, then one key below acts on them.']],
    avoid: [{ title: 'a button inside every cell', why: 'The grid has one Tab stop, so a button inside a cell cannot be reached by keyboard. Act on marked rows from one key below the grid.', render: <Unit><DataGrid<Room> caption="Energy by room" columns={[...columns.slice(0, 2), { key: 'x', header: 'Action', render: () => <span>Open</span> }]} rows={rows.slice(0, 2)} /></Unit> }],
  },
  content: {
    formula: <p>Name each column with a noun and put the unit in the header, as in <em>kWh</em>. Keep cell text to a few words.</p>,
    pair: {
      do: <Unit>{grid({ rows: rows.slice(0, 2) })}</Unit>, doNote: 'The unit is in the header; cells hold bare numbers.',
      dont: <Unit><DataGrid<Room> caption="Energy by room" columns={[{ key: 'r', header: 'Room', accessor: (r) => r.room }, { key: 'k', header: 'Use', accessor: (r) => `${r.kwh} kilowatt hours` }]} rows={rows.slice(0, 2)} /></Unit>, dontNote: 'The unit repeats in every row.',
    },
    overflow: { text: 'A long cell wraps inside its column. The row grows and the grid keeps its window.', render: <Unit><DataGrid<{ id: string; name: string }> caption="Notes" columns={[{ key: 'n', header: 'Note', accessor: (r) => r.name }]} rows={[{ id: '1', name: 'Turn the heating down by two degrees after eleven in the evening on every weekday' }]} /></Unit> },
    rtl: { text: 'In right-to-left languages the columns run from the right, and the left and right arrows swap so they follow the reading direction.', render: <div dir="rtl"><Unit><DataGrid<{ id: string; name: string; v: number }> caption="الغرف" columns={[{ key: 'n', header: 'الغرفة', accessor: (r) => r.name }, { key: 'v', header: 'كيلوواط', accessor: (r) => r.v, numeric: true }]} rows={[{ id: '1', name: 'المطبخ', v: 12 }]} /></Unit></div> },
    expansion: { text: 'German and Finnish headers can run 30% longer. They wrap and the cells keep their 44px height.', render: <Unit><DataGrid<Room> caption="Energieverbrauch" columns={[{ key: 'r', header: 'Verbrauch nach Raum', accessor: (r) => r.room }, { key: 'k', header: 'Kilowattstunden', accessor: (r) => r.kwh, numeric: true }]} rows={rows.slice(0, 2)} /></Unit> },
  },
  behaviours: {
    states: [
      ['Default', 'Flat ink, a seam under each row.', 'A grid with named columns.'],
      ['Focused cell', 'An ink ring drawn inside the cell edge.', 'The cell is announced with its header.'],
      ['Sorted', 'Primary ink on the header and an up or down chevron.', 'aria-sort ascending or descending.'],
      ['Marked row', 'A tick in the checkbox and a stronger seam under the row.', 'aria-selected on the row.'],
      ['Empty', 'One line of secondary ink across the grid.', 'Read as a cell in the body.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Enters the grid on one cell and leaves it on the next Tab.', 'roving tabindex'],
      ['Keyboard', 'Arrow keys', 'Move one cell. In right-to-left the left and right arrows swap.', 'native'],
      ['Keyboard', 'Home, End', 'First and last cell of the row. With Ctrl, the first and last cell of the grid.', 'native'],
      ['Keyboard', 'Page Up, Page Down', 'Move about one window of rows.', 'native'],
      ['Keyboard', 'Enter, Space', 'On a sortable header, sorts. On a cell in a selectable grid, marks the row.', 'native'],
      ['Pointer', 'Press a header', 'Sorts by that column: ascending, then descending, then your order.', 'click'],
      ['Screen reader', 'Read', 'Cells are read with their column header; the count of marked rows is announced.', 'role grid, aria-sort, aria-selected'],
    ],
    loading: <p>DataGrid has no loading state. Pass an empty <code>rows</code> with <code>empty</code> set to a loading line while data arrives.</p>,
    focus: <p>Tab puts focus on the cell last used, or the first header cell. The checkboxes and sort keys are not Tab stops of their own; use Space or Enter on the cell.</p>,
  },
  deepDive: { na: 'DataGrid has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'selectionMode',
      rules: <p><code>none</code> is the default. <code>single</code> keeps one row marked. <code>multiple</code> adds a select-all key in the header, which shows a dash when only some rows are marked. Give rows a stable <code>id</code> or <code>getRowKey</code>.</p>,
      pair: { do: <Unit>{grid({ selectionMode: 'multiple', defaultSelected: ['l'] })}</Unit>, doNote: 'Rows have ids, so a marked row stays marked after a sort.', dont: <Unit>{grid({ selectionMode: 'multiple', getRowKey: (_r, i) => String(i), defaultSelected: ['1'], defaultSort: { key: 'kwh', direction: 'descending' } })}</Unit>, dontNote: 'Keys by position: the marked row changes when the order does.' },
    },
    {
      name: 'sort and manualSort',
      rules: <p>Set <code>sortable</code> on a column to let its header sort. The grid orders rows by <code>accessor</code>, or by <code>compare</code>. Add <code>manualSort</code> when the server or your own code orders the rows; the grid then only shows the chevron and calls <code>onSortChange</code>.</p>,
      pair: { do: <Unit>{grid({ defaultSort: { key: 'kwh', direction: 'descending' } })}</Unit>, doNote: 'The chevron and the order agree.', dont: <Unit>{grid({ manualSort: true, defaultSort: { key: 'kwh', direction: 'descending' } })}</Unit>, dontNote: 'manualSort with rows you did not reorder: the chevron says descending and the rows are not.' },
    },
    {
      name: 'visibleRows',
      rules: <p>How many rows tall the window is before the body scrolls under the header. The default is 8. A grid with fewer rows is as short as its rows.</p>,
      pair: { do: <Unit>{grid({ visibleRows: 3 })}</Unit>, doNote: 'The window scrolls and the header stays.', dont: <Unit>{grid({ visibleRows: 1 })}</Unit>, dontNote: 'One row in view: the person cannot compare rows.' },
    },
  ],
  related: [['/components/table', 'Table', 'Rows that are only read.'], ['/components/virtual-list', 'VirtualList', 'Very long lists of one column.'], ['/components/pagination', 'Pagination', 'Moving between pages of rows.']],
  references: [
    { title: 'WAI-ARIA APG · Data Grid', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/', why: 'The keyboard map and roles this grid follows.' },
    { title: 'WAI-ARIA · aria-sort', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-sort', why: 'How a sorted column is announced.' },
    { title: 'WCAG 2.2 · 2.5.8 Target Size (Minimum)', url: 'https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html', why: 'Why cells are at least 44px tall.' },
  ],
};
