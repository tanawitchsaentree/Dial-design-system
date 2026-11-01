// @example sm is 44px, md 72px, lg 108px across
import { Rotary, Stack } from 'dial-react';

export default function RotarySizes() {
  return (
    <Stack direction="row" gap="xl" align="end">
      <Rotary kind="key" size="sm" label="Small" defaultValue={3} />
      <Rotary kind="key" size="md" label="Medium" defaultValue={5} />
      <Rotary size="lg" label="Large" defaultValue={7} />
    </Stack>
  );
}
