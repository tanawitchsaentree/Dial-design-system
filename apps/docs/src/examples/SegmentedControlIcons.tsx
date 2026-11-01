// @example A symbol printed before each word, in the same ink as the word
import { SegmentedControl } from 'dial-react';

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const LIGHT = [
  { value: 'warm', label: 'Warm', icon: icon('M12 3a6 6 0 0 0-4 10.5V17h8v-3.5A6 6 0 0 0 12 3zM9 21h6') },
  { value: 'day', label: 'Day', icon: icon('M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2') },
  { value: 'night', label: 'Night', icon: icon('M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z') },
];

export default function SegmentedControlIcons() {
  return <SegmentedControl label="Lamp colour" options={LIGHT} defaultValue="warm" />;
}
