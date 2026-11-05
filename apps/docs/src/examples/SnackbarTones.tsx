// @example The four tones, each its own glyph and word, none of them orange or a dark bar
import { Snackbar, Stack } from 'dial-react';

const none = () => {};

export default function SnackbarTones() {
  return (
    <Stack gap="md" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-lg))' }}>
      <Snackbar tone="positive" action={{ label: 'Undo', onAction: none }}>Lamp removed</Snackbar>
      <Snackbar tone="neutral" action={{ label: 'Undo', onAction: none }}>Scene saved</Snackbar>
      <Snackbar tone="warning" action={{ label: 'Undo', onAction: none }}>Heater set to 28 °C</Snackbar>
      <Snackbar tone="critical">Washer didn’t answer</Snackbar>
    </Stack>
  );
}
