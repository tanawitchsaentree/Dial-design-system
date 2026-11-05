// @example The two kinds, a plastic key and the one orange key
import { Icon, IconButton, Stack } from 'dial-react';

export default function IconButtonKinds() {
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Turn off"><Icon name="power" /></IconButton>
      <IconButton label="Turn on" kind="primary"><Icon name="power" /></IconButton>
    </Stack>
  );
}
