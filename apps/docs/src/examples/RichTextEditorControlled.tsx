// @example The value is yours: onChange gets the sanitised HTML string, shown here under the editor
import { useState } from 'react';
import { RichTextEditor, Text } from 'dial-react';

export default function RichTextEditorControlled() {
  const [html, setHtml] = useState('<p>Washer done at <strong>22:40</strong>.</p>');
  return (
    <div style={{ display: 'grid', gap: 'var(--ds-gap-lg)' }}>
      <RichTextEditor label="Message" value={html} onChange={setHtml} />
      <Text as="p" size="caption" data-testid="rte-output">{html || '(empty)'}</Text>
    </div>
  );
}
