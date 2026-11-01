// @example md is a 44px disc for keys in a unit, lg is 52px for the main key of a sheet
import { IconButton, Stack } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function IconButtonSizes() {
  return (
    <Stack direction="row" gap="sm" align="center">
      <IconButton label="Pause" size="md"><svg {...icon}><path d="M9 6v12M15 6v12" /></svg></IconButton>
      <IconButton label="Start heating" size="lg" kind="primary"><svg {...icon}><path d="M8 5l11 7-11 7z" /></svg></IconButton>
    </Stack>
  );
}
