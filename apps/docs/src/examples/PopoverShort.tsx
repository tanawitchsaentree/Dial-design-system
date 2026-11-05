// @example The panel stays one column wide, so a short line does not stretch it
import { Popover } from 'dial-react';

export default function PopoverShort() {
  return <Popover label="Filter lamps" title="Filter"><p>Lit only.</p></Popover>;
}
