// @example One at a time, so a new message replaces the one on screen instead of stacking
import { Button, SnackbarProvider, Stack, useSnackbar } from 'dial-react';

function Keys() {
  const snackbar = useSnackbar();
  const none = () => {};
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Button onClick={() => snackbar.show({ message: 'Desk lamp removed', action: { label: 'Undo', onAction: none } })}>Remove Desk lamp</Button>
        <Button onClick={() => snackbar.show({ tone: 'neutral', message: 'Hall light moved to Porch', action: { label: 'Undo', onAction: none } })}>Move Hall light</Button>
      </Stack>
    </div>
  );
}

export default function SnackbarReplace() {
  return (
    <SnackbarProvider aboveNav={false}>
      <Keys />
    </SnackbarProvider>
  );
}
