// @example Four facts about a heater, each term over its value with a seam cut between pairs
import { DescriptionDetail, DescriptionList, DescriptionTerm } from 'dial-react';

export default function DescriptionListBasic() {
  return (
    <DescriptionList>
      <DescriptionTerm>Model</DescriptionTerm>
      <DescriptionDetail>ht 4 heater</DescriptionDetail>
      <DescriptionTerm>Power draw</DescriptionTerm>
      <DescriptionDetail numeric>1 840 W</DescriptionDetail>
      <DescriptionTerm>Last service</DescriptionTerm>
      <DescriptionDetail numeric>12 March 2026</DescriptionDetail>
      <DescriptionTerm>Room</DescriptionTerm>
      <DescriptionDetail>Living room, ground floor</DescriptionDetail>
    </DescriptionList>
  );
}
