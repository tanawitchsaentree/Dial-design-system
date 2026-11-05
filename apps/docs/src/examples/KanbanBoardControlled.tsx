// @example The arrangement held in state, a line that reports the last move and the orange key that saves it
import { useState } from 'react';
import { Button, KanbanBoard, Stack, Text } from 'dial-react';
import type { KanbanMove, KanbanValue } from 'dial-react';

const COLUMNS = [
  { id: 'todo', title: 'To do' },
  { id: 'doing', title: 'Doing', limit: 3 },
  { id: 'done', title: 'Done' },
];
const CARDS = [
  { id: 'kettle', title: 'Descale the kettle' },
  { id: 'filters', title: 'Order boiler filters' },
  { id: 'lamp', title: 'Replace the hall lamp' },
];

export default function KanbanBoardControlled() {
  const [value, setValue] = useState<KanbanValue>({ todo: ['kettle', 'filters'], doing: ['lamp'], done: [] });
  const [last, setLast] = useState('Nothing moved yet.');
  const onMove = (m: KanbanMove) => setLast(`${m.cardId}: ${m.from} to ${m.to}, position ${m.index + 1}.`);
  return (
    <Stack gap="lg">
      <KanbanBoard label="Chores, saved on request" columns={COLUMNS} cards={CARDS} value={value} onValueChange={setValue} onMove={onMove} />
      <Text tone="secondary">{last}</Text>
      <Button kind="primary">Save board</Button>
    </Stack>
  );
}
