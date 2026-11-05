// @example Dragging switched off with drag false: the grips go away and the Move key and Alt-arrows still work
import { KanbanBoard } from 'dial-react';

const COLUMNS = [
  { id: 'queue', title: 'Queue' },
  { id: 'playing', title: 'Playing next' },
];
const CARDS = [
  { id: 'a', title: 'Morning radio', detail: 'Kitchen speaker' },
  { id: 'b', title: 'Evening jazz', detail: 'Living room' },
  { id: 'c', title: 'Quiet hours', detail: 'Bedroom' },
];

export default function KanbanBoardKeysOnly() {
  return (
    <KanbanBoard
      label="Playlists by speaker"
      columns={COLUMNS}
      cards={CARDS}
      drag={false}
      headingLevel={4}
      defaultValue={{ queue: ['a', 'c'], playing: ['b'] }}
    />
  );
}
