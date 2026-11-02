// @example A latched chip turns to frosted grey glass with its lamp lit; chips at rest stay plastic
import { Chip, Stack } from 'dial-react';

export default function ChipGlass() {
  return (
    <Stack direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
      <Chip defaultSelected>Kitchen</Chip>
      <Chip>Hall</Chip>
      <Chip defaultSelected>Bedroom</Chip>
    </Stack>
  );
}
