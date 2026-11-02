// @example A condition that holds: the glyph, the word, what happens next and one key
import { Banner } from 'dial-react';

export default function BannerBasic() {
  return (
    <Banner tone="critical" status="Offline" action={{ label: 'Check the hub', onAction: () => {} }}>
      The hub is offline. Controls will work again when it reconnects.
    </Banner>
  );
}
