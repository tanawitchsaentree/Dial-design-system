// @example A radio's band keys: press one and it latches down with its lamp lit
import { SegmentedControl } from 'dial-react';

const BANDS = [
  { value: 'fm', label: 'FM' },
  { value: 'am', label: 'AM' },
  { value: 'aux', label: 'AUX' },
];

export default function SegmentedControlBasic() {
  return <SegmentedControl label="Band" options={BANDS} defaultValue="fm" />;
}
