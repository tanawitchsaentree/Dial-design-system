// @example A 44px well and a 52px well with larger text, side by side in one column
import { MultiSelect, Stack } from 'dial-react';

const DAYS = [
  { value: 'mon', label: 'Monday' },
  { value: 'tue', label: 'Tuesday' },
  { value: 'wed', label: 'Wednesday' },
  { value: 'thu', label: 'Thursday' },
];

export default function MultiSelectSizes() {
  return (
    <Stack gap="lg">
      <MultiSelect size="md" label="Heating days" options={DAYS} defaultValue={['mon']} />
      <MultiSelect size="lg" label="Heating days" options={DAYS} defaultValue={['mon', 'tue']} />
    </Stack>
  );
}
