// @example Controlled with value and onValueChange; the printed value follows the choice
import { useState } from 'react';
import { Rating } from 'dial-react';

export default function RatingControlled() {
  const [score, setScore] = useState(4);
  return (
    <div>
      <Rating label="How quiet was the washer?" value={score} onValueChange={setScore} />
      <p>You chose {score}.</p>
    </div>
  );
}
