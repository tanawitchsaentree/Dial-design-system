// @example An empty alt marks a picture as decoration, so a screen reader skips it
import { Image } from 'dial-react';

const art = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect width="40" height="30" fill="wheat"/><circle cx="20" cy="15" r="8" fill="tan"/></svg>')}`;

export default function ImageDecorative() {
  return <Image src={art} alt="" ratio="4/3" />;
}
