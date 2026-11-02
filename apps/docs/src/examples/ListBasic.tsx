// @example Devices in a room, each row with a glyph, a name, its state in words and one switch at the end
import { List, Switch } from 'dial-react';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const lamp = <svg {...g}><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" /></svg>;
const fan = <svg {...g}><circle cx="12" cy="12" r="2" /><path d="M12 10c0-4 1-7 4-7s2 5-2 7M14 12c4 0 7 1 7 4s-5 2-7-2M12 14c0 4-1 7-4 7s-2-5 2-7M10 12c-4 0-7-1-7-4s5-2 7 2" /></svg>;

export default function ListBasic() {
  return (
    <List label="Kitchen" style={{ inlineSize: 380, maxInlineSize: '100%' }}>
      <List.Item leading={lamp} label="Ceiling lamp" description="On · 40%" trailing={<Switch aria-label="Ceiling lamp" defaultChecked />} />
      <List.Item leading={lamp} label="Counter strip" description="Off" trailing={<Switch aria-label="Counter strip" />} />
      <List.Item leading={fan} label="Hood fan" description="On · speed 2" trailing={<Switch aria-label="Hood fan" defaultChecked />} />
    </List>
  );
}
