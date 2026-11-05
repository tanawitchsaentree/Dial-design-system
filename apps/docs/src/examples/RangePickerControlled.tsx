// @example Controlled with value and onValueChange, with the number of nights printed under the wells
import { useState } from 'react';
import { RangePicker, type DateRange } from 'dial-react';

const days = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);

export default function RangePickerControlled() {
  const [range, setRange] = useState<DateRange>({ start: '2026-11-09', end: '2026-11-17' });
  return (
    <div>
      <RangePicker label="Stay" value={range} onValueChange={setRange} today="2026-11-04" />
      <p>{range.start && range.end ? `${days(range.start, range.end)} nights, ${range.start} to ${range.end}.` : 'Choose both days.'}</p>
    </div>
  );
}
