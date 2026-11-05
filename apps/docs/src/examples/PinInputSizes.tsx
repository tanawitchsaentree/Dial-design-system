// @example The two sizes, md and lg, each half filled
import { PinInput, Stack } from 'dial-react';

export default function PinInputSizes() {
  return (
    <Stack gap="lg">
      <PinInput label="Code, md" size="md" defaultValue="482" />
      <PinInput label="Code, lg" size="lg" defaultValue="482" />
    </Stack>
  );
}
