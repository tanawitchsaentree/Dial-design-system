// @example A row that stays where it is, a whole control that is off, and a chosen list with nothing in it
import { Stack, TransferList } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'cellar', label: 'Cellar, no sensor', disabled: true },
];

export default function TransferListStates() {
  return (
    <Stack gap="xl">
      <TransferList label="One row disabled" options={ROOMS} defaultValue={['kitchen']} />
      <TransferList disabled label="Whole control disabled" options={ROOMS} defaultValue={['kitchen']} />
      <TransferList label="Nothing chosen yet" options={ROOMS} />
    </Stack>
  );
}
