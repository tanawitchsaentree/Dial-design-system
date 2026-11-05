// @example One line that turns from hint to error as the value stops fitting
import { useState } from 'react';
import { HelperText, Input, Stack } from 'dial-react';

export default function HelperTextSwap() {
  const [value, setValue] = useState('42');
  const bad = Number(value) > 30;
  return (
    <Stack gap="sm">
      <Input label="Target temperature" value={value} onChange={(e) => setValue(e.target.value)} unit="°C" aria-invalid={bad} aria-describedby="ht-swap" />
      <HelperText id="ht-swap" tone={bad ? 'error' : 'neutral'}>{bad ? 'Enter a value under 30.' : 'Between 5 and 30 degrees.'}</HelperText>
    </Stack>
  );
}
