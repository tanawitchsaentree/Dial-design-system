// @example A multi-select inside a form, sending one hidden value per chosen row
import { Button, MultiSelect, Stack } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'hall', label: 'Hall' },
  { value: 'bedroom', label: 'Bedroom' },
];

export default function MultiSelectForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack gap="lg">
        <MultiSelect name="rooms" label="Rooms to heat" options={ROOMS} defaultValue={['hall']} />
        <Button type="submit" kind="primary">Save</Button>
      </Stack>
    </form>
  );
}
