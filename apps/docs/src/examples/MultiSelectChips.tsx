// @example The chosen rooms stand in the well as removable chips and the well grows by rows
import { MultiSelect } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'hall', label: 'Hall' },
  { value: 'living', label: 'Living room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bath', label: 'Bathroom' },
];

export default function MultiSelectChips() {
  return <MultiSelect display="chips" label="Rooms" placeholder="Choose rooms" options={ROOMS} defaultValue={['kitchen', 'living', 'bedroom']} />;
}
