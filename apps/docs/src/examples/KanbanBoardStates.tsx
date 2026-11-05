// @example A card that stays put, an empty column, and German and Thai titles that wrap without moving the columns
import { KanbanBoard } from 'dial-react';

const COLUMNS = [
  { id: 'open', title: 'Offen' },
  { id: 'busy', title: 'In Arbeit', limit: 2 },
  { id: 'shut', title: 'เสร็จแล้ว' },
];
const CARDS = [
  { id: 'a', title: 'Heizungsanlage entlüften und Wasserdruck prüfen', detail: 'Fällig am Freitag' },
  { id: 'b', title: 'เปลี่ยนหลอดไฟในห้องโถง', detail: 'ชั้นล่าง' },
  { id: 'c', title: 'Locked by the landlord', detail: 'Cannot be moved', disabled: true },
];

export default function KanbanBoardStates() {
  return (
    <KanbanBoard
      label="Aufgaben im Haus"
      columns={COLUMNS}
      cards={CARDS}
      defaultValue={{ open: ['a', 'b'], busy: ['c'], shut: [] }}
      emptyText="Keine Karten"
    />
  );
}
