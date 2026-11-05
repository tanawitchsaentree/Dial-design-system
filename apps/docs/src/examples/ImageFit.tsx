// @example Cover crops a tall picture to fill the window; contain shows all of it and leaves plastic at the sides
import { Grid, Image } from 'dial-react';

const plan = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 40"><rect width="20" height="40" fill="wheat"/><rect x="2" y="2" width="16" height="36" fill="none" stroke="saddlebrown" stroke-width="1"/><path d="M2 20h10v18" fill="none" stroke="saddlebrown" stroke-width="1"/></svg>')}`;

export default function ImageFit() {
  return (
    <Grid columns={2}>
      <Image src={plan} alt="Floor plan of the ground floor" ratio="4/3" fit="cover" caption="cover, cropped" />
      <Image src={plan} alt="Floor plan of the ground floor" ratio="4/3" fit="contain" caption="contain, whole" />
    </Grid>
  );
}
