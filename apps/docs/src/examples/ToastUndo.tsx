// @example Undo from the toast: the unit's display follows the action and its undo
import { useState } from 'react';
import { Button, Stack, ToastProvider, useToast } from 'dial-react';

function Lamps() {
  const toast = useToast();
  const [on, setOn] = useState(true);
  const off = () => {
    setOn(false);
    toast.show({ tone: 'positive', message: 'All lamps turned off', action: { label: 'Undo', onAction: () => setOn(true) } });
  };
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush" aria-live="polite">Living room · {on ? '6 lamps on' : 'all off'}</p>
        <Button kind="primary" onClick={off} disabled={!on}>Turn all off</Button>
      </Stack>
    </div>
  );
}

export default function ToastUndo() {
  return (
    <ToastProvider>
      <Lamps />
    </ToastProvider>
  );
}
