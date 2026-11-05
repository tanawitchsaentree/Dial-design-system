// @example One term with two values, and a long value that wraps inside its column
import { DescriptionDetail, DescriptionList, DescriptionTerm } from 'dial-react';

export default function DescriptionListMultiple() {
  return (
    <DescriptionList orientation="inline">
      <DescriptionTerm>Rooms</DescriptionTerm>
      <DescriptionDetail>Living room</DescriptionDetail>
      <DescriptionDetail>Hall</DescriptionDetail>
      <DescriptionTerm>Schedule</DescriptionTerm>
      <DescriptionDetail>Weekdays from 06:30 to 08:00 and from 17:30 to 22:30, weekends from 08:00 to 23:00</DescriptionDetail>
    </DescriptionList>
  );
}
