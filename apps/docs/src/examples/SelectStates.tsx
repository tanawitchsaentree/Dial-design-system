// @example A disabled select loses its recess shadow and cannot be opened
import { Select } from 'dial-react';

const CHANNELS = [
  { value: 'stable', label: 'Stable' },
  { value: 'beta', label: 'Beta' },
];

export default function SelectStates() {
  return <Select label="Firmware channel" options={CHANNELS} defaultValue="stable" disabled />;
}
