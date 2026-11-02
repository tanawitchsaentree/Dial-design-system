// @example A sensor that is late keeps its readings and says when the last one came
import { Environment } from 'dial-react';

export default function EnvironmentStale() {
  return (
    <Environment
      room="Bedroom"
      temperature={19.0}
      readAt="10:17"
      status="stale"
      readings={[{ kind: 'humidity', value: 51 }, { kind: 'air', value: 32 }]}
    />
  );
}
