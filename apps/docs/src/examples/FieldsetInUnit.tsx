// @example Two boxes in one unit, then the one orange key
import { Button, Checkbox, Fieldset, Radio, RadioGroup, Stack } from 'dial-react';

export default function FieldsetInUnit() {
  return (
    <Stack gap="xl">
      <Fieldset legend="Rooms">
        <Stack gap="sm">
          <Checkbox label="Kitchen" defaultChecked />
          <Checkbox label="Bedroom" />
        </Stack>
      </Fieldset>
      <Fieldset legend="Mode">
        <RadioGroup label="Heating" defaultValue="eco">
          <Radio value="comfort" label="Comfort" />
          <Radio value="eco" label="Eco" />
        </RadioGroup>
      </Fieldset>
      <Button kind="primary">Apply</Button>
    </Stack>
  );
}
