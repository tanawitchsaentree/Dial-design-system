// @example In a unit, the select sits under the display and the orange key starts the programme
import { Button, Select, Stack } from 'dial-react';

const PROGRAMMES = [
  { value: 'eco', label: 'Eco 40–60' },
  { value: 'cotton', label: 'Cotton 40°' },
  { value: 'synthetics', label: 'Synthetics' },
  { value: 'cotton-th', label: 'ผ้าฝ้าย ถนอมผ้า' },
];

export default function SelectInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <p className="flush">Washer · ready</p>
        <Select label="Programme" options={PROGRAMMES} defaultValue="eco" />
        <Button kind="primary">Start wash</Button>
      </Stack>
    </div>
  );
}
