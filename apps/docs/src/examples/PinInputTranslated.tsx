// @example The cell names passed in German, read as Ziffer 1 von 6
import { PinInput } from 'dial-react';

export default function PinInputTranslated() {
  return <PinInput label="Bestätigungscode" cellLabel={(n, total) => `Ziffer ${n} von ${total}`} hint="Sechs Ziffern aus der Nachricht." />;
}
