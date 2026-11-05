// @example Devices in a room, each row with a glyph, a name, its state in words and one switch at the end
import { Icon, List, Switch } from 'dial-react';

const lamp = <Icon name="lamp" />;
const fan = <Icon name="fan" />;

export default function ListBasic() {
  return (
    <List label="Kitchen" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))', maxInlineSize: '100%' }}>
      <List.Item leading={lamp} label="Ceiling lamp" description="On · 40%" trailing={<Switch aria-label="Ceiling lamp" defaultChecked />} />
      <List.Item leading={lamp} label="Counter strip" description="Off" trailing={<Switch aria-label="Counter strip" />} />
      <List.Item leading={fan} label="Hood fan" description="On · speed 2" trailing={<Switch aria-label="Hood fan" defaultChecked />} />
    </List>
  );
}
