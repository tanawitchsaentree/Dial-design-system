// @example placement bottom docks the sheet to the bottom edge on every screen, with the bar to drag it down
import { Button, Display, Sheet, Slider, Switch } from 'dial-react';

export default function SheetBottom() {
  return (
    <Sheet placement="bottom" trigger={<Button>Bedroom heater</Button>} title="Bedroom heater" model="heat 04">
      <Display value="21.5" unit="°C" detail="Heating to 22.0" label="Bedroom heater" />
      <Slider label="Target" min={16} max={26} step={0.5} defaultValue={22} />
      <Switch label="Night setback" />
    </Sheet>
  );
}
