// @example Reading the choice: onChoose says which suggestion was picked, while typed text goes through onValueChange only
import { useState } from 'react';
import { Autocomplete, Stack, Text } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
];

export default function AutocompleteChosen() {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <Stack gap="lg">
      <Autocomplete label="Room" options={ROOMS} onChoose={(o) => setPicked(o.value)} onValueChange={() => setPicked(null)} />
      <Text>{picked ? `Chosen from the list: ${picked}` : 'Nothing chosen from the list'}</Text>
    </Stack>
  );
}
