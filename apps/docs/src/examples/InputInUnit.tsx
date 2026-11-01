// @example In a settings sheet, fields sit one per row under the display, and the one orange key saves
import { Button, Input, Stack } from 'dial-react';

export default function InputInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Heater · bedroom</p>
        <Input label="Name" defaultValue="Bedroom heater" />
        <Input label="Night setback" unit="°C" inputMode="decimal" defaultValue="17" hint="Used from 23:00 to 06:00." />
        <Stack direction="row" gap="sm">
          <Button kind="primary">Save</Button>
          <Button>Cancel</Button>
        </Stack>
      </Stack>
    </div>
  );
}
