// @example An action that cannot run now stays in place and fades; a menu key can be disabled whole
import { Menu, Stack } from 'dial-react';

const ACTIONS = [
  { value: 'rename', label: 'Rename' },
  { value: 'update', label: 'Update now', disabled: true },
  { value: 'remove', label: 'Remove', destructive: true },
];

export default function MenuStates() {
  return (
    <Stack direction="row" align="center" gap="lg">
      <Menu label="More for Washer" items={ACTIONS} />
      <Menu label="More for Dryer" items={ACTIONS} disabled />
    </Stack>
  );
}
