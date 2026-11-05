// @example A disabled key loses its height and cannot be pressed
import { Icon, IconButton, Stack } from 'dial-react';

export default function IconButtonStates() {
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Volume down"><Icon name="minus" /></IconButton>
      <IconButton label="Volume up" disabled><Icon name="plus" /></IconButton>
      <IconButton label="Play" kind="primary" disabled><Icon name="play" /></IconButton>
    </Stack>
  );
}
