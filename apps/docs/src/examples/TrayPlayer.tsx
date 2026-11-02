// @example A player unit. Previous, next and Shuffle sit in the tray, so the orange play key stands alone; the Live lamp is printed under them
import { Badge, Button, Card, Display, IconButton, Stack, Tray } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function TrayPlayer() {
  return (
    <div style={{ inlineSize: 360, maxInlineSize: '100%' }}>
      <Card padding="unit" wordmark="dial" model="player 2">
        <Display kind="oled" label="Kitchen speaker" value="Kiln song" detail="Ulm Quartet · 2 of 9" size="sm" />
        <Stack direction="row" gap="md" align="center" style={{ justifyContent: 'space-between' }}>
          <Tray label="Playback">
            <IconButton label="Previous track"><svg {...icon}><path d="M18 6l-8 6 8 6zM6 6v12" /></svg></IconButton>
            <IconButton label="Next track"><svg {...icon}><path d="M6 6l8 6-8 6zM18 6v12" /></svg></IconButton>
            <Button aria-pressed="false">Shuffle</Button>
          </Tray>
          <IconButton label="Play" kind="primary" size="lg"><svg {...icon}><path d="M8 5l11 7-11 7z" /></svg></IconButton>
        </Stack>
        <Badge tone="positive">Live</Badge>
      </Card>
    </div>
  );
}
