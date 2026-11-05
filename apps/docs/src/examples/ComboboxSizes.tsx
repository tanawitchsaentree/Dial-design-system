// @example The two well heights: md at 44px for forms, lg at 52px for the main field of a phone sheet
import { Combobox, Stack } from 'dial-react';

const PROGRAMMES = [
  { value: 'cotton', label: 'Cotton 60' },
  { value: 'eco', label: 'Eco 40' },
  { value: 'quick', label: 'Quick 30' },
  { value: 'wool', label: 'Wool' },
];

export default function ComboboxSizes() {
  return (
    <Stack gap="lg">
      <Combobox size="md" label="Programme, md" options={PROGRAMMES} defaultValue="eco" />
      <Combobox size="lg" label="Programme, lg" options={PROGRAMMES} defaultValue="eco" />
    </Stack>
  );
}
