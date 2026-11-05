// @example A limit on the Doing column: the window shows 3/2 with a warning mark, and the count is read out in words
import { KanbanBoard } from 'dial-react';

const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing', limit: 2 },
  { id: 'done', title: 'Done' },
];
const CARDS = [
  { id: 'kettle', title: 'Descale the kettle' },
  { id: 'filters', title: 'Order boiler filters' },
  { id: 'lamp', title: 'Replace the hall lamp' },
  { id: 'rads', title: 'Bleed the radiators' },
];

export default function KanbanBoardLimits() {
  return (
    <KanbanBoard
      label="Chores with a work limit"
      columns={COLUMNS}
      cards={CARDS}
      defaultValue={{ todo: ['kettle'], doing: ['filters', 'lamp', 'rads'] }}
    />
  );
}
