// @example A note field with six round keys above a recessed well; select a word and press a key or Ctrl+B
import { RichTextEditor } from 'dial-react';

export default function RichTextEditorBasic() {
  return (
    <RichTextEditor
      label="Notes for the house sitter"
      defaultValue="<h2>Heating</h2><p>Keep the <strong>hall</strong> at 18 until <em>Friday</em>.</p><ul><li>Check the valves</li><li>Bleed the radiators</li></ul>"
      hint="Ctrl or Command with B, I and K work in the text."
    />
  );
}
