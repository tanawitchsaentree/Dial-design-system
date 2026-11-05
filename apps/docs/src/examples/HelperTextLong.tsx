// @example A long message wraps beside its glyph and never runs under it
import { HelperText } from 'dial-react';

export default function HelperTextLong() {
  return <HelperText tone="error" errorLabel="Error">The heating schedule for the upstairs rooms overlaps with the night mode that starts at 23:00. Move one of them.</HelperText>;
}
