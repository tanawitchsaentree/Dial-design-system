// @example A code that can be read and copied but not changed, and one that is disabled
import { PinInput, Stack } from 'dial-react';

export default function PinInputReadOnly() {
  return (
    <Stack gap="lg">
      <PinInput label="Pairing code" defaultValue="604217" readOnly hint="Type this code on the device." />
      <PinInput label="Verification code" disabled />
    </Stack>
  );
}
