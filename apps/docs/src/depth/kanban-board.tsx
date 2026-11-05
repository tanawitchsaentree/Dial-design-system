// Usage tab for KanbanBoard (component-depth.md U1–U14). KanbanBoard holds columns of cards that move between columns.
import { Button, KanbanBoard, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing', limit: 2 },
  { id: 'done', title: 'Done' },
];
const CARDS = [
  { id: 'kettle', title: 'Descale the kettle', detail: 'Mali, this week' },
  { id: 'filters', title: 'Order boiler filters', detail: 'Due Friday' },
  { id: 'lamp', title: 'Replace the hall lamp' },
  { id: 'rads', title: 'Bleed the radiators' },
];
const wide = (children: React.ReactNode) => <div style={{ inlineSize: '100%', maxInlineSize: '100%' }}>{children}</div>;
const board = (extra: Partial<React.ComponentProps<typeof KanbanBoard>> = {}) => (
  wide(<KanbanBoard label="Chores for the week" columns={COLUMNS} cards={CARDS} defaultValue={{ todo: ['kettle', 'filters'], doing: ['lamp'], done: ['rads'] }} {...extra} />)
);

export const KANBANBOARD: Depth = {
  overview: (
    <>
      <p>KanbanBoard is for work or chores that pass through named stages, such as To do, Doing and Done. Each stage is a column, each task is a card, and the small window beside a column title counts its cards.</p>
      <p>Dragging is one way to move a card and never the only way. Every card has a Move key that opens a choice of columns, and a focused card takes Alt with the arrow keys. A polite status reads out each move.</p>
    </>
  ),
  whenToUse: ['To follow tasks through two to five stages that each hold a few cards.', 'To limit how much work is open at once with a count and a limit per column.'],
  whenNot: [
    { situation: 'Choosing rows to put in or leave out of a set', to: '/components/transfer-list', label: 'TransferList' },
    { situation: 'A plain list of rows with no stages', to: '/components/list', label: 'List' },
  ],
  variants: { na: 'KanbanBoard has one look, open columns split by a seam. What changes is set by props and covered under Modifiers.' },
  anatomy: {
    render: board(),
    parts: [
      { part: 'Column', selector: '[data-component="KanbanBoard"] > section:nth-of-type(1)', what: 'A named list with a seam on its inline start; it keeps its width whatever it holds.' },
      { part: 'Count window', selector: '[data-component="KanbanBoard"] > section:nth-of-type(2) > div:first-child > span', what: 'A small recessed window with the number of cards, and the limit when there is one.' },
      { part: 'Card', selector: '[data-component="KanbanBoard"] [data-card-id]', what: 'A Card with a title, an optional detail line, a grip and a Move key.' },
      { part: 'Move key', selector: '[data-component="KanbanBoard"] [data-card-id] button', what: 'A 44px key that opens a choice of the other columns.' },
      { part: 'Empty slot', selector: '[data-component="KanbanBoard"] section p', what: 'A recessed slot with one line of words, shown in a column with no cards.' },
    ],
  },
  sizes: { na: 'KanbanBoard has one size. Cards use the small Card padding and the keys are 44px.' },
  emphasis: { na: 'A board is never the loud part of a unit. Nothing in it is orange, so the orange stays free for the key that saves the board.' },
  placement: {
    rows: [['As the main part of a screen', 'Give it the full width. Columns keep their width and the row scrolls sideways when they do not fit.'], ['Inside a unit', 'Put the orange key that saves after the board.']],
    examples: [{ title: 'In a unit with a save key', render: <Unit><Stack gap="lg">{board()}<Button kind="primary">Save board</Button></Stack></Unit> }],
  },
  combinations: {
    good: [['KanbanBoard + Button', 'The orange key that saves comes after the board.'], ['KanbanBoard + Text', 'A line under it can say what the limit is for.']],
    avoid: [{ title: 'a board of one column', why: 'A single column has nowhere to move a card to. Use a List.', render: <Unit>{wide(<KanbanBoard label="Chores" columns={[{ id: 'a', title: 'To do' }]} cards={CARDS.slice(0, 2)} />)}</Unit> }],
  },
  content: {
    formula: <p>Name each column with a noun for the stage, as in <em>In progress</em>. Write each card as a short phrase that starts with a verb, as in <em>Descale the kettle</em>, because the title is also in the Move key and in the status.</p>,
    pair: {
      do: board({ columns: [{ id: 'todo', title: 'To do' }, { id: 'done', title: 'Done' }], defaultValue: { todo: ['kettle'], done: ['rads'] } }), doNote: 'Stages are nouns and cards start with a verb.',
      dont: board({ columns: [{ id: 'todo', title: 'Things we still need to get round to doing' }, { id: 'done', title: 'Finished!!' }], defaultValue: { todo: ['kettle'], done: ['rads'] } }), dontNote: 'A sentence for a column title wraps and says nothing the count does not.',
    },
    overflow: { text: 'A long card title wraps inside its card and the card grows. Columns keep their width, and the board scrolls sideways when the columns do not fit.', render: board({ cards: [{ id: 'kettle', title: 'Descale the kettle in the kitchen and then run two cycles of plain water', detail: 'Mali, this week' }], defaultValue: { todo: ['kettle'] } }) },
    rtl: { text: 'In right-to-left languages the first column sits on the right, the grips and keys move to the inline end, and Alt with the left arrow moves a card to the next column.', render: <div dir="rtl">{board({ label: 'مهام الأسبوع', columns: [{ id: 'todo', title: 'للإنجاز' }, { id: 'done', title: 'منجز' }], cards: [{ id: 'kettle', title: 'إزالة الترسبات من الغلاية' }], defaultValue: { todo: ['kettle'] }, emptyText: 'لا بطاقات' })}</div> },
    expansion: { text: 'German and Finnish titles can run 30% longer. They wrap and the columns do not change width.', render: board({ label: 'Aufgaben', columns: [{ id: 'todo', title: 'Offen' }, { id: 'done', title: 'Erledigt' }], cards: [{ id: 'kettle', title: 'Wasserkocher entkalken', detail: 'Diese Woche' }], defaultValue: { todo: ['kettle'] }, emptyText: 'Keine Karten' }) },
  },
  behaviours: {
    states: [
      ['Default', 'Cards in columns, each count in its window.', 'The board is a group; each column is a section named by its title.'],
      ['Focus', 'A dark ring around the card that holds the keyboard focus.', 'The card is a list item with a name and a hint.'],
      ['Carried', 'The card follows the pointer and rises by a key’s shadow; a line on a card’s edge marks where it will land.', 'The card is read as unchanged until it is dropped; the move is announced after.'],
      ['Over the limit', 'The figures read 3/2 in medium weight with a warning mark.', 'The count is read out as “3 of 2 cards, over the limit”.'],
      ['Card disabled', 'The card fades to half and has no grip.', 'The Move key is disabled; Alt with the arrows does nothing.'],
      ['Empty column', 'A recessed slot with a line of words.', 'The words are read in the column.'],
      ['Moved', 'The card stands in its new place and keeps the focus.', 'A polite status reads the title, the column and the position.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches each card, then its Move key, in reading order.', 'native'],
      ['Keyboard', 'Up and down arrows', 'Move the focus to the card above or below in the same column.', 'keydown'],
      ['Keyboard', 'Alt with left or right arrow', 'Moves the card to the next or previous column, at the same position. In right-to-left the arrows swap.', 'keydown'],
      ['Keyboard', 'Alt with up or down arrow', 'Moves the card one place up or down in its column.', 'keydown'],
      ['Keyboard', 'Enter on a Move key, then a column', 'Moves the card to the end of that column.', 'menu'],
      ['Pointer', 'Drag the grip', 'Carries the card; a line shows where it will land. Escape lets go and the card stays.', 'pointer events'],
    ],
    loading: <p>KanbanBoard has no loading state. Show it when the cards are known.</p>,
    focus: <p>The first Tab lands on the first card. After a move, focus follows the card to its new place, so the person can keep moving it.</p>,
  },
  deepDive: { na: 'KanbanBoard has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'limit (column)',
      rules: <p>A limit is a work-in-progress count. It warns when a column holds more cards than the limit and never blocks a move, because the person may know why. Set it on the stages that should stay small.</p>,
      pair: { do: board(), doNote: 'The limit sits on Doing, the stage that should stay small.', dont: board({ columns: [{ id: 'todo', title: 'To do', limit: 1 }, { id: 'doing', title: 'Doing', limit: 1 }, { id: 'done', title: 'Done', limit: 1 }] }), dontNote: 'A limit on every column warns about everything, so it warns about nothing.' },
    },
    {
      name: 'drag',
      rules: <p>Set <code>drag</code> to <code>false</code> to remove the grips. The Move key and the Alt-arrows stay, so every move is still possible. Turn it off where a pointer drag would fight with scrolling.</p>,
      pair: { do: board({ drag: false }), doNote: 'No grips; keys and menu do the work.', dont: board({ drag: true, disabled: true }), dontNote: 'A disabled board with grips shows a handle that cannot be used.' },
    },
    {
      name: 'headingLevel',
      rules: <p>Column titles are headings, level 3 by default. Set 2 or 4 so the board sits in the outline of the page.</p>,
      pair: { do: board({ headingLevel: 4 }), doNote: 'Level 4 under a level 3 section.', dont: board({ headingLevel: 2 }), dontNote: 'Level 2 titles under a page that already has a level 3 heading skip the outline.' },
    },
    {
      name: 'disabled (card)',
      rules: <p>A card with <code>disabled</code> stays where it is. Say in its detail line why it cannot move.</p>,
      pair: { do: board({ cards: [{ id: 'kettle', title: 'Descale the kettle', detail: 'Booked with the landlord', disabled: true }], defaultValue: { todo: ['kettle'] } }), doNote: 'The detail says why it is fixed.', dont: board({ cards: [{ id: 'kettle', title: 'Descale the kettle', disabled: true }], defaultValue: { todo: ['kettle'] } }), dontNote: 'Nothing says why this card will not move.' },
    },
    {
      name: 'value and onValueChange',
      rules: <p>Pass <code>value</code>, a map from column id to card ids, with <code>onValueChange</code> to hold the arrangement yourself. Use <code>defaultValue</code> for the start of an uncontrolled board. <code>onMove</code> reports the single move.</p>,
      pair: { do: board(), doNote: 'Uncontrolled with defaultValue; the board keeps its own arrangement.', dont: board({ value: { todo: ['kettle'], doing: [], done: [] } }), dontNote: 'Controlled without onValueChange: the board can never change.' },
    },
  ],
  related: [['/components/transfer-list', 'TransferList', 'Choosing rows to put in or leave out of a set.'], ['/components/card', 'Card', 'The body each task is drawn on.'], ['/components/menu', 'Menu', 'The choice of columns the Move key opens.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Listbox, rearrangeable options', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/examples/listbox-rearrangeable/', why: 'Moving items by keys with a live status.' },
    { title: 'WCAG 2.2 · 2.5.7 Dragging Movements', url: 'https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html', why: 'Why a drag always needs a single-pointer alternative.' },
    { title: 'Kanban University · What is a WIP limit', url: 'https://kanban.university/', why: 'Why a column carries a limit.' },
  ],
};
