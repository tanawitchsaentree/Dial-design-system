// @example A heater unit. The orange knob is the loud part; the small keys live in the tray under the window
import { Badge, Button, Card, Display, Icon, IconButton, Rotary, Stack, Tray } from 'dial-react';


export default function TrayHeater() {
  return (
    <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <Card padding="unit" wordmark="dial" model="heat 1">
        <Display label="Heater" value="21.5" unit="°C" detail="Heating to 22.0" digits={4} />
        <Stack direction="row" gap="md" align="center" style={{ justifyContent: 'space-between' }}>
          <Tray label="Heater keys">
            <IconButton label="Timer"><Icon name="clock" /></IconButton>
            <Button>Eco</Button>
            <Badge tone="positive">On</Badge>
          </Tray>
          <Rotary label="Target" min={16} max={28} step={0.5} defaultValue={22} />
        </Stack>
      </Card>
    </div>
  );
}
