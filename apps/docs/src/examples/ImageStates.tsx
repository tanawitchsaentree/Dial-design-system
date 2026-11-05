// @example A picture that failed and a window with no address; each prints two dashes and keeps its size
import { Grid, Image } from 'dial-react';

export default function ImageStates() {
  return (
    <Grid columns={2}>
      <Image src="/missing.jpg" alt="Garden camera, last frame" ratio="16/9" caption="Address does not load" />
      <Image alt="Garage camera, last frame" ratio="16/9" caption="No address" />
    </Grid>
  );
}
