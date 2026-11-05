// @example Empty with a prompt, invalid with a message, read-only at full ink, and disabled
import { RichTextEditor } from 'dial-react';

export default function RichTextEditorStates() {
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-xl)' }}>
      <RichTextEditor label="Empty" placeholder="Write the handover note" />
      <RichTextEditor label="Invalid" defaultValue="<p>Back soon.</p>" error="Add the date you are back." />
      <RichTextEditor label="Read-only" readOnly defaultValue="<p>Filed on <strong>3 November</strong>.</p>" />
      <RichTextEditor label="Disabled" disabled defaultValue="<p>Locked while the house is away.</p>" />
    </div>
  );
}
