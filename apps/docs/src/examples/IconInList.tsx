// @example At the start of a list row, the glyph names the kind of device and the row's words do the rest
import { Icon, List, Switch } from 'dial-react';

export default function IconInList() {
  return (
    <List label="Living room" style={{ inlineSize: 380, maxInlineSize: '100%' }}>
      <List.Item leading={<Icon name="lamp" />} label="Floor lamp" description="On · 60%" trailing={<Switch aria-label="Floor lamp" defaultChecked />} />
      <List.Item leading={<Icon name="fan" />} label="Ceiling fan" description="Off" trailing={<Switch aria-label="Ceiling fan" />} />
      <List.Item leading={<Icon name="speaker" />} label="Shelf speaker" description="Paused" trailing={<Switch aria-label="Shelf speaker" defaultChecked />} />
    </List>
  );
}
