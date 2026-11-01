// @example Band keys in a radio unit, under the display, before the one orange key
import { Button, SegmentedControl, Stack } from 'dial-react';

const BANDS = [
  { value: 'fm', label: 'FM' },
  { value: 'am', label: 'AM' },
  { value: 'aux', label: 'AUX' },
];

export default function SegmentedControlInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md" align="start">
        <p className="flush">Kitchen radio · 98.4 MHz</p>
        <SegmentedControl label="Band" options={BANDS} defaultValue="fm" />
        <Button kind="primary">Play</Button>
      </Stack>
    </div>
  );
}
