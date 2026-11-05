// @example A disabled box switches off every control inside it at once
import { Fieldset, Input, Stack, Switch } from 'dial-react';

export default function FieldsetDisabled() {
  return (
    <Fieldset legend="Guest access" hint="Turn on the guest network to edit these." disabled>
      <Stack gap="lg">
        <Input label="Network name" defaultValue="Home guest" />
        <Switch label="Share with visitors" />
      </Stack>
    </Fieldset>
  );
}
