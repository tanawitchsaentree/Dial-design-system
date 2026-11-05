// @example disabled takes the height off every key; the chosen key still shows its ring and tick
import { ColorPicker } from 'dial-react';

const lamp = [
  { value: 'ffd9a0', name: 'Warm white' },
  { value: 'ffb347', name: 'Amber' },
  { value: '6fa8ff', name: 'Blue' },
];

export default function ColorPickerDisabled() {
  return <ColorPicker label="Lamp colour" swatches={lamp} defaultValue="ffb347" disabled />;
}
