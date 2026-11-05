// @example Inside a form: the field submits the typed text, shows an error under the well, and the orange key comes last
import { Autocomplete, Button, Input, Stack } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'study', label: 'Study' },
];

export default function AutocompleteInForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack gap="lg">
        <Input label="Schedule name" defaultValue="Night" />
        <Autocomplete label="Room" name="room" options={ROOMS} defaultValue="Attic" error="Attic is not set up yet." />
        <Button kind="primary" type="submit">Save schedule</Button>
      </Stack>
    </form>
  );
}
