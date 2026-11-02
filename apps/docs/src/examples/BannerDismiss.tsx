// @example onDismiss adds the round dismiss key for a note that may be put away
import { useState } from 'react';
import { Banner, Button } from 'dial-react';

export default function BannerDismiss() {
  const [shown, setShown] = useState(true);
  return shown ? (
    <Banner tone="positive" status="Updated" onDismiss={() => setShown(false)}>Every lamp runs the new firmware.</Banner>
  ) : (
    <Button onClick={() => setShown(true)}>Show the note again</Button>
  );
}
