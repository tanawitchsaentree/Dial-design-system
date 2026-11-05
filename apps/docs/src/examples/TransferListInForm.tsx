// @example Inside a form: the chosen values are submitted under one name, and the orange key comes last
import { Button, Input, Stack, TransferList } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'bathroom', label: 'Bathroom' },
];

export default function TransferListInForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack gap="lg">
        <Input label="Schedule name" defaultValue="Night" />
        <TransferList name="rooms" label="Rooms on the schedule" options={ROOMS} defaultValue={['bedroom']} />
        <Button kind="primary" type="submit">Create schedule</Button>
      </Stack>
    </form>
  );
}
