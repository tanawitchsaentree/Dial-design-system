// @example In a form with startName and endName, an error under the row, and the orange key last
import { useState } from 'react';
import { Button, RangePicker, Stack, type DateRange } from 'dial-react';

export default function RangePickerForm() {
  const [range, setRange] = useState<DateRange>({ start: '2026-11-09', end: null });
  const missing = range.start && !range.end;
  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <Stack gap="lg">
        <RangePicker
          label="Stay"
          required
          startName="from"
          endName="to"
          value={range}
          onValueChange={setRange}
          error={missing ? 'Choose the last day too.' : undefined}
          today="2026-11-04"
        />
        <Button kind="primary" type="submit">Book</Button>
      </Stack>
    </form>
  );
}
