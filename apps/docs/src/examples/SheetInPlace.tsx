// @example modal false shows the sheet in place, docked form, for a preview or a settings page
import { Display, Sheet, Slider, Switch } from 'dial-react';

export default function SheetInPlace() {
  return (
    <div style={{ inlineSize: 'min(100%, 420px)' }}>
      <Sheet modal={false} open placement="bottom" title="Living room lamp" model="lamp 02">
        <Display value="60" unit="%" detail="Warm white" label="Living room lamp" />
        <Slider label="Brightness" max={100} step={10} defaultValue={60} />
        <Switch label="On at sunset" defaultChecked />
      </Sheet>
    </div>
  );
}
