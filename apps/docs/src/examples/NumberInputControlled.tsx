// @example Controlled by your own state, with the figure repeated in a Display and the words of the keys passed in another language
import { useState } from 'react';
import { Display, NumberInput, Stack } from 'dial-react';

export default function NumberInputControlled() {
  const [value, setValue] = useState<number | null>(2);
  return (
    <Stack gap="lg">
      <NumberInput
        label="Personnes"
        value={value}
        onValueChange={setValue}
        min={1}
        max={12}
        decreaseLabel="Moins"
        increaseLabel="Plus"
      />
      <Display label="Portions" value={value === null ? '-' : String(value * 2)} />
    </Stack>
  );
}
