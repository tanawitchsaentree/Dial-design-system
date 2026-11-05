// @example A name printed on the case; press it or its key to edit, Enter keeps, Escape puts it back
import { Editable } from 'dial-react';

export default function EditableBasic() {
  return <Editable label="Room name" defaultValue="Kitchen heating" hint="Enter keeps the change. Escape puts the old name back." />;
}
