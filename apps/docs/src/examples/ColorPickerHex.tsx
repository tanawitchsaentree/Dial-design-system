// @example hex adds a well that takes three or six digits; a wrong entry prints a message and is dropped on leaving
import { ColorPicker } from 'dial-react';

const lamp = [
  { value: 'ffd9a0', name: 'Warm white' },
  { value: 'f4f7ff', name: 'Daylight' },
  { value: '8fd694', name: 'Green' },
  { value: 'ff8fa3', name: 'Rose' },
];

export default function ColorPickerHex() {
  return <ColorPicker label="Lamp colour" swatches={lamp} defaultValue="f4f7ff" hex />;
}
