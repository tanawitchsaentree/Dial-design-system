// @example Five marks to pick a value: a lit mark is a solid disc of dots, an empty one a hollow ring
import { Rating } from 'dial-react';

export default function RatingBasic() {
  return <Rating label="Comfort" defaultValue={3} />;
}
