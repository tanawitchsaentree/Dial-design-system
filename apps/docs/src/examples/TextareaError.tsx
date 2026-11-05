// @example error prints the problem with a glyph and marks the field invalid
import { Textarea } from 'dial-react';

export default function TextareaError() {
  return <Textarea label="Note" defaultValue={'x'.repeat(24)} error="Keep the note under 200 characters, or shorten it." />;
}
