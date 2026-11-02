// @example In a unit, the display says the state and the meters read the levels around it
import { Display, Meter, Stack } from 'dial-react';

export default function MeterInUnit() {
  return (
    <div className="demo-box demo-card">
      <Stack gap="md">
        <Display label="Purifier" value="2" unit="fan" detail="Auto" digits={2} />
        <Meter label="Air quality" value={38} max={150} low={50} high={100} optimum={0} regionLabels={{ low: 'Clean', mid: 'Fair', high: 'Poor' }} formatValue={(v) => `${v} AQI`} />
        <Meter label="Filter life" value={72} low={15} formatValue={(v) => `${v} %`} regionLabels={{ low: 'Replace', mid: 'Good' }} optimum={100} />
      </Stack>
    </div>
  );
}
