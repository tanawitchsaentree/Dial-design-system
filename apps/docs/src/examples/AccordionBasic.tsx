// @example Sections printed as a legend; opening one closes the others, and the open one is lit with an index bar
import { Accordion, AccordionItem } from 'dial-react';

export default function AccordionBasic() {
  return (
    <Accordion defaultValue={['schedule']}>
      <AccordionItem value="schedule" title="Schedule">
        Heating starts at 06:30 on weekdays and drops to 18 at 23:00.
      </AccordionItem>
      <AccordionItem value="away" title="Away mode">
        Keeps the rooms at 16 while nobody is home.
      </AccordionItem>
      <AccordionItem value="firmware" title="Firmware">
        Version 2.4.1. Updates install at night.
      </AccordionItem>
    </Accordion>
  );
}
