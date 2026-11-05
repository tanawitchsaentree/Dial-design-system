// @example A printed status at the end of each row, a Badge and never a control
import { Badge, VirtualList } from 'dial-react';

export default function VirtualListStatus() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <VirtualList
        label="Devices and their state"
        count={3000}
        visibleRows={5}
        getItem={(i) => ({
          label: `Device ${i + 1}`,
          trailing: i % 4 === 0 ? <Badge tone="critical">Offline</Badge> : <Badge tone="positive">Online</Badge>,
        })}
      />
    </div>
  );
}
