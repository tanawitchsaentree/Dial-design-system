// @example A disabled key loses its height; its tick stays readable
import { Checkbox, Stack } from 'dial-react';

export default function CheckboxStates() {
  return (
    <Stack gap="xs">
      <Checkbox label="Steam (not on this model)" disabled />
      <Checkbox label="Quick wash (set by the program)" disabled defaultChecked />
    </Stack>
  );
}
