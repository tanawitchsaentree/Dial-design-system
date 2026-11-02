// @example An action that cannot run now keeps its place and fades; the others still run
import { useState } from 'react';
import { ActionSheet, Button } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room', disabled: true },
  { value: 'update', label: 'Update now' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetDisabled() {
  const [last, setLast] = useState('nothing yet');
  return (
    <div className="demo-box demo-card">
      <p className="flush">Porch light is the only lamp outside, so it cannot move · last action: {last}</p>
      <ActionSheet title="Porch light" detail="lamp 07 · Outside" items={ACTIONS} onAction={setLast} trigger={<Button>Porch light actions</Button>} />
    </div>
  );
}
