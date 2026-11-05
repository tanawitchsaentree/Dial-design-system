// @example error prints a problem from outside under the list; disabled turns the key and the remove keys off
import { FileUpload, Stack } from 'dial-react';

export default function FileUploadStates() {
  const doc = new File([new ArrayBuffer(2600000)], 'contract.pdf', { type: 'application/pdf' });
  return (
    <Stack gap="xl">
      <FileUpload label="Contract" defaultFiles={[doc]} error="The hub refused this file. Try again." />
      <FileUpload label="Contract, locked" disabled defaultFiles={[doc]} />
    </Stack>
  );
}
