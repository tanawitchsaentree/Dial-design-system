// @example Lamp removed with one Undo key: a glyph, the status word, the message and the key, shown in place
import { Snackbar } from 'dial-react';

export default function SnackbarBasic() {
  return (
    <div style={{ inlineSize: 'min(100%, 375px)' }}>
      <Snackbar action={{ label: 'Undo', onAction: () => {} }}>Lamp removed</Snackbar>
    </div>
  );
}
