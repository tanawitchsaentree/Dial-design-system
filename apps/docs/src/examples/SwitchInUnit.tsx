// @example Switches in a unit sit under the display, beside the one orange key
import { Button, Switch, Stack } from 'dial-react';

export default function SwitchInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Rice cooker · 12 min left</p>
        <Switch label="Keep warm after" offLabel="Off" onLabel="On" defaultChecked />
        <Button kind="primary">Start</Button>
      </Stack>
    </div>
  );
}
