// @example An empty editor keeps its height, so the page does not jump when the first words arrive
import { RichTextEditor } from 'dial-react';

export default function RichTextEditorEmpty() {
  return <RichTextEditor label="Message" hint="Nothing typed yet." />;
}
