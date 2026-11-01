// @example size is md (44px, the default) or sm (36px drawn, 44px to press)
import { Chip, Stack } from 'dial-react';

export default function ChipSizes() {
  return (
    <Stack gap="md">
      <Stack direction="row" gap="sm" align="center">
        <Chip size="md" defaultSelected>Eco</Chip>
        <Chip size="md">Night</Chip>
      </Stack>
      <Stack direction="row" gap="sm" align="center">
        <Chip size="sm" defaultSelected>Eco</Chip>
        <Chip size="sm">Night</Chip>
      </Stack>
    </Stack>
  );
}
