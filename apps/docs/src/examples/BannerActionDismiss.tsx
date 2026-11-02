// @example One key that helps end the condition, and the dismiss key beside it
import { Banner } from 'dial-react';

export default function BannerActionDismiss() {
  return (
    <Banner tone="warning" status="Filter" action={{ label: 'How to clean', onAction: () => {} }} onDismiss={() => {}}>
      The washer filter is due for cleaning.
    </Banner>
  );
}
