// @example Controlled: value and onValueChange, called once per commit and never per keystroke
import { useState } from 'react';
import { Editable, Text } from 'dial-react';

export default function EditableControlled() {
  const [name, setName] = useState('Living room');
  const [saves, setSaves] = useState(0);
  return (
    <>
      <Editable label="Room name" value={name} onValueChange={(next) => { setName(next); setSaves((n) => n + 1); }} />
      <Text>{`Saved ${saves} times. The name is now “${name}”.`}</Text>
    </>
  );
}
