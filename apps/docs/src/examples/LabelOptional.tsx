// @example An optional part marked with its word, for a form where most parts are required
import { Label } from 'dial-react';

export default function LabelOptional() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-lg)', inlineSize: '100%' }}>
      <Label htmlFor="label-optional-a" required>Room name</Label>
      <Label htmlFor="label-optional-b" optional>Description</Label>
    </div>
  );
}
