// @example A nursery with a noise meter and a grille for sound in the room right now
import { Environment } from 'dial-react';

export default function EnvironmentActivity() {
  return (
    <Environment
      room="Nursery"
      temperature={20.0}
      detail="Night mode"
      readAt="02:14"
      readings={[{ kind: 'humidity', value: 47 }, { kind: 'noise', value: 34 }]}
      activity={{ label: 'Sound', value: 2, max: 6, valueText: 'quiet' }}
    />
  );
}
