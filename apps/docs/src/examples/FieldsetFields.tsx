// @example A box of fields, each with its own printed label, under one group name
import { Fieldset, Input, Stack } from 'dial-react';

export default function FieldsetFields() {
  return (
    <Fieldset legend="Schedule" hint="Both times use the home clock.">
      <Stack gap="lg">
        <Input label="Starts" defaultValue="23:00" />
        <Input label="Ends" defaultValue="06:30" />
      </Stack>
    </Fieldset>
  );
}
