// @example placement anchored always stands by its key like Menu's panel, with no scrim and no Cancel key
import { useState } from 'react';
import { ActionSheet, Button } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetAnchored() {
  const [last, setLast] = useState('nothing yet');
  return (
    <div className="demo-box demo-card">
      <p className="flush">Bedroom heater · last action: {last}</p>
      <ActionSheet placement="anchored" title="Bedroom heater" detail="heat 04 · Bedroom" items={ACTIONS} onAction={setLast} trigger={<Button>Bedroom heater actions</Button>} />
    </div>
  );
}
