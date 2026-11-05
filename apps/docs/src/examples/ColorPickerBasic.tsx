// @example Eight named lamp colours; the chosen key sits down with a ring and a tick and its name is printed under the keys
import { ColorPicker } from 'dial-react';

const lamp = [
  { value: 'ffd9a0', name: 'Warm white' },
  { value: 'ffb347', name: 'Amber' },
  { value: 'f4f7ff', name: 'Daylight' },
  { value: 'ff8fa3', name: 'Rose' },
  { value: '8fd694', name: 'Green' },
  { value: '6fa8ff', name: 'Blue' },
  { value: 'b08cff', name: 'Violet' },
  { value: 'ffe9c7', name: 'Candle' },
];

export default function ColorPickerBasic() {
  return <ColorPicker label="Lamp colour" swatches={lamp} defaultValue="ffb347" />;
}
