// @example A row that cannot be chosen, an empty field with its prompt, and a disabled field
import { MultiSelect, Stack } from 'dial-react';

const MODES = [
  { value: 'eco', label: 'Eco' },
  { value: 'comfort', label: 'Comfort' },
  { value: 'boost', label: 'Boost', disabled: true },
];

export default function MultiSelectStates() {
  return (
    <Stack gap="lg">
      <MultiSelect label="Modes (one row locked)" placeholder="Choose modes" options={MODES} />
      <MultiSelect label="Modes (disabled)" options={MODES} defaultValue={['eco']} disabled />
    </Stack>
  );
}
