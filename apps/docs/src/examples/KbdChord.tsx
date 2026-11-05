// @example A chord of two or three keys pressed together, joined by a printed plus
import { KbdCombo } from 'dial-react';

export default function KbdChord() {
  return (
    <p>
      Open search with <KbdCombo keys={['Ctrl', 'K']} /> and skip a track with <KbdCombo keys={['Ctrl', 'Shift', 'N']} />.
    </p>
  );
}
