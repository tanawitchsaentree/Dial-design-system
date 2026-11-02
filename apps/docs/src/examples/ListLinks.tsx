// @example Rows that open a device page, where the whole row is the link with a printed chevron at the end
import { Badge, List } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const heat = <svg {...g}><circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" /></svg>;
const wash = <svg {...g}><rect x="4" y="3" width="16" height="18" rx="3" /><circle cx="12" cy="13" r="4" /></svg>;
const speaker = <svg {...g}><rect x="6" y="3" width="12" height="18" rx="3" /><circle cx="12" cy="14" r="3" /></svg>;

export default function ListLinks() {
  return (
    <List label="Devices" style={{ inlineSize: 380, maxInlineSize: '100%' }}>
      <List.Item href="#heater" leading={heat} label="Bedroom heater" description="Heating to 21 °C" />
      <List.Item href="#washer" leading={wash} label="Washer" description="Cotton 40° · 38 min left" />
      <List.Item href="#speaker" leading={speaker} label="Hall speaker" description="Not reachable since 09:12" trailing={<Badge tone="critical">Offline</Badge>} />
    </List>
  );
}
