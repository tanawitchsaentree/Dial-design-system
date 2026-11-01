// @example placeholder is a grey prompt before anything is chosen; the label above stays
import { Select } from 'dial-react';

const SPEAKERS = [
  { value: 'kitchen', label: 'Kitchen speaker' },
  { value: 'living', label: 'Living room pair' },
  { value: 'study', label: 'Study' },
];

export default function SelectPlaceholder() {
  return <Select label="Play on" placeholder="Choose a speaker" options={SPEAKERS} />;
}
