// @example Keys that print an icon carry a label so a screen reader hears the key name
import { Icon, Kbd } from 'dial-react';

export default function KbdSymbols() {
  return (
    <p>
      Use <Kbd label="Up arrow"><Icon name="chevron-up" size="sm" /></Kbd> and <Kbd label="Down arrow"><Icon name="chevron-down" size="sm" /></Kbd> to move between rooms.
    </p>
  );
}
