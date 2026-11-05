// @example hue adds a fader under the readout; moving it sets a custom colour that no key holds
import { ColorPicker } from 'dial-react';

const lamp = [
  { value: 'ffd9a0', name: 'Warm white' },
  { value: 'ffb347', name: 'Amber' },
  { value: '6fa8ff', name: 'Blue' },
  { value: 'b08cff', name: 'Violet' },
];

export default function ColorPickerHue() {
  return <ColorPicker label="Lamp colour" swatches={lamp} defaultValue="ffb347" hue />;
}
