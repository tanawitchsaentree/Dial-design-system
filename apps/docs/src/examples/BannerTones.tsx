// @example The four tones, each with its own glyph and word, all on the same plastic
import { Banner, Stack } from 'dial-react';

export default function BannerTones() {
  return (
    <Stack gap="md">
      <Banner tone="neutral" status="Away">Holiday mode is on until Sunday.</Banner>
      <Banner tone="positive" status="Updated">Every lamp runs the new firmware.</Banner>
      <Banner tone="warning" status="Filter">The washer filter is due for cleaning.</Banner>
      <Banner tone="critical" status="Offline">The hub is offline. Controls will work again when it reconnects.</Banner>
    </Stack>
  );
}
