// @example md is a 44px disc for keys in a unit, lg is 52px for the main key of a sheet
import { Icon, IconButton, Stack } from 'dial-react';

export default function IconButtonSizes() {
  return (
    <Stack direction="row" gap="sm" align="center">
      <IconButton label="Pause" size="md"><Icon name="pause" /></IconButton>
      <IconButton label="Start heating" size="lg" kind="primary"><Icon name="play" /></IconButton>
    </Stack>
  );
}
