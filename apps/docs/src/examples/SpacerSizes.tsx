// @example All five sizes of room, drawn as bars so the steps can be compared
import { Spacer, Text } from 'dial-react';

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

export default function SpacerSizes() {
  return (
    <div>
      {sizes.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <Text>{s}</Text>
          <Spacer axis="inline" size="md" />
          <div style={{ display: 'flex', background: 'var(--ds-surface-sunken)' }}>
            <Spacer axis="inline" size={s} />
            <Spacer axis="block" size="md" />
          </div>
        </div>
      ))}
    </div>
  );
}
