// @example A text field with a word fixed before and after the value, ruled off inside one recessed well
import { InputGroup } from 'dial-react';

export default function InputGroupBasic() {
  return <InputGroup label="Monthly price" start="THB" end="/ month" defaultValue="1,250" inputMode="numeric" />;
}
