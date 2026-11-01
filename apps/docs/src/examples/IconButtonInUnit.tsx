// @example Keys at the bottom of a unit, under the display that says the state
import { IconButton, Stack } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function IconButtonInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Kitchen speaker · Track 4 of 12</p>
        <Stack direction="row" gap="sm">
          <IconButton label="Previous track"><svg {...icon}><path d="M18 6l-8 6 8 6zM6 6v12" /></svg></IconButton>
          <IconButton label="Pause" kind="primary"><svg {...icon}><path d="M9 6v12M15 6v12" /></svg></IconButton>
          <IconButton label="Next track"><svg {...icon}><path d="M6 6l8 6-8 6zM18 6v12" /></svg></IconButton>
        </Stack>
      </Stack>
    </div>
  );
}
