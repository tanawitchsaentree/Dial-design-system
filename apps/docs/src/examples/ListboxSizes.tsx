// @example The two row heights: md at 44px for forms, lg at 52px for the main choice of a phone sheet
import { Listbox, Stack } from 'dial-react';

const MODES = [
  { value: 'comfort', label: 'Comfort' },
  { value: 'eco', label: 'Eco' },
  { value: 'away', label: 'Away' },
];

export default function ListboxSizes() {
  return (
    <Stack gap="lg">
      <Listbox size="md" label="Heating mode, md" options={MODES} defaultValue="eco" />
      <Listbox size="lg" label="Heating mode, lg" options={MODES} defaultValue="eco" />
    </Stack>
  );
}
