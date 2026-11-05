// @example closed, open and disabled headers; disabled leaves the tab order
import { Accordion, AccordionItem } from 'dial-react';

export default function AccordionStates() {
  return (
    <Accordion defaultValue={['open']}>
      <AccordionItem value="open" title="Open">
        The index bar, the minus and the medium weight light this section.
      </AccordionItem>
      <AccordionItem value="closed" title="Closed">
        Hidden until opened.
      </AccordionItem>
      <AccordionItem value="off" title="Disabled" disabled>
        Never shown.
      </AccordionItem>
    </Accordion>
  );
}
