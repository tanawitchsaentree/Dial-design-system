// @example error marks the well invalid in critical red and prints the problem under it with a glyph and words
import { InputGroup } from 'dial-react';

export default function InputGroupError() {
  return <InputGroup label="Monthly price" start="THB" end="/ month" defaultValue="12x" error="Enter digits only, for example 1250." />;
}
