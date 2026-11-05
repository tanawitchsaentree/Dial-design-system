// @example Two editable settings in one unit; the unit still has a single orange key
import { Button, Editable, Stack } from 'dial-react';

export default function EditableInUnit() {
  return (
    <Stack gap="lg">
      <Editable label="Device name" defaultValue="Bedroom lamp" />
      <Editable label="Room" defaultValue="Upstairs" />
      <Button kind="primary">Save settings</Button>
    </Stack>
  );
}
