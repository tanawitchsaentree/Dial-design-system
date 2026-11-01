// @example Washer options: each key prints a tick when it is on
import { Checkbox, Stack } from 'dial-react';

export default function CheckboxBasic() {
  return (
    <Stack gap="xs">
      <Checkbox label="Pre-wash" defaultChecked />
      <Checkbox label="Extra rinse" />
      <Checkbox label="Eco mode" defaultChecked />
    </Stack>
  );
}
