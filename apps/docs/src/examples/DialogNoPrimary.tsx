// @example Two plain keys and no orange: neither answer is the main one
import { useState } from 'react';
import { Button, Dialog } from 'dial-react';

export default function DialogNoPrimary() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('Eco');
  return (
    <>
      <p className="flush" aria-live="polite">Heating · {mode}</p>
      <Button onClick={() => setOpen(true)}>Leave home</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Keep the heating on while you are out?"
        description="Eco holds 17 °C. Off lets the rooms cool down."
        actions={<><Button onClick={() => setMode('Off')}>Turn off</Button><Button onClick={() => setMode('Eco')}>Keep Eco</Button></>}
      />
    </>
  );
}
