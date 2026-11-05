// @example A symbol printed before each word, in the same ink as the word
import { Icon, SegmentedControl } from 'dial-react';

const LIGHT = [
  { value: 'warm', label: 'Warm', icon: <Icon name="lamp" /> },
  { value: 'day', label: 'Day', icon: <Icon name="heat" /> },
  { value: 'night', label: 'Night', icon: <Icon name="schedule" /> },
];

export default function SegmentedControlIcons() {
  return <SegmentedControl label="Lamp colour" options={LIGHT} defaultValue="warm" />;
}
