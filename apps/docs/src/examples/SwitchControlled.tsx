// @example A controlled switch: the unit's display says what the switch did
import { useState } from 'react';
import { Switch, Stack } from 'dial-react';

export default function SwitchControlled() {
  const [on, setOn] = useState(false);
  return (
    <Stack gap="sm">
      <p className="flush" aria-live="polite">Hallway lamp · {on ? 'on' : 'off'}</p>
      <Switch label="Hallway lamp" offLabel="Off" onLabel="On" checked={on} onCheckedChange={setOn} />
    </Stack>
  );
}
