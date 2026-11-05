// @example Keys at the bottom of a unit, under the display that says the state
import { Icon, IconButton, Stack } from 'dial-react';

export default function IconButtonInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Kitchen speaker · Track 4 of 12</p>
        <Stack direction="row" gap="sm">
          <IconButton label="Previous track"><Icon name="previous" /></IconButton>
          <IconButton label="Pause" kind="primary"><Icon name="pause" /></IconButton>
          <IconButton label="Next track"><Icon name="next" /></IconButton>
        </Stack>
      </Stack>
    </div>
  );
}
