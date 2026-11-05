// @example multiple lets several sections stay open, and the open ones are held by your own state
import { useState } from 'react';
import { Accordion, AccordionItem, Text } from 'dial-react';

export default function AccordionMultiple() {
  const [open, setOpen] = useState<string[]>(['schedule', 'alerts']);
  return (
    <>
      <Accordion multiple value={open} onValueChange={setOpen}>
        <AccordionItem value="schedule" title="Schedule">
          Heating starts at 06:30 on weekdays.
        </AccordionItem>
        <AccordionItem value="alerts" title="Notifications">
          Tell me when a window stays open for ten minutes.
        </AccordionItem>
        <AccordionItem value="firmware" title="Firmware">
          Version 2.4.1.
        </AccordionItem>
      </Accordion>
      <Text>{open.length} open</Text>
    </>
  );
}
