// @example actions holds keys that are not controls, such as removing the device, at the bottom
import { Button, Display, Sheet, Slider } from 'dial-react';

export default function SheetActions() {
  return (
    <Sheet
      trigger={<Button>Hall light</Button>}
      title="Hall light"
      model="lamp 07"
      actions={<><Button>Rename</Button><Button>Remove device</Button></>}
    >
      <Display value="80" unit="%" label="Hall light" />
      <Slider label="Brightness" max={100} step={10} defaultValue={80} />
    </Sheet>
  );
}
