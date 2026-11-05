// @example Five thousand devices in a six row window, with only the rows in view put in the page
import { VirtualList } from 'dial-react';

const ROOMS = ['Kitchen', 'Hall', 'Bedroom', 'Garden', 'Study', 'Cellar'];
const KINDS = ['lamp', 'heater', 'blind', 'speaker', 'sensor'];

export default function VirtualListBasic() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <VirtualList
        label="All devices"
        count={5000}
        getItem={(i) => ({ index: i + 1, label: `${ROOMS[i % ROOMS.length]} ${KINDS[i % KINDS.length]}` })}
      />
    </div>
  );
}
