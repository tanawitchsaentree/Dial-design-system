// @example A field that lists the rooms as you type and only accepts a room from the list
import { Combobox } from 'dial-react';

const ROOMS = [
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'kids', label: 'Kids room' },
  { value: 'living', label: 'Living room' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'hallway', label: 'Hallway' },
  { value: 'garage', label: 'Garage' },
  { value: 'garden', label: 'Garden shed' },
];

export default function ComboboxBasic() {
  return <Combobox label="Room" placeholder="Type a room" hint="Pick one from the list." options={ROOMS} defaultValue="kitchen" />;
}
