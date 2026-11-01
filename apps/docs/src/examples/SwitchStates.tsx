// @example Off, on, and disabled, where a disabled cap loses its height
import { Switch, Stack } from 'dial-react';

export default function SwitchStates() {
  return (
    <Stack gap="sm">
      <Switch label="Child lock" offLabel="Off" onLabel="On" />
      <Switch label="Eco mode" offLabel="Off" onLabel="On" defaultChecked />
      <Switch label="Delay start" offLabel="Off" onLabel="On" disabled />
      <Switch label="Auto off" offLabel="Off" onLabel="On" defaultChecked disabled />
    </Stack>
  );
}
