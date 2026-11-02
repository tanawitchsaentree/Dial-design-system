// @example A heater unit. The orange knob is the loud part; the small keys live in the tray under the window
import { Badge, Button, Card, Display, IconButton, Rotary, Stack, Tray } from 'dial-react';

const icon = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export default function TrayHeater() {
  return (
    <div style={{ inlineSize: 360, maxInlineSize: '100%' }}>
      <Card padding="unit" wordmark="dial" model="heat 1">
        <Display label="Heater" value="21.5" unit="°C" detail="Heating to 22.0" digits={4} />
        <Stack direction="row" gap="md" align="center" style={{ justifyContent: 'space-between' }}>
          <Tray label="Heater keys">
            <IconButton label="Timer"><svg {...icon}><circle cx="12" cy="13" r="7" /><path d="M12 9v4l2 2M9 3h6" /></svg></IconButton>
            <Button>Eco</Button>
            <Badge tone="positive">On</Badge>
          </Tray>
          <Rotary label="Target" min={16} max={28} step={0.5} defaultValue={22} />
        </Stack>
      </Card>
    </div>
  );
}
