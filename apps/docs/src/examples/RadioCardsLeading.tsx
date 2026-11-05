// @example Each plate leads with a dot-matrix icon before its words
import { Icon, RadioCard, RadioCards } from 'dial-react';

export default function RadioCardsLeading() {
  return (
    <RadioCards label="Room source" defaultValue="heat">
      <RadioCard value="heat" leading={<Icon name="heat" />} title="Heat" description="Radiators and floor loops." />
      <RadioCard value="cool" leading={<Icon name="cool" />} title="Cool" description="Fan coil units only." />
      <RadioCard value="fan" leading={<Icon name="fan" />} title="Fan" description="Moves air with no heating or cooling." />
    </RadioCards>
  );
}
