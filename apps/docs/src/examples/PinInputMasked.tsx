// @example A four-digit PIN with each digit masked as a dot
import { PinInput } from 'dial-react';

export default function PinInputMasked() {
  return <PinInput label="Door PIN" length={4} mask defaultValue="73" hint="Four digits. They are hidden as you type." />;
}
