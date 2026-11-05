// @example Controlled: files and onFilesChange keep the list in your state; FileUpload sends nothing itself
import { useState } from 'react';
import { FileUpload, Stack, Text } from 'dial-react';

export default function FileUploadControlled() {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <Stack gap="lg">
      <FileUpload multiple label="Attachments" files={files} onFilesChange={setFiles} />
      <Text>{files.length === 0 ? 'No files chosen.' : `${files.length} ready to send.`}</Text>
    </Stack>
  );
}
