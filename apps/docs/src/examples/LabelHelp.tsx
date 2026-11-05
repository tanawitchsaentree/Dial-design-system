// @example One line of help under the name, linked to the field with aria-describedby
import { Label } from 'dial-react';

export default function LabelHelp() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-sm)', inlineSize: '100%' }}>
      <Label htmlFor="label-help-field" helpId="label-help-text" help="Up to 350 characters." optional>Description</Label>
      <textarea id="label-help-field" aria-describedby="label-help-text" rows={3} style={{ inlineSize: '100%', boxSizing: 'border-box', font: 'inherit' }} />
    </div>
  );
}
