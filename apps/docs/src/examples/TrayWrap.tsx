// @example On a narrow unit the tray wraps to a second row. It never shrinks a key below 44px
import { Badge, Button, Icon, IconButton, Tray } from 'dial-react';


export default function TrayWrap() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-xs))', maxInlineSize: '100%' }} data-overflow-demo="">
      <Tray label="Radio keys">
        <IconButton label="Previous station"><Icon name="previous" /></IconButton>
        <IconButton label="Next station"><Icon name="next" /></IconButton>
        <Button>FM</Button>
        <Button>DAB</Button>
        <Badge tone="positive">Stereo</Badge>
      </Tray>
    </div>
  );
}
