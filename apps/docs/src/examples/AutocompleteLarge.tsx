// @example The large size: a 52px well and 52px rows with larger text, for the main field of a phone sheet
import { Autocomplete } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
];

export default function AutocompleteLarge() {
  return <Autocomplete label="Room" size="lg" options={ROOMS} defaultValue="Ba" />;
}
