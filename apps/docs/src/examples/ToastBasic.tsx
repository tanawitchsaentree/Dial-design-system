// @example A toast after an action: glyph, status word, message and the close key
import { Toast } from 'dial-react';

export default function ToastBasic() {
  return <Toast tone="positive" onClose={() => {}}>Lamp turned off</Toast>;
}
