// @example Key names printed as keycaps inside a sentence
import { Kbd } from 'dial-react';

export default function KbdBasic() {
  return (
    <p>
      Press <Kbd>Esc</Kbd> to close the sheet, or <Kbd>Enter</Kbd> to save it.
    </p>
  );
}
