// @example hint prints a short line under the field, and the field is read with it
import { Autocomplete } from 'dial-react';

export default function AutocompleteHint() {
  return <Autocomplete label="Room" hint="Type a room or pick a suggestion." options={[{ value: 'kitchen', label: 'Kitchen' }, { value: 'hallway', label: 'Hallway' }]} />;
}
