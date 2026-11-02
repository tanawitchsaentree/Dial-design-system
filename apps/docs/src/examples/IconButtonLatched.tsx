// @example A toggle disc with aria-pressed latches down as frosted grey glass; the symbol stays in ink
import { useState } from 'react';
import { IconButton, Stack } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function IconButtonLatched() {
  const [mute, setMute] = useState(true);
  const [loop, setLoop] = useState(false);
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Mute" aria-pressed={mute} onClick={() => setMute((v) => !v)}><svg {...icon}><path d="M4 9h4l5-4v14l-5-4H4zM17 9l4 6M21 9l-4 6" /></svg></IconButton>
      <IconButton label="Repeat" aria-pressed={loop} onClick={() => setLoop((v) => !v)}><svg {...icon}><path d="M4 11V9a3 3 0 0 1 3-3h12l-3-3M20 13v2a3 3 0 0 1-3 3H5l3 3" /></svg></IconButton>
    </Stack>
  );
}
