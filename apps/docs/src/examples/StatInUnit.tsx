// @example Three Stats in a grid on a unit body, each its own window, with the orange key apart from them
import { Button, Grid, GridItem, Stack, Stat } from 'dial-react';

export default function StatInUnit() {
  return (
    <Stack gap="xl">
      <Grid columns={3} className="demo-full">
        <GridItem span={1}><Stat size="sm" label="Indoor" value="21.5" unit="°C" /></GridItem>
        <GridItem span={1}><Stat size="sm" label="Humidity" value="48" unit="%" change="2%" trend="down" /></GridItem>
        <GridItem span={1}><Stat size="sm" label="CO₂" value="640" unit="ppm" change="30 ppm" trend="up" /></GridItem>
      </Grid>
      <Button kind="primary">Open the window</Button>
    </Stack>
  );
}
