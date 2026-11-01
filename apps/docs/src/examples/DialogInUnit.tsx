// @example Opened from a unit: the unit's display shows the answer after the sheet closes
import { useState } from 'react';
import { Button, Dialog, Stack } from 'dial-react';

export default function DialogInUnit() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState('Rinse · 38 min left');
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush" aria-live="polite">Washer · {state}</p>
        <Stack direction="row" gap="sm">
          <Button kind="primary">Pause</Button>
          <Button onClick={() => setOpen(true)}>Stop</Button>
        </Stack>
      </Stack>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Stop the wash?"
        description="The drum drains before the door unlocks."
        actions={<><Button>Keep washing</Button><Button kind="primary" onClick={() => setState('Stopped · draining')}>Stop</Button></>}
      />
    </div>
  );
}
