// @example A star straight after the name instead of the word, with the word kept for screen readers
import { Label } from 'dial-react';

export default function LabelGlyph() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-lg)', inlineSize: '100%' }}>
      <Label htmlFor="label-glyph-a" required mark="glyph">Room name</Label>
      <Label htmlFor="label-glyph-b" required mark="word">Room name</Label>
    </div>
  );
}
