// @example A render-prop child puts the wired props where you want them, here on a Switch
import { FormField, Switch } from 'dial-react';

export default function FormFieldRender() {
  return (
    <FormField label="Night schedule" hint="Lowers the heater to 18 after 23:00.">
      {(control) => <Switch id={control.id} aria-describedby={control['aria-describedby']} onLabel="On" offLabel="Off" />}
    </FormField>
  );
}
