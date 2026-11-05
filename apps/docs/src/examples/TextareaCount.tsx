// @example maxLength prints a live count under the well, such as 0 / 350 characters
import { Textarea } from 'dial-react';

export default function TextareaCount() {
  return <Textarea label="Description" maxLength={350} rows={3} />;
}
