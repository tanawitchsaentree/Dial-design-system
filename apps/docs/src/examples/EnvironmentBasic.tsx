// @example The living room: temperature in the window, humidity, air quality and CO2 on meters
import { Environment } from 'dial-react';

export default function EnvironmentBasic() {
  return (
    <Environment
      room="Living room"
      temperature={21.5}
      detail="Feels dry"
      readAt="10:42"
      readings={[{ kind: 'humidity', value: 28 }, { kind: 'air', value: 74 }, { kind: 'co2', value: 1180 }]}
    />
  );
}
