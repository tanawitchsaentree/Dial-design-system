// @example hint prints a short line under the field, and the field is read with it
import { Combobox } from 'dial-react';

export default function ComboboxHint() {
  return <Combobox label="Room" hint="Pick one from the list." options={[{ value: 'kitchen', label: 'Kitchen' }, { value: 'hallway', label: 'Hallway' }]} />;
}
