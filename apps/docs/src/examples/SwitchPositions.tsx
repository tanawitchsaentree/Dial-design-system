// @example Position words name the two ends, like Cook and Warm on a rice cooker
import { Switch, Stack } from 'dial-react';

export default function SwitchPositions() {
  return (
    <Stack gap="sm">
      <Switch label="Mode" offLabel="Warm" onLabel="Cook" defaultChecked />
      <Switch label="Fan" offLabel="Low" onLabel="High" />
      <Switch label="Night light" />
    </Stack>
  );
}
