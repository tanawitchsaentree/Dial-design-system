// @example A picture in a recessed window at four to three, with its caption printed on the body below
import { Image } from 'dial-react';

const hall = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect width="40" height="30" fill="tan"/><circle cx="29" cy="9" r="4" fill="wheat"/><path d="M0 30L12 12l9 11 6-7 13 14z" fill="saddlebrown"/></svg>')}`;

export default function ImageBasic() {
  return <Image src={hall} alt="The hall, seen from the front door, with the stairs on the right" ratio="4/3" caption="Hall, north wall, 08:10" />;
}
