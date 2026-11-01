// @example md keys are 44px tall, lg keys 52px for the main setting on a phone sheet
import { SegmentedControl, Stack } from 'dial-react';

const SPEEDS = [
  { value: '1', label: 'Low' },
  { value: '2', label: 'Mid' },
  { value: '3', label: 'High' },
];

export default function SegmentedControlSizes() {
  return (
    <Stack gap="lg" align="start">
      <SegmentedControl label="Fan speed (md)" options={SPEEDS} defaultValue="2" size="md" />
      <SegmentedControl label="Fan speed (lg)" options={SPEEDS} defaultValue="2" size="lg" />
    </Stack>
  );
}
