// @example SnackbarProvider and useSnackbar post one message to the bottom of the screen, paused while touched
import { Button, SnackbarProvider, useSnackbar } from 'dial-react';

function Remove() {
  const snackbar = useSnackbar();
  return (
    <div className="demo-box demo-card">
      <Button onClick={() => snackbar.show({ message: 'Lamp removed', action: { label: 'Undo', onAction: () => {} } })}>Remove Kitchen lamp</Button>
    </div>
  );
}

export default function SnackbarProviderDemo() {
  return (
    <SnackbarProvider aboveNav={false}>
      <Remove />
    </SnackbarProvider>
  );
}
