// @example A mode key and its lamp in the tray. The lamp is printing, a glyph and a word, at the tray's end
import { Badge, Button, Tray } from 'dial-react';

export default function TrayLamp() {
  return (
    <Tray label="Heater mode">
      <Button>Eco</Button>
      <Button>Boost</Button>
      <Badge tone="positive">Heating</Badge>
    </Tray>
  );
}
