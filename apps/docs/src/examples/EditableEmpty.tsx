// @example An empty value prints a placeholder word, so the printed line is never blank
import { Editable } from 'dial-react';

export default function EditableEmpty() {
  return <Editable label="Nickname" placeholder="Add a nickname" />;
}
