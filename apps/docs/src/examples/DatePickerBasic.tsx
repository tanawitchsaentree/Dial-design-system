// @example A recessed date window with a round calendar key beside it, and the format printed under the row
import { DatePicker } from 'dial-react';

export default function DatePickerBasic() {
  return <DatePicker label="Start date" defaultValue="2026-11-12" today="2026-11-04" />;
}
