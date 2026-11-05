// @example A controlled field that keeps the chosen value in state and clears it when the text is emptied
import { useState } from 'react';
import { Combobox, Stack, Text } from 'dial-react';

const ZONES = [
  { value: 'up', label: 'Upstairs' },
  { value: 'down', label: 'Downstairs' },
  { value: 'loft', label: 'Loft' },
  { value: 'cellar', label: 'Cellar' },
];

export default function ComboboxControlled() {
  const [zone, setZone] = useState<string | null>('down');
  return (
    <Stack gap="md">
      <Combobox label="Heating zone" options={ZONES} value={zone} onValueChange={setZone} />
      <Text>{zone ? `Chosen: ${zone}` : 'Nothing chosen'}</Text>
    </Stack>
  );
}
