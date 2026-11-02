// @example Every room on one screen, one unit per room, each with its own time
import { Environment } from 'dial-react';

export default function EnvironmentRooms() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, minInlineSize: 0 }}>
      <Environment style={{ flex: '0 1 auto', minInlineSize: 0 }} room="Kitchen" temperature={22.0} readAt="10:42" readings={[{ kind: 'humidity', value: 44 }, { kind: 'air', value: 112 }]} />
      <Environment style={{ flex: '0 1 auto', minInlineSize: 0 }} room="Bathroom" temperature={23.5} readAt="10:41" readings={[{ kind: 'humidity', value: 71 }, { kind: 'air', value: 20 }]} />
    </div>
  );
}
