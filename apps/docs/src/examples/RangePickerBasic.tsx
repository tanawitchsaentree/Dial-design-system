// @example Two wells for the start and the end, joined by an ink bar, and a round key that opens the Calendar
import { RangePicker } from 'dial-react';

export default function RangePickerBasic() {
  return <RangePicker label="Stay" defaultValue={{ start: '2026-11-09', end: '2026-11-17' }} today="2026-11-04" />;
}
