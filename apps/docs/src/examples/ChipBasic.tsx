// @example Quick presets, where a chosen chip latches down and lights its lamp
import { Chip, Stack } from 'dial-react';

export default function ChipBasic() {
  return (
    <Stack direction="row" gap="sm">
      <Chip defaultSelected>Eco</Chip>
      <Chip>Night</Chip>
      <Chip>Away</Chip>
    </Stack>
  );
}
