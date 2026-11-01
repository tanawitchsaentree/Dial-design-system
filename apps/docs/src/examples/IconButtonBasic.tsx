// @example Transport keys: one orange key to play, plastic keys to skip
import { IconButton, Stack } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function IconButtonBasic() {
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Previous track"><svg {...icon}><path d="M18 6l-8 6 8 6zM6 6v12" /></svg></IconButton>
      <IconButton label="Play" kind="primary"><svg {...icon}><path d="M8 5l11 7-11 7z" /></svg></IconButton>
      <IconButton label="Next track"><svg {...icon}><path d="M6 6l8 6-8 6zM18 6v12" /></svg></IconButton>
    </Stack>
  );
}
