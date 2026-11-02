// @example The latched key is frosted grey glass with its lamp lit; the keys at rest stay plastic
import { SegmentedControl } from 'dial-react';

const MODES = [
  { value: 'off', label: 'Off' },
  { value: 'eco', label: 'Eco' },
  { value: 'boost', label: 'Boost' },
];

export default function SegmentedControlGlass() {
  return <SegmentedControl label="Heating mode" options={MODES} defaultValue="eco" />;
}
