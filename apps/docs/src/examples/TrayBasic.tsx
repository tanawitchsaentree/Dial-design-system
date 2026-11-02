// @example The smallest tray holds two keys in one recess, each still 44px
import { IconButton, Tray } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function TrayBasic() {
  return (
    <Tray label="Volume">
      <IconButton label="Volume down"><svg {...icon}><path d="M5 12h14" /></svg></IconButton>
      <IconButton label="Volume up"><svg {...icon}><path d="M5 12h14M12 5v14" /></svg></IconButton>
    </Tray>
  );
}
