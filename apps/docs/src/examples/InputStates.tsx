// @example A disabled field loses its recess shadow; a read-only field keeps it and can be copied
import { Input, Stack } from 'dial-react';

export default function InputStates() {
  return (
    <Stack gap="lg">
      <Input label="Serial number" readOnly defaultValue="DL-2041-0937" />
      <Input label="Firmware channel" disabled defaultValue="Stable" />
    </Stack>
  );
}
