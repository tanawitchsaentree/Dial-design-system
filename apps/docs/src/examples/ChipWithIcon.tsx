// @example icon prints a small dot-matrix Icon before the word; the word still names the chip
import { Chip, Icon, Stack } from 'dial-react';

export default function ChipWithIcon() {
  return (
    <Stack direction="row" gap="sm">
      <Chip icon={<Icon name="plug" size="sm" />} defaultSelected>Eco</Chip>
      <Chip icon={<Icon name="schedule" size="sm" />}>Night</Chip>
    </Stack>
  );
}
