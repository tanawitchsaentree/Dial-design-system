// @example Inside a native form: name writes the HTML to a hidden input, and the one orange key sends it
import { Button, RichTextEditor } from 'dial-react';

export default function RichTextEditorInForm() {
  return (
    <form
      onSubmit={(e) => { e.preventDefault(); }}
      style={{ display: 'grid', gap: 'var(--ds-gap-lg)', maxInlineSize: 'var(--ds-layout-frame-md)' }}
    >
      <RichTextEditor label="Handover note" name="note" defaultValue="<p>The spare key is under the <em>blue</em> pot.</p>" />
      <Button kind="primary" type="submit">Send note</Button>
    </form>
  );
}
