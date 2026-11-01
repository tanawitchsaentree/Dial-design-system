// @example Keep the sheet open while the device answers, then close it
import { useState, type MouseEvent } from 'react';
import { Button, Dialog } from 'dial-react';

export default function DialogPending() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const stop = (e: MouseEvent) => {
    e.preventDefault(); // stay open until the oven answers
    setBusy(true);
    setTimeout(() => { setBusy(false); setOpen(false); }, 1200);
  };
  return (
    <>
      <Button onClick={() => setOpen(true)}>Stop the oven</Button>
      <Dialog
        open={open}
        onOpenChange={(next: boolean) => { if (!busy) setOpen(next); }}
        title="Stop the oven?"
        description={busy ? 'Stopping. The fan runs on until the oven cools.' : 'The roast has 25 min left.'}
        actions={<><Button disabled={busy}>Cancel</Button><Button kind="primary" disabled={busy} onClick={stop}>{busy ? 'Stopping' : 'Stop'}</Button></>}
      />
    </>
  );
}
