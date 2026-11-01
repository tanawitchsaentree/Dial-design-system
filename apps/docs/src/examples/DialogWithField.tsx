// @example A field in the sheet, where the fader takes focus when the sheet opens
import { useState } from 'react';
import { Button, Dialog, Slider } from 'dial-react';

export default function DialogWithField() {
  const [open, setOpen] = useState(false);
  const [minutes, setMinutes] = useState(30);
  const [timer, setTimer] = useState<number | null>(null);
  return (
    <>
      <p className="flush" aria-live="polite">Bedroom lamp · {timer ? `off in ${timer} min` : 'no timer'}</p>
      <Button onClick={() => setOpen(true)}>Set a sleep timer</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title="Turn the lamp off later?"
        description="The lamp fades out when the timer ends."
        actions={<><Button>Cancel</Button><Button kind="primary" onClick={() => setTimer(minutes)}>Set timer</Button></>}
      >
        <Slider label="Minutes" min={10} max={90} step={10} value={minutes} onValueChange={setMinutes} scale formatValue={(v) => `${v} min`} />
      </Dialog>
    </>
  );
}
