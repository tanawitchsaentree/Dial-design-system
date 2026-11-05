// @example readOnly shows a value without a target; halves such as 3.5 are allowed in this mode only
import { Rating } from 'dial-react';

export default function RatingReadOnly() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-lg)' }}>
      <Rating label="Average sound score" readOnly value={3.5} />
      <Rating label="Average heat score" readOnly value={5} />
      <Rating label="Average noise score" readOnly value={2} showValue={false} />
    </div>
  );
}
