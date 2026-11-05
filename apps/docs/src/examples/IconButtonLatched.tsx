// @example A toggle disc with aria-pressed latches down as frosted grey glass; the symbol stays in ink
import { useState } from 'react';
import { Icon, IconButton, Stack } from 'dial-react';

export default function IconButtonLatched() {
  const [mute, setMute] = useState(true);
  const [loop, setLoop] = useState(false);
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Mute" aria-pressed={mute} onClick={() => setMute((v) => !v)}><Icon name="mute" /></IconButton>
      <IconButton label="Repeat" aria-pressed={loop} onClick={() => setLoop((v) => !v)}><Icon name="refresh" /></IconButton>
    </Stack>
  );
}
