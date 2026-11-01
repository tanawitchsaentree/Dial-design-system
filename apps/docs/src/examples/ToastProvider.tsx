// @example ToastProvider and useToast post a toast from any key, and it stays at least 5 s
import { Button, Stack, ToastProvider, useToast } from 'dial-react';

function Keys() {
  const toast = useToast();
  return (
    <Stack direction="row" gap="sm">
      <Button onClick={() => toast.show({ tone: 'positive', message: 'Lamp turned off' })}>Turn lamp off</Button>
      <Button onClick={() => toast.show({ tone: 'critical', message: 'Washer didn’t answer', action: { label: 'Try again', onAction: () => {} } })}>Start washer</Button>
    </Stack>
  );
}

export default function ToastProviderExample() {
  return (
    <ToastProvider>
      <Keys />
    </ToastProvider>
  );
}
