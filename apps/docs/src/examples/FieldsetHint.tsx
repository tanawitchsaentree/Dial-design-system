// @example Small print at the foot of the box, read out as the group's description
import { Checkbox, Fieldset, Stack } from 'dial-react';

export default function FieldsetHint() {
  return (
    <Fieldset legend="Notify me when" hint="Alerts arrive on this phone only.">
      <Stack gap="sm">
        <Checkbox label="The washer is done" defaultChecked />
        <Checkbox label="A window is left open" />
        <Checkbox label="The heating is off for a day" />
      </Stack>
    </Fieldset>
  );
}
