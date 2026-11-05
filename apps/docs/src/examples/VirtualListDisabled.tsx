// @example Rows that cannot be chosen fade to half and the arrow keys step over them
import { VirtualList } from 'dial-react';

export default function VirtualListDisabled() {
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <VirtualList
        label="Schedules"
        count={1200}
        visibleRows={4}
        getItem={(i) => ({ index: i + 1, label: `Schedule ${i + 1}`, disabled: i % 3 === 1 })}
      />
    </div>
  );
}
