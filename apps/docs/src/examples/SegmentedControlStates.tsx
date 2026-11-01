// @example No key latched yet, and a disabled bank that keeps its latched lamp readable
import { SegmentedControl, Stack } from 'dial-react';

const PROGRAMS = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'synth', label: 'Synthetic' },
  { value: 'wool', label: 'Wool' },
];

export default function SegmentedControlStates() {
  return (
    <Stack gap="lg" align="start">
      <SegmentedControl label="Program" options={PROGRAMS} />
      <SegmentedControl label="Program (locked while washing)" options={PROGRAMS} defaultValue="cotton" disabled />
    </Stack>
  );
}
