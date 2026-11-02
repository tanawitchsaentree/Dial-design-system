// @example A sensor that stops answering. The window says Not answering and the notice gives the time
import { Environment } from 'dial-react';

export default function EnvironmentOffline() {
  return (
    <Environment
      room="Garage"
      temperature={8.5}
      readAt="09:58"
      status="offline"
      readings={[{ kind: 'humidity', value: 66 }, { kind: 'co2', value: 520 }]}
    />
  );
}
