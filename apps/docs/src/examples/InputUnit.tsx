// @example unit prints the unit inside the well, after the value, and it is read out with the field
import { Input, Stack } from 'dial-react';

export default function InputUnit() {
  return (
    <Stack gap="lg">
      <Input label="Target temperature" unit="°C" inputMode="decimal" defaultValue="21.5" />
      <Input label="Delay start by" unit="min" inputMode="numeric" defaultValue="30" />
    </Stack>
  );
}
