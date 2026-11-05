// @example The smallest tray holds two keys in one recess, each still 44px
import { Icon, IconButton, Tray } from 'dial-react';


export default function TrayBasic() {
  return (
    <Tray label="Volume">
      <IconButton label="Volume down"><Icon name="minus" /></IconButton>
      <IconButton label="Volume up"><Icon name="plus" /></IconButton>
    </Tray>
  );
}
