// @example A hairline box round two related switches, the name set into its top line
import { Fieldset, Stack, Switch } from 'dial-react';

export default function FieldsetBasic() {
  return (
    <Fieldset legend="Night mode">
      <Stack gap="sm">
        <Switch label="Lower the heater" defaultChecked />
        <Switch label="Dim the lamps" />
      </Stack>
    </Fieldset>
  );
}
