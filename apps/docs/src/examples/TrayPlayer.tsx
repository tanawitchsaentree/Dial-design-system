// @example A player unit. Previous, next and Shuffle sit in the tray, so the orange play key stands alone; the Live lamp is printed under them
import { Badge, Button, Card, Display, Icon, IconButton, Stack, Tray } from 'dial-react';


export default function TrayPlayer() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <Card padding="unit" wordmark="dial" model="player 2">
        <Display kind="oled" label="Kitchen speaker" value="Kiln song" detail="Ulm Quartet · 2 of 9" size="sm" />
        <Stack direction="row" gap="md" align="center" style={{ justifyContent: 'space-between' }}>
          <Tray label="Playback">
            <IconButton label="Previous track"><Icon name="previous" /></IconButton>
            <IconButton label="Next track"><Icon name="next" /></IconButton>
            <Button aria-pressed="false">Shuffle</Button>
          </Tray>
          <IconButton label="Play" kind="primary" size="lg"><Icon name="play" /></IconButton>
        </Stack>
        <Badge tone="positive">Live</Badge>
      </Card>
    </div>
  );
}
