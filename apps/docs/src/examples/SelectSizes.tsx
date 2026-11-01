// @example size is md (a 44px well, the default) or lg (a 52px well with larger text)
import { Select, Stack } from 'dial-react';

const MODES = [
  { value: 'heat', label: 'Heat' },
  { value: 'cool', label: 'Cool' },
  { value: 'fan', label: 'Fan only' },
];

export default function SelectSizes() {
  return (
    <Stack gap="lg">
      <Select label="Mode" options={MODES} defaultValue="heat" />
      <Select label="Mode" size="lg" options={MODES} defaultValue="heat" />
    </Stack>
  );
}
