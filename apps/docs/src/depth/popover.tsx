// Usage tab for Popover (component-depth.md U1–U14). Popover hangs a small plastic panel on a key.
import { Button, Input, Popover, Stack, Text } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const filter = (props: Partial<React.ComponentProps<typeof Popover>> = {}) => (
  <Popover label="About the water filter" title="Water filter" {...props}>
    <Text tone="secondary">Change it every three months.</Text>
  </Popover>
);

export const POPOVER: Depth = {
  overview: (
    <>
      <p>Popover opens a small plastic panel next to the key that asked for it. Use it for a note, a short explanation or one field, such as the detail behind a reading or a quick rename. The panel is the same plastic as the Menu and Select panels, so the unit has one popup.</p>
      <p>Focus moves into the panel when it opens. Escape, the close key or a press outside closes it, and focus goes back to the key.</p>
    </>
  ),
  whenToUse: ['To explain a reading or a setting in a few lines.', 'To ask for one short value, such as a name.', 'To show detail that would crowd the unit if it stayed on view.'],
  whenNot: [
    { situation: 'A list of actions to pick from', to: '/components/menu', label: 'Menu' },
    { situation: 'A task that needs the person to finish or cancel before going on', to: '/components/dialog', label: 'Dialog' },
    { situation: 'A message that arrives by itself', to: '/components/toast', label: 'Toast' },
  ],
  variants: { na: 'Popover has one look, a plastic panel. The key that opens it, a round info key or a word key, is covered under Modifiers.' },
  anatomy: {
    render: filter(),
    parts: [
      { part: 'Key', selector: '[data-component="Popover"] > button', what: 'The 44px round key, or a capsule key with a word, that opens the panel.' },
      { part: 'Panel', selector: '[data-component="Popover"][role="dialog"]', what: 'Plastic body on the overlay layer, at most 300px wide.' },
      { part: 'Title', selector: '[data-component="Popover"][role="dialog"] p', what: 'Printed on the inset line in the medium weight.' },
      { part: 'Close key', selector: '[data-component="Popover"][role="dialog"] button', what: 'A round 44px key at the end of the title row.' },
    ],
  },
  sizes: { na: 'Popover has one size. The key is 44px and the panel grows to its content, up to 300px.' },
  emphasis: { na: 'Nothing in a Popover is orange. A primary key inside its content is the unit’s own one orange key.' },
  placement: {
    rows: [['Beside a reading or a label', 'The panel opens under the key and flips above it when there is no room below.'], ['Near a screen edge', 'The panel shifts along the key so the edge never cuts it.']],
    examples: [{ title: 'Beside a reading', render: <Unit><Stack direction="row" align="center" gap="md"><Text>Filter life</Text>{filter()}</Stack></Unit> }],
  },
  combinations: {
    good: [['Popover + Input', 'One field and one key to save it, under a title.'], ['Popover + Text', 'A few lines of secondary ink under the title.']],
    avoid: [{ title: 'a Popover of actions', why: 'A list of actions to pick from is a Menu, which also walks its rows by arrow keys.', render: <Unit><Popover label="Actions" trigger="word"><Stack gap="sm"><Button>Rename</Button><Button>Remove</Button></Stack></Popover></Unit> }],
  },
  content: {
    formula: <p>Name the key for what it opens, as in <em>About the water filter</em>. Start the title with the thing it describes and keep the content to a few lines.</p>,
    pair: {
      do: filter({ label: 'About the water filter' }), doNote: 'The key names what the panel explains.',
      dont: filter({ label: 'More', title: 'Click here for information' }), dontNote: 'A vague key and a title that says nothing.',
    },
    overflow: { text: 'Long content wraps inside the 300px panel. A tall panel scrolls and never runs off the screen.', render: <Popover label="About the schedule" title="Heating schedule for the whole of the upstairs rooms"><Text tone="secondary">Heating runs from 06:30 to 22:00 on weekdays and from 08:00 to 23:00 at the weekend.</Text></Popover> },
    rtl: { text: 'In right-to-left languages the panel lines up with the key’s other edge and the close key sits on the left.', render: <div dir="rtl"><Popover label="عن مرشح الماء" title="مرشح الماء"><Text tone="secondary">يغيّر كل ثلاثة أشهر.</Text></Popover></div> },
    expansion: { text: 'German and Finnish text can run 30% longer. It wraps and the panel keeps its width.', render: <Popover label="Über den Wasserfilter" title="Wasserfilter"><Text tone="secondary">Alle drei Monate wechseln. Die Lampe leuchtet, wenn noch zehn Tage übrig sind.</Text></Popover> },
  },
  behaviours: {
    states: [
      ['Closed', 'Only the key shows.', 'The key reports aria-expanded="false".'],
      ['Open', 'The panel rises off the key.', 'The key reports aria-expanded="true" and the panel is a dialog.'],
      ['Disabled', 'The key fades to half and does not open.', 'The key is disabled.'],
      ['Closing', 'The panel fades and sinks back.', 'Hidden from assistive tech while it leaves.'],
    ],
    interactions: [
      ['Keyboard', 'Enter or Space', 'Opens the panel and moves focus to its first field, or to the panel when it holds only text.', 'native button'],
      ['Keyboard', 'Escape', 'Closes the panel and returns focus to the key.', 'onKeyDown'],
      ['Keyboard', 'Tab', 'Moves through the panel; Tab past either end closes it onto the key.', 'onKeyDown'],
      ['Pointer', 'Press the key, the close key or outside', 'Opens or closes the panel.', 'onClick, pointerdown'],
      ['Screen reader', 'Read', 'The key says it opens a dialog; the panel is named by its title.', 'aria-haspopup, aria-labelledby'],
    ],
    loading: <p>Popover has no loading state. Show a Progress inside the panel if the content takes time.</p>,
    focus: <p>Focus moves to the first field in the panel, or to the panel when it only reads. On close it returns to the key.</p>,
  },
  deepDive: { na: 'Popover has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'trigger',
      rules: <p><code>icon</code> (default) is a round info key, for a note beside a reading. <code>word</code> is a capsule key with the label and a chevron, for a panel that does a job, such as rename.</p>,
      pair: { do: <Popover label="Rename" trigger="word" title="Rename"><Input label="Name" defaultValue="Kitchen lamp" /></Popover>, doNote: 'A word key for a panel that asks for a value.', dont: <Popover label="Rename" title="Rename"><Input label="Name" defaultValue="Kitchen lamp" /></Popover>, dontNote: 'An info key promises a note, not a field.' },
    },
    {
      name: 'open',
      rules: <p>Pass <code>open</code> and <code>onOpenChange</code> to control the panel from the page, or <code>defaultOpen</code> to start it open. Leave all three out and the Popover keeps its own state.</p>,
      pair: { do: filter({ defaultOpen: false }), doNote: 'Closed until the person asks.', dont: filter({ disabled: true }), dontNote: 'A disabled key hides detail the person may need.' },
    },
  ],
  related: [['/components/menu', 'Menu', 'A list of actions to pick from.'], ['/components/dialog', 'Dialog', 'A task that must be finished or cancelled.'], ['/components/select', 'Select', 'Picking one value from a list.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Dialog (modal)', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/', why: 'How focus moves into a panel and back to its key.' },
    { title: 'WCAG 2.2 · 1.4.13 Content on Hover or Focus', url: 'https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html', why: 'Why the panel opens by press and can be dismissed.' },
    { title: 'Carbon Design System · Popover', url: 'https://carbondesignsystem.com/components/popover/usage/', why: 'A reference for placement and flipping.' },
  ],
};
