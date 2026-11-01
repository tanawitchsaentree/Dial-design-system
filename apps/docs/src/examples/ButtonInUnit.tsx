// @example Keys at the bottom of a unit, under the display that says the state
import { Button, Stack } from 'dial-react';

export default function ButtonInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Washer · 38 min left</p>
        <Stack direction="row" gap="sm">
          <Button kind="primary">Pause</Button>
          <Button>Stop</Button>
        </Stack>
      </Stack>
    </div>
  );
}
