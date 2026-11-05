// @example The four ratios; each window is as wide as its cell and the height follows
import { Grid, Image } from 'dial-react';

const hall = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect width="40" height="30" fill="tan"/><circle cx="29" cy="9" r="4" fill="wheat"/><path d="M0 30L12 12l9 11 6-7 13 14z" fill="saddlebrown"/></svg>')}`;

export default function ImageRatios() {
  return (
    <Grid columns={2}>
      <Image src={hall} alt="The hall" ratio="1/1" caption="1/1" />
      <Image src={hall} alt="The hall" ratio="4/3" caption="4/3" />
      <Image src={hall} alt="The hall" ratio="3/2" caption="3/2" />
      <Image src={hall} alt="The hall" ratio="16/9" caption="16/9" />
    </Grid>
  );
}
