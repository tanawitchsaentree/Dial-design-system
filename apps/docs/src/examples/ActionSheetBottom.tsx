// @example placement bottom always rises from the bottom edge with the Cancel key, even on a wide screen
import { useState } from 'react';
import { ActionSheet, Button } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function ActionSheetBottom() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState('nothing yet');
  return (
    <div className="demo-box demo-card">
      <p className="flush">Hall speaker · last action: {last}</p>
      <Button onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>Hall speaker actions</Button>
      <ActionSheet open={open} onOpenChange={setOpen} placement="bottom" title="Hall speaker" detail="sound 01 · Hall" items={ACTIONS} onAction={setLast} />
    </div>
  );
}
