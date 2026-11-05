// @example An empty value prints the placeholder; read-only, disabled and error are props
import { Editable, Stack } from 'dial-react';

export default function EditableStates() {
  return (
    <Stack gap="lg">
      <Editable label="Empty" defaultValue="" />
      <Editable label="Read-only" defaultValue="Hall sensor 2" readOnly />
      <Editable label="Disabled" defaultValue="Locked by the owner" disabled />
      <Editable label="With an error" defaultValue="Kitchen" error="A room with this name already exists." />
    </Stack>
  );
}
