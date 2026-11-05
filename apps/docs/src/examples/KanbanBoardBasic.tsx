// @example Chores in three columns: press the Move key on a card, or focus a card and press Alt with an arrow key
import { KanbanBoard } from 'dial-react';

const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing' },
  { id: 'done', title: 'Done' },
];
const CARDS = [
  { id: 'kettle', title: 'Descale the kettle', detail: 'Mali, this week' },
  { id: 'filters', title: 'Order boiler filters', detail: 'Due Friday' },
  { id: 'lamp', title: 'Replace the hall lamp' },
  { id: 'rads', title: 'Bleed the radiators', detail: 'Upstairs first' },
];

export default function KanbanBoardBasic() {
  return (
    <KanbanBoard
      label="Chores for the week"
      columns={COLUMNS}
      cards={CARDS}
      defaultValue={{ todo: ['kettle', 'filters'], doing: ['lamp'], done: ['rads'] }}
    />
  );
}
