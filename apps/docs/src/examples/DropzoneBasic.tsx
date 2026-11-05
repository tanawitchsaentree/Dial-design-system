// @example A tray window that takes dropped files and has a real key that opens the picker
import { useState } from 'react';
import { Dropzone, Text } from 'dial-react';

export default function DropzoneBasic() {
  const [names, setNames] = useState<string[]>([]);
  return (
    <>
      <Dropzone multiple onFilesDrop={(files) => setNames(files.map((f) => f.name))} />
      <Text tone="secondary">{names.length ? `Taken: ${names.join(', ')}` : 'Nothing taken yet.'}</Text>
    </>
  );
}
