// @example Three sizes on the control icon tokens; at sm the dots grow so each one keeps its contrast
import { Icon, Stack } from 'dial-react';

export default function IconSizes() {
  return (
    <Stack direction="row" gap="xl" align="center">
      <Stack direction="row" gap="sm" align="center"><Icon name="settings" size="sm" /><span>sm</span></Stack>
      <Stack direction="row" gap="sm" align="center"><Icon name="settings" size="md" /><span>md</span></Stack>
      <Stack direction="row" gap="sm" align="center"><Icon name="settings" size="lg" /><span>lg</span></Stack>
    </Stack>
  );
}
