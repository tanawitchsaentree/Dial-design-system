// @example Off, latched, and disabled, where a disabled chip loses its height
import { Chip, Stack } from 'dial-react';

export default function ChipStates() {
  return (
    <Stack direction="row" gap="sm" style={{ flexWrap: 'wrap' }}>
      <Chip>Off</Chip>
      <Chip defaultSelected>Latched</Chip>
      <Chip disabled>Disabled</Chip>
      <Chip defaultSelected disabled>Latched, disabled</Chip>
    </Stack>
  );
}
