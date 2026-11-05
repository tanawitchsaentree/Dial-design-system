// @example A round info key opens a short explanation
import { Popover } from 'dial-react';

export default function PopoverInfo() {
  return <Popover label="About night mode" title="Night mode"><p>Lowers the heater to 18 °C between 23:00 and 06:00.</p></Popover>;
}
