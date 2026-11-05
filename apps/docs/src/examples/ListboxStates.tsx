// @example A row that cannot be chosen, a whole list that is off, and a list with no options
import { Listbox, Stack } from 'dial-react';

const MODES = [
  { value: 'comfort', label: 'Comfort' },
  { value: 'eco', label: 'Eco' },
  { value: 'boost', label: 'Boost, needs the hub online', disabled: true },
];

export default function ListboxStates() {
  return (
    <Stack gap="lg">
      <Listbox label="One row disabled" options={MODES} defaultValue="eco" />
      <Listbox disabled label="Whole list disabled" options={MODES} defaultValue="eco" />
      <Listbox label="No options" options={[]} />
    </Stack>
  );
}
