// @example A disabled option, an error with its words, and a disabled field
import { Combobox, Stack } from 'dial-react';

const MODES = [
  { value: 'comfort', label: 'Comfort' },
  { value: 'eco', label: 'Eco' },
  { value: 'boost', label: 'Boost, needs the hub online', disabled: true },
];

export default function ComboboxStates() {
  return (
    <Stack gap="lg">
      <Combobox label="Mode, one option off" options={MODES} defaultValue="eco" />
      <Combobox label="Mode, with an error" options={MODES} error="Choose a mode from the list." />
      <Combobox label="Mode, disabled" options={MODES} defaultValue="comfort" disabled />
    </Stack>
  );
}
