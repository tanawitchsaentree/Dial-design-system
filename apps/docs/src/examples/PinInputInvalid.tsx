// @example A wrong code: every cell edge turns critical red and a glyph with words prints under the row
import { PinInput } from 'dial-react';

export default function PinInputInvalid() {
  return <PinInput label="Verification code" defaultValue="482915" error="That code is not right. Check the message and try again." />;
}
