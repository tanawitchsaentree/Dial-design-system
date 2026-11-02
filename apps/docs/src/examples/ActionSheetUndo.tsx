// @example Remove from the sheet, then a Snackbar offers Undo once focus is back on the key
import { useState } from 'react';
import { ActionSheet, Button, SnackbarProvider, useSnackbar } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'move', label: 'Move to room' },
  { value: 'remove', label: 'Remove', destructive: true },
];

function Lamp() {
  const snackbar = useSnackbar();
  const [here, setHere] = useState(true);
  const act = (v: string) => {
    if (v !== 'remove') return;
    setHere(false);
    snackbar.show({ message: 'Lamp removed', action: { label: 'Undo', onAction: () => setHere(true) } });
  };
  return (
    <div className="demo-box demo-card">
      <p className="flush" aria-live="polite">{here ? 'Kitchen lamp is in Kitchen' : 'Kitchen has no lamps'}</p>
      <ActionSheet title="Kitchen lamp" detail="lamp 02 · Kitchen" items={ACTIONS} onAction={act} trigger={<Button>Kitchen lamp actions</Button>} />
    </div>
  );
}

export default function ActionSheetUndo() {
  return (
    <SnackbarProvider aboveNav={false}>
      <Lamp />
    </SnackbarProvider>
  );
}
