// @example A disabled key loses its height and cannot be pressed
import { IconButton, Stack } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function IconButtonStates() {
  return (
    <Stack direction="row" gap="sm">
      <IconButton label="Volume down"><svg {...icon}><path d="M5 12h14" /></svg></IconButton>
      <IconButton label="Volume up" disabled><svg {...icon}><path d="M12 5v14M5 12h14" /></svg></IconButton>
      <IconButton label="Play" kind="primary" disabled><svg {...icon}><path d="M8 5l11 7-11 7z" /></svg></IconButton>
    </Stack>
  );
}
