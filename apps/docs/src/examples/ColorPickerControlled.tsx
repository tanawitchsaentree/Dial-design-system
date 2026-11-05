// @example Controlled: the value is the hex string of the colour, always six digits with a hash once it leaves the picker
import { useState } from 'react';
import { ColorPicker, Text } from 'dial-react';

const lamp = [
  { value: 'ffd9a0', name: 'Warm white' },
  { value: 'ffb347', name: 'Amber' },
  { value: 'ff8fa3', name: 'Rose' },
  { value: '6fa8ff', name: 'Blue' },
];

export default function ColorPickerControlled() {
  const [colour, setColour] = useState('ffd9a0');
  return (
    <>
      <ColorPicker label="Lamp colour" swatches={lamp} value={colour} onValueChange={setColour} hue hex />
      <Text>Value: {colour}</Text>
    </>
  );
}
