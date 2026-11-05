// @example max sets how many marks stand in the row; a shorter scale of three fits a narrow card
import { Rating } from 'dial-react';

export default function RatingMax() {
  return <Rating label="Was it loud?" max={3} defaultValue={1} />;
}
