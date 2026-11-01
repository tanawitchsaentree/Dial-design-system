// @example Controlled: the screen keeps the value and the display repeats it in words
import { useState } from 'react';
import { Checkbox, Stack } from 'dial-react';

export default function CheckboxControlled() {
  const [on, setOn] = useState(false);
  return (
    <Stack gap="sm">
      <Checkbox label="Child lock" checked={on} onChange={(e) => setOn(e.target.checked)} />
      <p className="flush" aria-live="polite">Child lock is {on ? 'on' : 'off'}.</p>
    </Stack>
  );
}
