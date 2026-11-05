// Usage tab for Table (component-depth.md U1–U14). Table prints rows of readings in flat ink.
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

const rooms = (sort?: 'ascending' | 'descending') => (
  <Table caption="Energy by room">
    <TableHead>
      <TableRow>
        <TableHeaderCell>Room</TableHeaderCell>
        <TableHeaderCell numeric sort={sort} onSort={sort ? () => {} : undefined}>kWh</TableHeaderCell>
      </TableRow>
    </TableHead>
    <TableBody>
      <TableRow><TableCell>Kitchen</TableCell><TableCell numeric>12.4</TableCell></TableRow>
      <TableRow><TableCell>Living room</TableCell><TableCell numeric>8.05</TableCell></TableRow>
      <TableRow><TableCell>Laundry</TableCell><TableCell numeric>103.2</TableCell></TableRow>
    </TableBody>
  </Table>
);

export const TABLE: Depth = {
  overview: (
    <>
      <p>Table prints rows and columns of readings, such as the energy each room used this week. The text is flat ink on the body and a seam is cut between the rows.</p>
      <p>A number column aligns to its end edge in tabular figures. When the columns are wider than the unit the table scrolls sideways, and that region takes a Tab stop so a keyboard can reach every column.</p>
    </>
  ),
  whenToUse: ['To compare the same facts across several rows, such as a device in each room.', 'To list readings where the person reads across a row and down a column.'],
  whenNot: [
    { situation: 'A short list of items with one line each', to: '/components/list', label: 'List' },
    { situation: 'A single number with a trend', to: '/components/stat', label: 'Stat' },
  ],
  variants: { na: 'Table has one look, flat rows with a seam between them. Sorting and number alignment are props, covered under Modifiers.' },
  anatomy: {
    render: rooms('ascending'),
    parts: [
      { part: 'Caption', selector: '[data-component="Table"] > caption', what: 'The table’s name, printed above the header.' },
      { part: 'Header cell', selector: '[data-component="Table"] thead th', what: 'A column label in medium weight, with a sort key when the column can be ordered.' },
      { part: 'Cell', selector: '[data-component="Table"] tbody td', what: 'One reading, with a seam above and below it.' },
    ],
  },
  sizes: { na: 'Table has one size. The sort key is 44px tall; the rows are as tall as their text and padding.' },
  emphasis: { na: 'Nothing in a Table is orange. The sorted column is told by its chevron and its ink.' },
  placement: {
    rows: [['A unit’s body', 'The table fills the width of its column and starts on the inset line.'], ['A narrow unit', 'It scrolls sideways instead of squeezing a column below its words.']],
    examples: [{ title: 'In a card', render: <Unit>{rooms()}</Unit> }],
  },
  combinations: {
    good: [['Table + Pagination', 'Pagination below the table moves between pages of rows.'], ['Table + Heading', 'A heading above names the group when one caption is not enough.']],
    avoid: [{ title: 'a Table used for layout', why: 'A table says its cells are related readings. Use Stack or Grid to place things.', render: <Unit><Table><TableBody><TableRow><TableCell>Logo</TableCell><TableCell>Menu</TableCell></TableRow></TableBody></Table></Unit> }],
  },
  content: {
    formula: <p>Name each column with a noun and put the unit in the header, as in <em>kWh</em> or <em>Day °C</em>, so the cells hold bare numbers. Give the table a caption that says what the rows are.</p>,
    pair: {
      do: rooms(), doNote: 'The unit is in the header and the cells hold numbers.',
      dont: <Table><TableBody><TableRow><TableCell>Kitchen</TableCell><TableCell>12.4 kilowatt hours used</TableCell></TableRow></TableBody></Table>, dontNote: 'The unit repeats in every row and the digits cannot line up.',
    },
    overflow: { text: 'Long words wrap inside their cell and nothing is clipped. When the columns cannot fit, the table scrolls sideways.', render: <Table><TableBody><TableRow><TableCell>Living room with the long sofa and the south window</TableCell><TableCell numeric>8.05</TableCell></TableRow></TableBody></Table> },
    rtl: { text: 'In right-to-left languages the columns start on the right and numbers still align to the end edge.', render: <div dir="rtl"><Table><TableBody><TableRow><TableCell>المطبخ</TableCell><TableCell numeric>12.4</TableCell></TableRow></TableBody></Table></div> },
    expansion: { text: 'German and Finnish headers can run 30% longer. They wrap in the header cell and the columns keep their grid.', render: <Table><TableHead><TableRow><TableHeaderCell>Stromverbrauch</TableHeaderCell><TableHeaderCell numeric>kWh</TableHeaderCell></TableRow></TableHead></Table> },
  },
  behaviours: {
    states: [
      ['Header', 'Medium weight, secondary ink.', 'Read as a column header with scope="col".'],
      ['Sortable', 'The label is a key with room for a chevron.', 'aria-sort="none" until the column is sorted.'],
      ['Sorted', 'Primary ink and an up or down chevron.', 'aria-sort="ascending" or "descending".'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to each sort key. A region that scrolls sideways is one more stop.', 'native'],
      ['Keyboard', 'Enter, Space', 'Presses the sort key.', 'button'],
      ['Screen reader', 'Read', 'Read as a table with its caption, column headers and sort order.', 'table, aria-sort'],
    ],
    loading: <p>Table has no loading state. Show a Skeleton in its place while the rows load.</p>,
    focus: <p>Focus rests on a sort key or on the scroll region, each with the ink ring. Sorting does not move focus.</p>,
  },
  deepDive: { na: 'Table has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'sort and onSort',
      rules: <p>Give a header <code>onSort</code> to make its label a key. Set <code>sort</code> to <code>ascending</code> or <code>descending</code> on the column that orders the rows, and <code>none</code> on the others. Mark one column sorted at a time and reorder your rows yourself.</p>,
      pair: { do: rooms('ascending'), doNote: 'One sorted column with a chevron.', dont: <Table><TableHead><TableRow><TableHeaderCell sort="ascending">Room</TableHeaderCell><TableHeaderCell sort="descending">kWh</TableHeaderCell></TableRow></TableHead></Table>, dontNote: 'Two sorted columns: the order of the rows is unclear.' },
    },
    {
      name: 'numeric',
      rules: <p>Set <code>numeric</code> on the header and on every cell of a number column, so the digits align to the end edge in tabular figures.</p>,
      pair: { do: rooms(), doNote: 'Digits of one place stand in one line.', dont: <Table><TableBody><TableRow><TableCell>Kitchen</TableCell><TableCell>12.4</TableCell></TableRow><TableRow><TableCell>Laundry</TableCell><TableCell>103.2</TableCell></TableRow></TableBody></Table>, dontNote: 'Numbers set to the start edge do not line up.' },
    },
  ],
  related: [['/components/list', 'List', 'A short list of items.'], ['/components/pagination', 'Pagination', 'Moving between pages of rows.'], ['/components/stat', 'Stat', 'One number with a trend.']],
  references: [
    { title: 'WAI-ARIA APG · Sortable Table', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/', why: 'How aria-sort and the sort key work together.' },
    { title: 'WCAG 2.2 · 1.3.1 Info and Relationships', url: 'https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html', why: 'Why headers carry scope.' },
    { title: 'WCAG 2.2 · 2.1.1 Keyboard', url: 'https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html', why: 'Why a scrolling region takes a Tab stop.' },
  ],
};
