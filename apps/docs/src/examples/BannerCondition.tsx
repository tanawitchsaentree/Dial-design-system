// @example The banner stays while the hub is offline and goes when it reconnects
import { useState } from 'react';
import { Banner, Stack, Switch } from 'dial-react';

export default function BannerCondition() {
  const [online, setOnline] = useState(false);
  return (
    <Stack gap="lg">
      <Switch label="Hub connected" checked={online} onCheckedChange={setOnline} />
      {online ? null : <Banner tone="critical" status="Offline">The hub is offline. Controls will work again when it reconnects.</Banner>}
    </Stack>
  );
}
