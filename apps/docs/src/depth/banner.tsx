// Usage tab for Banner (component-depth.md U1–U14). Banner says a condition that holds, in the flow of a screen.
import { Banner, Slider, Stack, Switch } from 'dial-react';
import type { Depth } from './types';

const none = () => {};
const Room = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card"><Stack gap="lg">{children}</Stack></div>;
const offline = 'The hub is offline. Controls will work again when it reconnects.';

export const BANNER: Depth = {
  overview: (
    <>
      <p>Banner says that something holds right now and will keep holding for a while, such as the hub being offline, a filter that is due or holiday mode being on. It sits in the flow at the top of the screen or room it speaks for, and it stays there until the condition ends. Nothing about it moves on its own.</p>
      <p>The status is printed twice, as a glyph and a word, the same glyphs as Toast. Each tone has its own shape. A note gets a ring, a good condition a tick, a warning a triangle and a failure an octagon. The body is the same plastic in every tone. There is no coloured edge, no tinted background and no disc behind the glyph, so the tone never rests on colour, and no tone is orange because orange belongs to the screen’s one main key.</p>
      <p>Banner and Toast answer different questions. Toast says what just happened after a key was pressed, and goes away after a few seconds. Banner says what is true now, before anyone presses anything, and it is gone only when the condition is gone or when the person dismisses a note that can be put away. When the hub reconnects, the screen removes the banner; the person does not have to.</p>
    </>
  ),
  whenToUse: ['To say that a device or the hub cannot be reached, for as long as that lasts.', 'To say that something needs care soon, such as a filter or a battery.', 'To say that a mode is on that changes how the screen behaves, such as holiday mode.'],
  whenNot: [
    { situation: 'Saying that an action just worked or failed', to: '/components/toast', label: 'Toast' },
    { situation: 'The state of one device, such as Offline on its card', to: '/components/badge', label: 'Badge' },
    { situation: 'Asking before an action that is hard to undo', to: '/components/dialog', label: 'Dialog' },
  ],
  variants: {
    neutral: { purpose: 'A standing note that is neither good nor bad, such as holiday mode being on.', pairing: 'Pair it with a key that ends the mode, or with the dismiss key when the note can be put away.' },
    positive: { purpose: 'A good condition worth saying while it holds, such as every lamp running the new firmware.', pairing: 'Pair it with the dismiss key. A good condition rarely needs an action.' },
    warning: { purpose: 'Something that still works but needs care soon, such as a filter that is due.', pairing: 'Pair it with a key that helps, such as How to clean. The glyph is a triangle in ink.' },
    critical: { purpose: 'Something that does not work right now, such as the hub being offline.', pairing: 'Pair it with a key that helps fix it, and leave out the dismiss key while the condition holds. It is announced as an alert.' },
  },
  anatomy: {
    render: <Banner tone="critical" status="Offline" action={{ label: 'Check the hub', onAction: none }} onDismiss={none}>{offline}</Banner>,
    parts: [
      { part: 'Strip', selector: '[data-component="Banner"]', what: 'A plastic band at the height of a card, with a short shadow down and to the right.' },
      { part: 'Glyph', selector: '[data-component="Banner"] > span:first-child > svg', what: 'A printed symbol, one shape per tone, drawn in the tone’s mark ink with nothing behind it.' },
      { part: 'Status word', selector: '[data-component="Banner"] > span:first-child > span', what: 'The condition in one word, such as Offline, in medium weight.' },
      { part: 'Message', selector: '[data-component="Banner"] > span:nth-child(2)', what: 'What holds and what happens next, in one or two sentences.' },
      { part: 'Keys', selector: '[data-component="Banner"] > span:last-child', what: 'An optional plastic action key and the optional 44px round dismiss key.' },
    ],
  },
  sizes: { na: 'Banner has one size. It takes the full width of the region it speaks for and grows taller when its message wraps.' },
  emphasis: {
    text: <p>One banner per region. When two conditions hold at once, show the one that blocks the most and fold the other into its message, or show the second banner only after the first one ends. A stack of banners at the top of a screen pushes the controls down and none of them gets read.</p>,
    pair: {
      do: <Banner tone="critical" status="Offline">{offline}</Banner>,
      doNote: 'One banner says the condition that matters most.',
      dont: <Stack gap="sm"><Banner tone="critical" status="Offline">{offline}</Banner><Banner tone="warning" status="Filter">The washer filter is due.</Banner><Banner tone="neutral" status="Away">Holiday mode is on.</Banner></Stack>,
      dontNote: 'Three banners at once, so the one that blocks controls is lost.',
    },
  },
  placement: {
    rows: [
      ['At the top of a screen', 'A condition that touches the whole home, such as the hub being offline, sits above everything else.'],
      ['At the top of a room or a card', 'A condition that touches one room or device sits above the controls it affects.'],
      ['Never floating', 'A banner takes its place in the flow and pushes the content below it down. It never covers controls.'],
    ],
    examples: [{ title: 'At the top of a room', render: <Room><Banner tone="warning" status="Battery">The hall sensor battery is low.</Banner><Switch label="Motion lighting" defaultChecked /></Room> }],
  },
  combinations: {
    good: [['Banner + one plastic Button', 'A key that helps end the condition, such as Check the hub.'], ['Banner + disabled controls', 'When the hub is offline, the controls below it are disabled and the banner says why.']],
    avoid: [{ title: 'a banner that reports an action', why: 'A banner for Lamp turned off stays on the screen long after it stopped being news. Report actions in a Toast, which goes away on its own.', render: <Banner tone="positive" status="Done">Lamp turned off.</Banner> }],
  },
  content: {
    formula: <><p>The status word names the condition, such as <em>Offline</em>, <em>Filter</em> or <em>Away</em>. The message says what holds in one sentence and what happens next in a second one, as in <em>The hub is offline. Controls will work again when it reconnects.</em> The action key is a verb for the step that helps, such as <em>Check the hub</em>.</p><p>Write in the present tense, because a banner describes now. Name the device or the room, and say when the condition will end if you know it.</p></>,
    pair: {
      do: <Banner tone="critical" status="Offline">{offline}</Banner>, doNote: 'What holds and what happens next.',
      dont: <Banner tone="critical">Error 503.</Banner>, dontNote: 'A code with no word for the person and no next step.',
    },
    overflow: { text: 'A long message wraps onto more lines. When the strip is narrow the keys move under the message and line up at the end.', render: <div data-overflow-demo="" style={{ inlineSize: 'min(100%, var(--ds-layout-frame-md))' }}><Banner tone="critical" status="Offline" action={{ label: 'Check the hub', onAction: none }}>{offline}</Banner></div> },
    rtl: { text: 'In right-to-left languages the glyph and word start on the right and the keys line up on the left.', render: <div dir="rtl"><Banner tone="critical" status="غير متصل" onDismiss={none}>المحور غير متصل. ستعمل عناصر التحكم مرة أخرى عند إعادة الاتصال.</Banner></div> },
    expansion: { text: 'German runs about 30% longer. The message wraps before the keys shrink.', render: <Banner tone="critical" status="Offline" action={{ label: 'Hub prüfen', onAction: none }}>Der Hub ist offline. Die Steuerung funktioniert wieder, sobald er sich verbindet.</Banner> },
  },
  behaviours: {
    states: [
      ['Shown', 'The strip sits in the flow at once, with no slide and no fade, and is announced politely.', 'role="status"; the critical tone uses role="alert".'],
      ['Condition ends', 'The screen removes the banner and the content below moves up to its place.', 'Nothing to announce; the controls that were disabled come back.'],
      ['Dismissed', 'The person presses the round key and the screen removes the strip.', 'The screen moves focus to the next control after it.'],
      ['Forced colours', 'The strip keeps a real border and the glyph takes the text colour.', 'The word still carries the tone.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches the action key, then the dismiss key.', 'native buttons'],
      ['Keyboard', 'Enter / Space', 'Runs the action or dismisses the banner.', 'native buttons'],
      ['Pointer', 'Click the dismiss key', 'Calls onDismiss. The screen decides whether to remove the banner.', 'onDismiss'],
      ['Screen reader', 'Appears', 'Read once with its word and message. A critical banner interrupts.', 'role status or alert'],
    ],
    loading: <p>While the screen is still finding out whether the hub can be reached, show nothing. Show the banner only once the condition is known, so it never appears and disappears in the first second.</p>,
    focus: <p>A banner never takes focus when it appears. After a dismiss, move focus to the next control on the screen, so the keyboard does not fall back to the top of the page.</p>,
  },
  deepDive: {
    neutral: {
      purpose: <p>Neutral is for a mode or note that changes how the screen behaves without anything being wrong, such as holiday mode or a schedule paused for the day.</p>,
      context: <Banner tone="neutral" status="Away" action={{ label: 'End holiday mode', onAction: none }}>Holiday mode is on until Sunday. Lamps follow the away schedule.</Banner>,
      practices: ['Say when the mode ends if you know it.', 'Offer the key that ends the mode.', 'Use the dismiss key only when the note can be put away while the mode goes on.'],
      pair: { do: <Banner tone="neutral" status="Away">Holiday mode is on until Sunday.</Banner>, doNote: 'The mode and when it ends.', dont: <Banner tone="neutral" status="Info">Please note.</Banner>, dontNote: 'Neither the word nor the message says anything.' },
    },
    positive: {
      purpose: <p>Positive is for a good condition worth saying while it holds, such as every lamp being up to date after an update ran overnight.</p>,
      context: <Banner tone="positive" status="Updated" onDismiss={none}>Every lamp runs the new firmware.</Banner>,
      practices: ['Give it the dismiss key, because good news can be put away.', 'Keep it short; there is no next step to explain.', 'Use Toast instead when the person just pressed the key that caused it.'],
      pair: { do: <Banner tone="positive" status="Updated" onDismiss={none}>Every lamp runs the new firmware.</Banner>, doNote: 'Good news that can be put away.', dont: <Banner tone="positive" status="Success">Success!</Banner>, dontNote: 'Says nothing about what is good.' },
    },
    warning: {
      purpose: <p>Warning is for something that still works but will need care soon, such as a filter that is due or a battery running low.</p>,
      context: <Room><Banner tone="warning" status="Filter" action={{ label: 'How to clean', onAction: none }}>The washer filter is due for cleaning.</Banner><Slider label="Spin" min={400} max={1400} step={200} defaultValue={1000} /></Room>,
      practices: ['Say what needs care and, if you know it, by when.', 'Offer a key that helps, such as How to clean.', 'Allow dismissing it only if it comes back when the condition gets worse.'],
      pair: { do: <Banner tone="warning" status="Battery">The hall sensor battery is low. Motion lighting may stop next week.</Banner>, doNote: 'What needs care and what will happen.', dont: <Banner tone="warning" status="Warning">Check device.</Banner>, dontNote: 'Which device, and what to check?' },
    },
    critical: {
      purpose: <p>Critical is for something that does not work right now, such as the hub being offline. It is announced as an alert, so it interrupts a screen reader once.</p>,
      context: <Room><Banner tone="critical" status="Offline" action={{ label: 'Check the hub', onAction: none }}>{offline}</Banner><Switch label="Hall light" disabled /></Room>,
      practices: ['Say what does not work and when it will work again.', 'Leave out the dismiss key while the condition holds.', 'Disable the controls it affects, so nobody presses a key that cannot work.'],
      pair: { do: <Banner tone="critical" status="Offline">{offline}</Banner>, doNote: 'What fails and when it comes back.', dont: <Banner tone="critical" status="Failed">Something went wrong.</Banner>, dontNote: 'Gives the person nothing to act on.' },
    },
  },
  modifiers: [
    {
      name: 'action',
      rules: <p>One plastic key at most, for the step that helps end the condition. Never the screen’s orange key; that one belongs to the screen’s main control.</p>,
      pair: { do: <Banner tone="critical" status="Offline" action={{ label: 'Check the hub', onAction: none }}>{offline}</Banner>, doNote: 'One key, named for the step.', dont: <Banner tone="critical" status="Offline" action={{ label: 'OK', onAction: none }}>{offline}</Banner>, dontNote: 'OK does nothing about the hub.' },
    },
    {
      name: 'onDismiss',
      rules: <p>Add the dismiss key for a note the person may put away while it still holds. Leave it out for a condition that blocks controls, which stays until it ends.</p>,
      pair: { do: <Banner tone="positive" status="Updated" onDismiss={none}>Every lamp runs the new firmware.</Banner>, doNote: 'Good news can be put away.', dont: <Banner tone="critical" status="Offline" onDismiss={none}>{offline}</Banner>, dontNote: 'Dismissing it leaves dead controls with no reason shown.' },
    },
    {
      name: 'status',
      rules: <p>Replace the default word with the name of the condition, such as Offline or Filter. Keep it to one word.</p>,
      pair: { do: <Banner tone="critical" status="Offline">{offline}</Banner>, doNote: 'The word names the condition.', dont: <Banner tone="critical" status="Attention required">{offline}</Banner>, dontNote: 'Two words that repeat the tone.' },
    },
  ],
  related: [['/components/toast', 'Toast', 'Say what just happened after an action.'], ['/components/badge', 'Badge', 'The state of one device on its card.'], ['/components/dialog', 'Dialog', 'Ask before an action.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Alert pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/', why: 'When a message should interrupt and when it should wait.' },
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Announcing a message without moving focus.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
