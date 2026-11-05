// @example Rows that open a device page, where the whole row is the link with a printed chevron at the end
import { Badge, Icon, List } from 'dial-react';

const heat = <Icon name="heat" />;
const wash = <Icon name="washer" />;
const speaker = <Icon name="speaker" />;

export default function ListLinks() {
  return (
    <List label="Devices" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <List.Item href="#heater" leading={heat} label="Bedroom heater" description="Heating to 21 °C" />
      <List.Item href="#washer" leading={wash} label="Washer" description="Cotton 40° · 38 min left" />
      <List.Item href="#speaker" leading={speaker} label="Hall speaker" description="Not reachable since 09:12" trailing={<Badge tone="critical">Offline</Badge>} />
    </List>
  );
}
