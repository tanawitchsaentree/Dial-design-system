// @example accept narrows the tray to images, and files of another kind are handed back to onFilesReject
import { useState } from 'react';
import { Dropzone, Text } from 'dial-react';

export default function DropzoneImages() {
  const [turned, setTurned] = useState(0);
  return (
    <>
      <Dropzone
        accept="image/*"
        multiple
        title="Drop photos here"
        hint="Pictures only, JPEG or PNG"
        chooseLabel="Choose photos"
        onFilesReject={(files) => setTurned(files.length)}
      />
      <Text tone="secondary">{turned ? `${turned} not accepted: only images are taken.` : 'Every picture is taken.'}</Text>
    </>
  );
}
