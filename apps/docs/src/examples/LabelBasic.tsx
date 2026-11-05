// @example The printed name of a part, tied to its field, with the word required at the far end of the line
import { Label } from 'dial-react';

export default function LabelBasic() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-sm)', inlineSize: '100%' }}>
      <Label htmlFor="label-basic-name" required>Room name</Label>
      <input id="label-basic-name" required defaultValue="Living room" style={{ inlineSize: '100%', boxSizing: 'border-box', font: 'inherit', minBlockSize: 'var(--ds-control-md)' }} />
    </div>
  );
}
