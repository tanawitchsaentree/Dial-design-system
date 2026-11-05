// @example Jump to a row from outside with scrollToIndex on the ref
import { useRef } from 'react';
import { Button, VirtualList, type VirtualListHandle } from 'dial-react';

export default function VirtualListScrollTo() {
  const list = useRef<VirtualListHandle>(null);
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <VirtualList
        ref={list}
        label="Library"
        count={10000}
        getItem={(i) => ({ index: i + 1, label: `Song ${i + 1}` })}
      />
      <Button kind="key" onClick={() => list.current?.scrollToIndex(5000, { align: 'center' })}>
        Go to song 5001
      </Button>
    </div>
  );
}
