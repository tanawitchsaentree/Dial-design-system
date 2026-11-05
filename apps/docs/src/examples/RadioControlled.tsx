// @example Controlled, so the screen keeps the value and the display repeats it in words
import { useState } from 'react';
import { RadioGroup, Radio, Stack } from 'dial-react';

export default function RadioControlled() {
  const [mode, setMode] = useState('eco');
  return (
    <Stack gap="sm">
      <RadioGroup label="Heating mode" value={mode} onValueChange={setMode}>
        <Radio value="comfort" label="Comfort" />
        <Radio value="eco" label="Eco" />
        <Radio value="away" label="Away" />
      </RadioGroup>
      <p className="flush" aria-live="polite">Heating is set to {mode}.</p>
    </Stack>
  );
}
