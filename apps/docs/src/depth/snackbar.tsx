// Usage tab for Snackbar (component-depth.md U1–U14). Snackbar is a brief bottom message with one Undo.
import { Snackbar, Stack } from 'dial-react';
import type { Depth } from './types';

const none = () => {};
const undo = { label: 'Undo', onAction: none };
const Phone = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'min(100%, var(--ds-layout-frame-phone))' }}>{children}</div>;

export const SNACKBAR: Depth = {
  overview: (
    <>
      <p>Snackbar is a brief message at the bottom of a phone screen with one key that undoes what just happened, such as Lamp removed with Undo. It sits just above the BottomNav strip, under the thumb that pressed Remove a moment ago, and leaves on its own after eight seconds.</p>
      <p>It is a member of Toast’s family and uses the same plastic strip, the same glyphs and the same status words. It differs in three ways. Only one snackbar shows at a time, and a new one replaces it. It has no close key, because it carries one action at most and leaves by itself. It sits centred above the bottom nav instead of at the inline end of the screen.</p>
      <p>The strip is a polite live region with <code>role="status"</code> in every tone, so a screen reader reads it without moving focus. The timer never runs below five seconds and stops while the pointer or focus is on the strip. Escape closes it while focus is inside. Use <code>SnackbarProvider</code> once near the root and <code>useSnackbar()</code> to post a message from anywhere.</p>
    </>
  ),
  whenToUse: ['To offer Undo right after an action that was easy to run by mistake, such as Remove.', 'To confirm a quick change on a phone without covering the page.', 'To say an action failed when the person can simply try it again.'],
  whenNot: [
    { situation: 'Several notes that may arrive together', to: '/components/toast', label: 'Toast' },
    { situation: 'A state that stays until it is fixed, such as Offline', to: '/components/banner', label: 'Banner' },
    { situation: 'Asking before an action that cannot be undone', to: '/components/dialog', label: 'Dialog' },
  ],
  variants: {
    positive: { purpose: 'The action worked, such as Lamp removed. This is the default tone.', pairing: 'Pair it with Undo. The glyph is a tick.' },
    neutral: { purpose: 'A plain note, such as Scene saved.', pairing: 'Pair it with Undo when the change was easy to make by mistake. The glyph is an i in a circle.' },
    warning: { purpose: 'The action worked but has a catch, such as a heater set unusually high.', pairing: 'Pair it with Undo. The glyph is a triangle in ink.' },
    critical: { purpose: 'The action failed, such as Washer didn’t answer.', pairing: 'Leave the key out, or offer Try again. It stays a polite status.' },
  },
  anatomy: {
    render: <Phone><Snackbar action={undo}>Lamp removed</Snackbar></Phone>,
    parts: [
      { part: 'Strip', selector: '[data-component="Snackbar"]', what: 'Toast’s plastic body with the capped panel radius and a shadow down and to the right.' },
      { part: 'Glyph', selector: '[data-component="Snackbar"] svg', what: 'A printed symbol, one shape per tone, drawn in the tone’s mark ink.' },
      { part: 'Status word', selector: '[data-component="Snackbar"] > span:first-child > span', what: 'The tone in one word, which is Done, Note, Check or Failed.' },
      { part: 'Message', selector: '[data-component="Snackbar"] > span:nth-child(2)', what: 'What happened, in a few words and the past tense.' },
      { part: 'Key', selector: '[data-component="Snackbar"] > span:last-child', what: 'One plastic key that undoes, at least 44px.' },
    ],
  },
  sizes: { na: 'Snackbar has one size. It is the full width of a phone less the inset, up to the reading measure.' },
  emphasis: {
    text: <p>A snackbar holds at most one key and that key is plastic, never orange. One message at a time keeps the bottom of the screen calm, and the strip never covers the nav.</p>,
    pair: {
      do: <Phone><Snackbar action={undo}>Lamp removed</Snackbar></Phone>, doNote: 'One plain Undo key.',
      dont: <Phone><Stack gap="sm"><Snackbar action={undo}>Lamp removed</Snackbar><Snackbar action={undo}>Desk lamp removed</Snackbar></Stack></Phone>, dontNote: 'Two snackbars at once, so neither Undo is clear.',
    },
  },
  placement: {
    rows: [
      ['Just above the bottom nav on a phone', 'SnackbarProvider lifts the strip by the nav’s height on a screen taller than it is wide.'],
      ['At the bottom inset on a wide screen', 'The nav is a rail at the side there, so the strip drops to the bottom inset, centred.'],
      ['An app with no bottom nav', 'Pass aboveNav false and the strip sits at the bottom inset on every screen.'],
    ],
    examples: [{ title: 'Shown in place', render: <Phone><Snackbar tone="neutral" action={undo}>Scene saved</Snackbar></Phone> }],
  },
  combinations: {
    good: [['ActionSheet + Snackbar', 'Remove in the sheet, then Lamp removed with Undo.'], ['BottomNav + Snackbar', 'The strip sits just above the printed sections.'], ['List + Snackbar', 'Swipe a row away, then put it back with Undo.']],
    avoid: [{ title: 'a snackbar with two keys', why: 'Two keys turn a brief message into a question. Ask with a Dialog when there is a real choice.', render: <Phone><Snackbar action={{ label: 'Undo or keep', onAction: none }}>Lamp removed</Snackbar></Phone> }],
  },
  content: {
    formula: <><p>Say what happened in the past tense and name the thing, such as <em>Lamp removed</em> or <em>Hall light moved to Porch</em>. The key is one verb, almost always Undo.</p><p>Keep it to one short line on a phone. Anything that needs reading twice belongs in a Banner or a Dialog.</p></>,
    pair: {
      do: <Phone><Snackbar action={undo}>Lamp removed</Snackbar></Phone>, doNote: 'Names the lamp and what happened.',
      dont: <Phone><Snackbar action={{ label: 'OK', onAction: none }}>Success</Snackbar></Phone>, dontNote: 'Says nothing, and OK does nothing.',
    },
    overflow: { text: 'A long message wraps onto more lines; the key stays at the inline end, centred on the strip.', render: <div data-overflow-demo=""><Phone><Snackbar action={undo}>Reading lamp by the window in the upstairs guest room removed</Snackbar></Phone></div> },
    rtl: { text: 'In right-to-left languages the glyph and word start at the right and the key sits at the left.', render: <div dir="rtl"><Phone><Snackbar status="تم" action={{ label: 'تراجع', onAction: none }}>تمت إزالة المصباح</Snackbar></Phone></div> },
    expansion: { text: 'German runs about 30% longer. The message wraps before the key shrinks.', render: <Phone><Snackbar status="Fertig" action={{ label: 'Rückgängig', onAction: none }}>Küchenlampe entfernt</Snackbar></Phone> },
  },
  behaviours: {
    states: [
      ['Arriving', 'Fades in and rises 8px over 160ms.', 'Read politely by a screen reader.'],
      ['Showing', 'Stays at least 5 s, 8 s by default.', 'The timer pauses while the pointer or focus is on it.'],
      ['Replaced', 'The old strip fades out while the new one fades in in the same place.', 'Only the new one is read.'],
      ['Leaving', 'Fades out over 120ms.', 'Removed from the page afterwards.'],
      ['Reduced motion', 'Appears and goes at once.', 'No rise and no fade.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches the Undo key; the timer pauses while it has focus.', 'native button'],
      ['Keyboard', 'Enter / Space', 'Runs Undo and closes the strip.', 'native button'],
      ['Keyboard', 'Escape', 'Closes the strip while focus is inside it.', 'keydown on the region'],
      ['Pointer', 'Hover or touch', 'Pauses the timer.', 'pointerenter'],
      ['Screen reader', 'Arrives', 'Read once, politely, without moving focus.', 'role status'],
    ],
    loading: <p>Never show a snackbar while something is still happening. Post it when the action has finished, with the result in the message.</p>,
    focus: <p>The strip never takes focus on its own, so the person keeps their place. Tab reaches the key in the order of the page’s end.</p>,
  },
  deepDive: {
    positive: {
      purpose: <p>The action worked, and Undo puts it back.</p>,
      context: <Phone><Snackbar action={undo}>Lamp removed</Snackbar></Phone>,
      practices: ['Name the thing that changed.', 'Offer Undo for anything removed or moved.'],
      pair: { do: <Phone><Snackbar action={undo}>Lamp removed</Snackbar></Phone>, doNote: 'Names the lamp.', dont: <Phone><Snackbar action={undo}>Done</Snackbar></Phone>, dontNote: 'Repeats the status word and nothing else.' },
    },
    neutral: {
      purpose: <p>A plain note about a change that is neither good nor bad news.</p>,
      context: <Phone><Snackbar tone="neutral" action={undo}>Scene saved</Snackbar></Phone>,
      practices: ['Use it for saves and small changes.', 'Do not use it to soften a failure.'],
      pair: { do: <Phone><Snackbar tone="neutral">Scene saved</Snackbar></Phone>, doNote: 'A plain fact.', dont: <Phone><Snackbar tone="neutral">Washer didn’t answer</Snackbar></Phone>, dontNote: 'A failure told as a note.' },
    },
    warning: {
      purpose: <p>The action worked, but the result deserves a second look.</p>,
      context: <Phone><Snackbar tone="warning" action={undo}>Heater set to 28 °C</Snackbar></Phone>,
      practices: ['Say what is unusual in the message.', 'Keep Undo close.'],
      pair: { do: <Phone><Snackbar tone="warning" action={undo}>Heater set to 28 °C</Snackbar></Phone>, doNote: 'The value that is unusual.', dont: <Phone><Snackbar tone="warning" action={undo}>Lamp removed</Snackbar></Phone>, dontNote: 'A plain removal told as a warning.' },
    },
    critical: {
      purpose: <p>The action did not happen. The person can try again from the same key.</p>,
      context: <Phone><Snackbar tone="critical">Washer didn’t answer</Snackbar></Phone>,
      practices: ['Say what failed.', 'Use a Banner instead when the failure stays.'],
      pair: { do: <Phone><Snackbar tone="critical" action={{ label: 'Try again', onAction: none }}>Washer didn’t answer</Snackbar></Phone>, doNote: 'What failed, and a way to retry.', dont: <Phone><Snackbar tone="critical" action={undo}>Washer didn’t answer</Snackbar></Phone>, dontNote: 'Undo has nothing to undo.' },
    },
  },
  modifiers: [
    {
      name: 'action',
      rules: <p>Give one key that undoes, labelled Undo. Leave it out for a plain confirmation, and never add a second key.</p>,
      pair: { do: <Phone><Snackbar action={undo}>Lamp removed</Snackbar></Phone>, doNote: 'Undo for a removal.', dont: <Phone><Snackbar action={{ label: 'View', onAction: none }}>Lamp removed</Snackbar></Phone>, dontNote: 'A key that goes somewhere else instead of undoing.' },
    },
    {
      name: 'status',
      rules: <p>Leave the default word for the tone. Replace it only to translate it or to say something more exact, such as Removed.</p>,
      pair: { do: <Phone><Snackbar status="Removed" action={undo}>Kitchen lamp</Snackbar></Phone>, doNote: 'A more exact word.', dont: <Phone><Snackbar status="Yay" action={undo}>Lamp removed</Snackbar></Phone>, dontNote: 'A word that tells nothing.' },
    },
  ],
  related: [['/components/toast', 'Toast', 'Several notes that may stack, each with a close key.'], ['/components/bottom-nav', 'BottomNav', 'The strip the snackbar sits above.'], ['/components/action-sheet', 'ActionSheet', 'Where Remove usually comes from.']],
  references: [
    { title: 'WAI-ARIA 1.2 · status role', url: 'https://www.w3.org/TR/wai-aria-1.2/#status', why: 'A polite live region that does not move focus.' },
    { title: 'WCAG 2.2 · 2.2.1 Timing Adjustable', url: 'https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html', why: 'Why the timer pauses on hover and focus.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
