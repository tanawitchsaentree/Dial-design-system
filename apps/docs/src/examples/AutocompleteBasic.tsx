// @example An autocomplete: type a few letters and a panel of suggestions rises under the well, while any other text stays valid
import { Autocomplete } from 'dial-react';

const ROOMS = [
  { value: 'living', label: 'Living room' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'bedroom', label: 'Bedroom' },
  { value: 'bathroom', label: 'Bathroom' },
  { value: 'hall', label: 'Hall' },
  { value: 'study', label: 'Study' },
];

export default function AutocompleteBasic() {
  return <Autocomplete label="Room" hint="Pick a suggestion or type your own name." options={ROOMS} defaultValue="Li" />;
}
