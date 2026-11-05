// @example A six-digit code in six recessed windows, with a hint under the row
import { PinInput } from 'dial-react';

export default function PinInputBasic() {
  return <PinInput label="Verification code" hint="We sent six digits to your phone." />;
}
