// @example In a form the tray stands under a field and the one orange key comes last
import { Button, Dropzone, Input, Stack } from 'dial-react';

export default function DropzoneInForm() {
  return (
    <Stack gap="lg">
      <Input label="Document name" defaultValue="Boiler service report" />
      <Dropzone name="attachment" accept=".pdf,application/pdf" title="Drop the PDF here" hint="One PDF, up to 10 MB" chooseLabel="Choose a PDF" />
      <Button kind="primary">Save document</Button>
    </Stack>
  );
}
