// @example On a narrow unit the tray wraps to a second row. It never shrinks a key below 44px
import { Badge, Button, IconButton, Tray } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function TrayWrap() {
  return (
    <div style={{ inlineSize: 220, maxInlineSize: '100%' }} data-overflow-demo="">
      <Tray label="Radio keys">
        <IconButton label="Previous station"><svg {...icon}><path d="M18 6l-8 6 8 6zM6 6v12" /></svg></IconButton>
        <IconButton label="Next station"><svg {...icon}><path d="M6 6l8 6-8 6zM18 6v12" /></svg></IconButton>
        <Button>FM</Button>
        <Button>DAB</Button>
        <Badge tone="positive">Stereo</Badge>
      </Tray>
    </div>
  );
}
