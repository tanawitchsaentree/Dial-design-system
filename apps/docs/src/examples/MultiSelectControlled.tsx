// @example The chosen values held in state, with the display line repeating them
import { useState } from 'react';
import { MultiSelect } from 'dial-react';

const SPEAKERS = [
  { value: 'kitchen', label: 'Kitchen speaker' },
  { value: 'living', label: 'Living room speaker' },
  { value: 'bedroom', label: 'Bedroom speaker' },
];

export default function MultiSelectControlled() {
  const [on, setOn] = useState<string[]>(['living']);
  return (
    <div>
      <MultiSelect label="Play on" options={SPEAKERS} value={on} onValueChange={setOn} />
      <p>{on.length ? `Playing on ${on.length}` : 'Not playing'}</p>
    </div>
  );
}
