// @example A controlled choice: the row picked with Enter, Space or a press is named under the list
import { useState } from 'react';
import { VirtualList } from 'dial-react';

export default function VirtualListChosen() {
  const [value, setValue] = useState<number | null>(2);
  return (
    <div style={{ inlineSize: 'var(--ds-layout-frame-md)', maxInlineSize: '100%' }}>
      <VirtualList
        label="Tracks"
        count={2000}
        value={value}
        onValueChange={setValue}
        getItem={(i) => ({ index: i + 1, label: `Track ${i + 1}` })}
      />
      <p>{value == null ? 'Nothing chosen.' : `Chosen: track ${value + 1}`}</p>
    </div>
  );
}
