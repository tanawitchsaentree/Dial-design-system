// @example On round keys the key carries the name, so the glyph stays hidden; on the orange key it takes the key's printing colour
import { Icon, IconButton, Stack } from 'dial-react';

export default function IconOnKeys() {
  return (
    <Stack direction="row" gap="md" align="center">
      <IconButton label="Previous track"><Icon name="previous" /></IconButton>
      <IconButton label="Play" kind="primary"><Icon name="play" /></IconButton>
      <IconButton label="Next track"><Icon name="next" /></IconButton>
    </Stack>
  );
}
