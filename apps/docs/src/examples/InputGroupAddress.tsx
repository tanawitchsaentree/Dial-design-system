// @example A web address with the scheme before and the domain after, so only the middle is typed
import { InputGroup } from 'dial-react';

export default function InputGroupAddress() {
  return <InputGroup label="Address of the hub" start="https://" end=".local" defaultValue="kitchen" hint="Letters and numbers, no spaces." />;
}
