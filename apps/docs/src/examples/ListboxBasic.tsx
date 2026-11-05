// @example A list of programmes that stays open in a recessed window, one chosen row marked by a tick and weight
import { Listbox } from 'dial-react';

const PROGRAMMES = [
  { value: 'eco', label: 'Eco 40–60' },
  { value: 'cotton', label: 'Cotton 40°' },
  { value: 'synthetics', label: 'Synthetics' },
  { value: 'wool', label: 'Wool and hand wash' },
  { value: 'quick', label: 'Quick 30' },
];

export default function ListboxBasic() {
  return <Listbox label="Programme" options={PROGRAMMES} defaultValue="cotton" />;
}
