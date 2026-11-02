// @example While on, the lamp lights as a small glass bead; the cap and the printed word say on as well
import { Stack, Switch } from 'dial-react';

export default function SwitchLamp() {
  return (
    <Stack gap="md">
      <Switch label="Hall light" offLabel="Off" onLabel="On" defaultChecked />
      <Switch label="Porch light" offLabel="Off" onLabel="On" />
    </Stack>
  );
}
