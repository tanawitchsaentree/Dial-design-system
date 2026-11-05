// @example Transport keys, one orange key to play and plastic keys to skip
import { Icon, IconButton, Stack } from 'dial-react';

export default function IconButtonBasic() {
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Previous track"><Icon name="previous" /></IconButton>
      <IconButton label="Play" kind="primary"><Icon name="play" /></IconButton>
      <IconButton label="Next track"><Icon name="next" /></IconButton>
    </Stack>
  );
}
