// @example A multi-select whose well counts the chosen rooms, opening a plastic panel of tick rows
import { MultiSelect } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'hall', label: 'Hall' },
  { value: 'living', label: 'Living room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bath', label: 'Bathroom' },
];

export default function MultiSelectBasic() {
  return <MultiSelect label="Rooms" placeholder="Choose rooms" options={ROOMS} defaultValue={['kitchen', 'bedroom']} />;
}
