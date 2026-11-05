// @example A list under a Heading in a unit, with the orange key apart from the printing
import { Button, DescriptionDetail, DescriptionList, DescriptionTerm, Heading, Stack } from 'dial-react';

export default function DescriptionListInUnit() {
  return (
    <Stack gap="xl">
      <Heading level={3}>Heater details</Heading>
      <DescriptionList>
        <DescriptionTerm>Model</DescriptionTerm>
        <DescriptionDetail>ht 4 heater</DescriptionDetail>
        <DescriptionTerm>Power draw</DescriptionTerm>
        <DescriptionDetail numeric>1 840 W</DescriptionDetail>
      </DescriptionList>
      <Button kind="primary">Book a service</Button>
    </Stack>
  );
}
