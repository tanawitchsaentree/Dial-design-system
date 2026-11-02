// @example Uncontrolled, so the trigger opens the sheet and takes focus back when it closes
import { Button, Display, Sheet, Slider } from 'dial-react';

export default function SheetTrigger() {
  return (
    <Sheet trigger={<Button>Open the lamp</Button>} title="Desk lamp" model="lamp 01">
      <Display value="40" unit="%" label="Desk lamp" />
      <Slider label="Brightness" max={100} step={10} defaultValue={40} />
    </Sheet>
  );
}
