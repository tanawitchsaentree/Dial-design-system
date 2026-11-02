// @example Undo puts the lamp back, and the list follows the action and its undo
import { useState } from 'react';
import { Button, Stack, SnackbarProvider, useSnackbar } from 'dial-react';

function Lamps() {
  const snackbar = useSnackbar();
  const [lamps, setLamps] = useState(['Kitchen lamp', 'Desk lamp', 'Hall light']);
  const remove = (name: string) => {
    const before = lamps;
    setLamps(lamps.filter((l) => l !== name));
    snackbar.show({ message: `${name} removed`, action: { label: 'Undo', onAction: () => setLamps(before) } });
  };
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush" aria-live="polite">{lamps.length} lamps: {lamps.join(', ') || 'none'}</p>
        {lamps.map((l) => <Button key={l} onClick={() => remove(l)}>Remove {l}</Button>)}
      </Stack>
    </div>
  );
}

export default function SnackbarUndo() {
  return (
    <SnackbarProvider aboveNav={false}>
      <Lamps />
    </SnackbarProvider>
  );
}
