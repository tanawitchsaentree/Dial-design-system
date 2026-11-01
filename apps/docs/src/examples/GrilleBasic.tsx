// @example A volume level, where lit holes fill the field column by column from the start of the line
import { Grille } from 'dial-react';

export default function GrilleBasic() {
  return <Grille label="Volume" value={6} max={10} cols={12} rows={4} />;
}
