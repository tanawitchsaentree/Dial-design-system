// @example Option keys in a unit, under the display, before the one orange key
import { Button, Checkbox, Stack } from 'dial-react';

export default function CheckboxInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Washer · Cotton 40° · 1 h 52 min</p>
        <Stack gap="xs">
          <Checkbox label="Pre-wash" />
          <Checkbox label="Extra rinse" defaultChecked />
        </Stack>
        <Button kind="primary">Start wash</Button>
      </Stack>
    </div>
  );
}
