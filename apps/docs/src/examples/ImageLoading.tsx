// @example loading="lazy" holds the window at its ratio until the picture arrives
import { Image } from 'dial-react';

export default function ImageLoading() {
  return <Image src="/lazy-demo.png" alt="The kitchen, from the hall" ratio="16/9" loading="lazy" />;
}
