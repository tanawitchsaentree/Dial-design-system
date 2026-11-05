// Usage tab for Dialog (component-depth.md U1–U14). Dialog is a sheet that asks one question about a device.
import { Button, Dialog, Slider } from 'dial-react';
import type { Depth } from './types';

const Sheet = (p: { title: string; description?: string; actions?: React.ReactNode; children?: React.ReactNode }) => (
  <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-lg))' }}><Dialog modal={false} open {...p} /></div>
);
const two = (main: string, other = 'Cancel') => <><Button>{other}</Button><Button kind="primary">{main}</Button></>;

export const DIALOG: Depth = {
  overview: (
    <>
      <p>Dialog asks one question before a device does something that is hard to take back, such as turning off every lamp, stopping a wash or deleting a schedule. The sheet rises in front of the page, the page behind it goes still, and the question waits for an answer.</p>
      <p>It is built on the browser’s own modal dialog. Focus moves into the sheet and cannot leave it, Escape closes it, and the page behind cannot be clicked or read by a screen reader until the sheet is gone. When it closes, focus goes back to the key that opened it.</p>
      <p>Ask as rarely as you can. Every sheet stops the person in the middle of what they were doing, and a sheet that appears often is closed without being read. When an action can be undone, run it at once and offer Undo in a Toast. Keep Dialog for the few actions that cannot be undone, or that need one value before they run.</p>
    </>
  ),
  whenToUse: ['Before an action that is hard to undo, such as stopping a cycle.', 'When the person must pick one of two answers before anything else happens.', 'To ask for one small value, such as the minutes on a sleep timer.'],
  whenNot: [
    { situation: 'Saying that an action worked', to: '/components/toast', label: 'Toast' },
    { situation: 'An action that is easy to undo; do it and offer Undo', to: '/components/toast', label: 'Toast' },
    { situation: 'A setting that takes effect at once', to: '/components/switch', label: 'Switch' },
  ],
  variants: { na: 'Dialog has no variant prop. Every sheet is the same plastic body, so a question looks the same on every screen.' },
  anatomy: {
    render: <Sheet title="Turn off all lamps?" description="Six lamps in four rooms go dark." actions={two('Turn off')} />,
    parts: [
      { part: 'Sheet', selector: '[data-component="Dialog"]', what: 'A plastic body with the capped panel radius and a short shadow down and to the right.' },
      { part: 'Question', selector: '[data-component="Dialog"] > h3', what: 'The title. It names the dialog for screen readers.' },
      { part: 'Description', selector: '[data-component="Dialog"] > p', what: 'What will happen if the person says yes. It describes the dialog.' },
      { part: 'Keys', selector: '[data-component="Dialog"] [data-part="actions"]', what: 'Plastic keys at the bottom, with the one orange key last.' },
    ],
  },
  sizes: { na: 'Dialog has one size. It is as wide as the reading measure and never wider than the screen.' },
  emphasis: {
    text: <p>A sheet holds at most one orange key, and only when one answer acts on the device. Cancel and every other key stay plastic.</p>,
    pair: {
      do: <Sheet title="Stop the wash?" actions={two('Stop', 'Keep washing')} />,
      doNote: 'One orange key for the answer that acts.',
      dont: <Sheet title="Stop the wash?" actions={<><Button kind="primary">Keep washing</Button><Button kind="primary">Stop</Button></>} />,
      dontNote: 'Two orange keys, so neither one is the main answer.',
    },
  },
  placement: {
    rows: [['Centred on a laptop screen', 'The sheet floats over a plain scrim, near where the person was looking.'], ['Docked to the bottom on a phone', 'A phone held upright gets the same sheet on the bottom edge, with the keys across the width.']],
    examples: [{ title: 'In place, for a preview', render: <Sheet title="Delete the morning schedule?" description="The lamps stop turning on at 7:00." actions={two('Delete')} /> }],
  },
  combinations: {
    good: [['Dialog + one orange Button', 'The answer that acts is the orange key; Cancel is plastic.'], ['Dialog + Slider', 'A single value to pick before the action runs.']],
    avoid: [{ title: 'a dialog that only says something worked', why: 'A sheet that blocks the page to report success makes people dismiss it without reading. Use a Toast.', render: <Sheet title="Lamp turned off" actions={<Button>OK</Button>} /> }],
  },
  content: {
    formula: <><p>The title is the question, ending in a question mark, as in <em>Turn off all lamps?</em> The description says what will happen in one or two sentences. Each key names its answer as a verb, such as <em>Turn off</em> or <em>Keep washing</em>. Avoid Yes and No.</p><p>Name the thing the action touches, with a number when there are several, so people can check it before they agree. Six lamps in four rooms is easier to check than All devices.</p></>,
    pair: {
      do: <Sheet title="Stop the wash?" description="The drum drains first." actions={two('Stop', 'Keep washing')} />, doNote: 'Each key says what it does.',
      dont: <Sheet title="Are you sure?" actions={two('Yes', 'No')} />, dontNote: 'Neither the question nor the keys say what happens.',
    },
    overflow: { text: 'A long question wraps onto more lines. The sheet grows taller and scrolls inside itself when it reaches the screen edge.', render: <div data-overflow-demo=""><Sheet title="Turn off every lamp in the house, including the ones on the garden schedule?" actions={two('Turn off')} /></div> },
    rtl: { text: 'In right-to-left languages the keys line up on the left and the text starts on the right.', render: <div dir="rtl"><Sheet title="إيقاف جميع المصابيح؟" actions={two('إيقاف', 'إلغاء')} /></div> },
    expansion: { text: 'German runs about 30% longer. Keys wrap onto a second row before they shrink.', render: <Sheet title="Alle Lampen ausschalten?" actions={two('Ausschalten', 'Abbrechen')} /> },
  },
  behaviours: {
    states: [
      ['Closed', 'Nothing is drawn. The opener is a normal key on the page.', 'The dialog element is in the page but hidden.'],
      ['Open', 'The sheet and the scrim fade in over 160ms with a rise of 8px.', 'The page behind is inert.'],
      ['Closing', 'The sheet fades out over 120ms, quicker than it came in, because nobody watches it leave.', 'Focus returns to the opener.'],
      ['Reduced motion', 'The sheet appears and goes at once.', 'No rise and no fade.'],
    ],
    interactions: [
      ['Keyboard', 'Tab / Shift+Tab', 'Moves between the keys and fields inside the sheet only.', 'native dialog, showModal'],
      ['Keyboard', 'Escape', 'Closes the sheet, the same as Cancel.', 'cancel event'],
      ['Pointer', 'Click a key', 'Runs the key and closes the sheet.', 'actions click'],
      ['Pointer', 'Click the scrim', 'Nothing. The question needs an answer.', 'no light dismiss'],
      ['Screen reader', 'Open', 'Announced as a dialog with its question and description.', 'aria-labelledby, aria-describedby'],
    ],
    loading: <p>When the device takes time to answer, keep the sheet open. Call <code>event.preventDefault()</code> in the key’s onClick, disable the keys, say what is happening in the description, and close the sheet when the device answers.</p>,
    focus: <p>On open, focus goes to the first field. When there is nothing to fill in, it goes to the first plastic key, so a stray Enter never runs the orange answer. On close it goes back to the opener.</p>,
  },
  deepDive: { na: 'Dialog has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'description',
      rules: <p>Say what will happen, in one or two sentences. Leave it out only when the question says it all.</p>,
      pair: { do: <Sheet title="Stop the wash?" description="38 min left. The drum drains first." actions={two('Stop', 'Keep washing')} />, doNote: 'The consequence is spelled out.', dont: <Sheet title="Stop?" actions={two('Stop')} />, dontNote: 'Stop what, and what happens next?' },
    },
    {
      name: 'children',
      rules: <p>Put one field in the sheet when the action needs a value. It takes focus when the sheet opens.</p>,
      pair: {
        do: <Sheet title="Turn the lamp off later?" actions={two('Set timer')}><Slider label="Minutes" min={10} max={90} step={10} defaultValue={30} /></Sheet>, doNote: 'One value, then the action.',
        dont: <Sheet title="Lamp settings" actions={two('Save')}><Slider label="Brightness" defaultValue={6} /><Slider label="Warmth" defaultValue={4} /><Slider label="Minutes" defaultValue={3} /></Sheet>, dontNote: 'A settings form belongs on a page of its own, where it can be saved and left.',
      },
    },
  ],
  related: [['/components/toast', 'Toast', 'Report what happened instead of asking first.'], ['/components/button', 'Button', 'The keys at the bottom of the sheet.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Dialog (Modal) pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/', why: 'Focus on open, the focus trap, Escape and focus return.' },
    { title: 'HTML Standard · The dialog element', url: 'https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element', why: 'showModal, the inert page and the cancel event the component relies on.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
