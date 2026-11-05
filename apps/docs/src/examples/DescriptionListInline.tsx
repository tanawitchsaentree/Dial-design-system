// @example The inline layout: one column of terms, values beside them, numbers lined up on the end edge
import { DescriptionDetail, DescriptionList, DescriptionTerm } from 'dial-react';

export default function DescriptionListInline() {
  return (
    <DescriptionList orientation="inline">
      <DescriptionTerm>Model</DescriptionTerm>
      <DescriptionDetail>ht 4 heater</DescriptionDetail>
      <DescriptionTerm>Power draw</DescriptionTerm>
      <DescriptionDetail numeric>1 840 W</DescriptionDetail>
      <DescriptionTerm>Voltage</DescriptionTerm>
      <DescriptionDetail numeric>230 V</DescriptionDetail>
      <DescriptionTerm>Last service</DescriptionTerm>
      <DescriptionDetail numeric>12 March 2026</DescriptionDetail>
    </DescriptionList>
  );
}
