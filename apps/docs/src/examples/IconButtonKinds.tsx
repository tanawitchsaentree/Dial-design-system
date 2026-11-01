// @example The two kinds, a plastic key and the one orange key
import { IconButton, Stack } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function IconButtonKinds() {
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Turn off"><svg {...icon}><path d="M12 4v8M7 7a7 7 0 1 0 10 0" /></svg></IconButton>
      <IconButton label="Turn on" kind="primary"><svg {...icon}><path d="M12 4v8M7 7a7 7 0 1 0 10 0" /></svg></IconButton>
    </Stack>
  );
}
