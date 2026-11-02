// @example displayKind oled for a room seen at night, white on near black
import { Environment } from 'dial-react';

export default function EnvironmentOled() {
  return (
    <Environment
      room="Study"
      temperature={22.5}
      displayKind="oled"
      detail="Window open"
      readAt="23:05"
      readings={[{ kind: 'co2', value: 640 }, { kind: 'noise', value: 52 }]}
    />
  );
}
