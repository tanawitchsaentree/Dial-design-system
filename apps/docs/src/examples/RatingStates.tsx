// @example Nothing chosen, a value chosen, and disabled; the lit marks keep their shape in every state
import { Rating } from 'dial-react';

export default function RatingStates() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-lg)' }}>
      <Rating label="None chosen" />
      <Rating label="Chosen" defaultValue={2} />
      <Rating label="Disabled" defaultValue={4} disabled />
    </div>
  );
}
