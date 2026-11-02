// @example placement end keeps the sheet a unit at the lower inline end, even on a tall screen
import { Button, Display, Select, Sheet, Slider } from 'dial-react';

const PROGRAMS = [{ value: 'cotton', label: 'Cotton' }, { value: 'synth', label: 'Synthetic' }, { value: 'wool', label: 'Wool' }];

export default function SheetEnd() {
  return (
    <Sheet placement="end" trigger={<Button>Washer</Button>} title="Washer" model="wash 01">
      <Display value="38" unit="min" detail="Rinse" label="Washer" />
      <Select label="Program" options={PROGRAMS} defaultValue="cotton" />
      <Slider label="Spin" min={400} max={1400} step={200} defaultValue={1000} />
    </Sheet>
  );
}
