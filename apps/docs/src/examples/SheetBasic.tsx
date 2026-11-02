// @example A lamp's full controls: the display, two faders and a schedule, opened from a key
import { useState } from 'react';
import { Button, Display, Sheet, Slider, Switch } from 'dial-react';

export default function SheetBasic() {
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(60);
  return (
    <>
      <Button onClick={() => setOpen(true)} aria-haspopup="dialog" aria-expanded={open}>Living room lamp</Button>
      <Sheet open={open} onOpenChange={setOpen} title="Living room lamp" model="lamp 02">
        <Display value={String(level)} unit="%" detail="Warm white" label="Living room lamp" />
        <Slider label="Brightness" max={100} step={10} value={level} onValueChange={setLevel} />
        <Slider label="Warmth" min={0} max={10} defaultValue={3} />
        <Switch label="On at sunset" defaultChecked />
      </Sheet>
    </>
  );
}
