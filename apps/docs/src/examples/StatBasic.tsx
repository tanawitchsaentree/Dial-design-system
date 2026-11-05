// @example A named figure with its unit alone in a recessed window and the change printed under it
import { Stat } from 'dial-react';

export default function StatBasic() {
  return <Stat label="Energy today" value="12.4" unit="kWh" change="0.8 kWh" trend="up" compare="since yesterday" />;
}
