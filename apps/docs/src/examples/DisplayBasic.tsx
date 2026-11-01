// @example A thermostat's LCD window: segment digits, the unit beside them, one detail line
import { Display } from 'dial-react';

export default function DisplayBasic() {
  return <Display label="Thermostat" value="21.5" unit="°C" detail="Heating to 22.0" digits={3} />;
}
