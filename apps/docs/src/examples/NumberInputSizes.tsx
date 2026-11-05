// @example The two sizes: md is a 44px window between 44px keys, lg is 52px with larger figures
import { NumberInput, Stack } from 'dial-react';

export default function NumberInputSizes() {
  return (
    <Stack gap="lg">
      <NumberInput size="md" label="Medium" unit="%" min={0} max={100} step={5} defaultValue={40} />
      <NumberInput size="lg" label="Large" unit="%" min={0} max={100} step={5} defaultValue={40} />
    </Stack>
  );
}
