// @example A select: the same well as Input with a printed chevron, opening a plastic panel of options
import { Select } from 'dial-react';

const PROGRAMMES = [
  { value: 'eco', label: 'Eco 40–60' },
  { value: 'cotton', label: 'Cotton 40°' },
  { value: 'synthetics', label: 'Synthetics' },
  { value: 'wool', label: 'Wool and hand wash' },
  { value: 'quick', label: 'Quick 30' },
];

export default function SelectBasic() {
  return <Select label="Programme" options={PROGRAMMES} defaultValue="cotton" />;
}
