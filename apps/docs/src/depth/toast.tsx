// Usage tab for Toast (component-depth.md U1–U14). Toast is a short note after an action.
import { Stack, Toast } from 'dial-react';
import type { Depth } from './types';

const none = () => {};
const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const TOAST: Depth = {
  overview: (
    <>
      <p>Toast says what just happened after someone pressed a key, for example that the lamp is off or that the washer did not answer. It rises at the bottom of the screen, stays for at least five seconds, and goes away on its own. It never asks a question and never blocks the page.</p>
      <p>The status is printed twice, as a glyph and a word, such as a tick and Done. Each tone has its own glyph shape, so the tone reads without colour. No tone is orange, because orange belongs to the one main key of a unit. Use <code>ToastProvider</code> once near the root and <code>useToast()</code> to post a toast from anywhere; <code>Toast</code> on its own renders one strip in place.</p>
    </>
  ),
  whenToUse: ['To confirm an action that ran, such as Lamp turned off.', 'To report that a device did not answer, with a Try again key.', 'To offer Undo for an action that was easy to run by mistake.'],
  whenNot: [
    { situation: 'Asking before an action that is hard to undo', to: '/components/dialog', label: 'Dialog' },
    { situation: 'A state the device stays in, such as Offline', to: '/components/display', label: 'Display' },
    { situation: 'A setting the person changes', to: '/components/switch', label: 'Switch' },
  ],
  variants: {
    neutral: { purpose: 'A plain note that is neither good nor bad news, such as Schedule saved.', pairing: 'Use it when no other tone fits. The glyph is an i in a circle.' },
    positive: { purpose: 'The action worked, such as Lamp turned off.', pairing: 'Pair it with Undo when the action was easy to run by mistake.' },
    warning: { purpose: 'The action worked but something needs attention soon.', pairing: 'Say what to do in the message. The glyph is a triangle in ink.' },
    critical: { purpose: 'The action failed, such as Washer didn’t answer.', pairing: 'Pair it with Try again. It is announced at once as an alert.' },
  },
  anatomy: {
    render: <Toast tone="critical" action={{ label: 'Try again', onAction: none }} onClose={none}>Washer didn’t answer</Toast>,
    parts: [
      { part: 'Strip', selector: '[data-component="Toast"]', what: 'A short plastic body with the capped panel radius and a shadow down and to the right.' },
      { part: 'Glyph', selector: '[data-component="Toast"] svg', what: 'A printed symbol, one shape per tone, drawn in the tone’s mark ink.' },
      { part: 'Status word', selector: '[data-component="Toast"] > span:first-child > span', what: 'The tone in one word, which is Note, Done, Check or Failed.' },
      { part: 'Message', selector: '[data-component="Toast"] > span:nth-child(2)', what: 'What happened, in a few words.' },
      { part: 'Keys', selector: '[data-component="Toast"] > span:last-child', what: 'An optional plastic action key and the 44px round close key.' },
    ],
  },
  sizes: { na: 'Toast has one size. It is as wide as its message up to the reading measure, and the full width of a phone.' },
  emphasis: {
    text: <p>A toast is never loud. Its action key is plastic, and only one toast should say the same thing at a time. Up to three show at once; older ones leave first.</p>,
    pair: {
      do: <Toast tone="positive" action={{ label: 'Undo', onAction: none }} onClose={none}>All lamps turned off</Toast>,
      doNote: 'One message, one plastic key.',
      dont: <Stack gap="sm"><Toast tone="positive" onClose={none}>Kitchen lamp turned off</Toast><Toast tone="positive" onClose={none}>Hall lamp turned off</Toast><Toast tone="positive" onClose={none}>Porch lamp turned off</Toast></Stack>,
      dontNote: 'One toast per lamp. Say it once, as in All lamps turned off.',
    },
  },
  placement: {
    rows: [['Bottom of the screen, inline end', 'On a laptop toasts stack in the corner, newest nearest the edge.'], ['Bottom of the screen, full width', 'On a phone held upright the strip spans the screen above the home bar.']],
    examples: [{ title: 'After a key in a unit', render: <Unit><Stack gap="md"><p className="flush">Living room · all off</p><Toast tone="positive" action={{ label: 'Undo', onAction: none }} onClose={none}>All lamps turned off</Toast></Stack></Unit> }],
  },
  combinations: {
    good: [['Toast + Undo', 'Run the action at once and offer Undo, instead of asking first.'], ['Toast + the unit’s display', 'The toast says what happened; the display keeps showing the state.']],
    avoid: [{ title: 'a toast that asks a question', why: 'It leaves after a few seconds, so the question can go unanswered. Use a Dialog.', render: <Toast tone="warning" action={{ label: 'Yes', onAction: none }} onClose={none}>Stop the wash?</Toast> }],
  },
  content: {
    formula: <p>Say what happened in the past tense, in a few words, as in <em>Lamp turned off</em>. For a failure, say what failed and offer a way out, as in <em>Washer didn’t answer</em> with <em>Try again</em>. No full stop, no exclamation mark.</p>,
    pair: {
      do: <Toast tone="positive" onClose={none}>Lamp turned off</Toast>, doNote: 'What happened, in four words.',
      dont: <Toast tone="positive" onClose={none}>Success! Your request was processed.</Toast>, dontNote: 'Says nothing about the lamp.',
    },
    overflow: { text: 'A long message wraps onto more lines. The glyph, word and keys stay centred on the strip.', render: <div data-overflow-demo="" style={{ inlineSize: 360 }}><Toast tone="warning" onClose={none}>The hallway lamp lost its connection and will try again in two minutes</Toast></div> },
    rtl: { text: 'In right-to-left languages the glyph and word move to the right and the keys to the left.', render: <div dir="rtl"><Toast tone="positive" status="تم" onClose={none} closeLabel="إغلاق">أُطفئ المصباح</Toast></div> },
    expansion: { text: 'German runs about 30% longer. The message takes the room; the keys keep their size.', render: <Toast tone="critical" status="Fehler" action={{ label: 'Erneut versuchen', onAction: none }} onClose={none} closeLabel="Schließen">Waschmaschine antwortet nicht</Toast> },
  },
  behaviours: {
    states: [
      ['Arriving', 'Rises 8px and fades in over 160ms.', 'Announced politely, or at once when critical.'],
      ['Shown', 'Stays at least 5 s; 10 s with an action key.', 'The timer pauses while the pointer or focus is on a toast.'],
      ['Leaving', 'Fades out over 120ms, quicker than it came in.', 'Removed from the region after the fade.'],
      ['Reduced motion', 'Appears and goes at once.', 'No rise and no fade.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Reaches the action key and the close key. Focus pauses the timer.', 'native buttons'],
      ['Keyboard', 'Enter / Space', 'Runs the action or closes the toast.', 'Button, IconButton'],
      ['Pointer', 'Hover', 'Pauses the timer until the pointer leaves.', 'pointerenter on the region'],
      ['Screen reader', 'Arrive', 'Read out without moving focus.', 'role status, role alert for critical'],
    ],
    loading: <p>Toast has no loading state. Show progress on the unit’s display while the device works, and post the toast when it answers.</p>,
    focus: <p>A toast never takes focus. It is reached with Tab like any other key, and closing it leaves focus where it was.</p>,
  },
  deepDive: {
    neutral: {
      purpose: <p>A plain note says something changed, and the change is neither good nor bad.</p>,
      context: <Toast tone="neutral" onClose={none}>Schedule saved for tomorrow</Toast>,
      practices: ['Use it for saves and small changes.', 'Do not use it to soften a failure.'],
      pair: { do: <Toast tone="neutral" onClose={none}>Schedule saved</Toast>, doNote: 'A plain fact.', dont: <Toast tone="neutral" onClose={none}>Washer didn’t answer</Toast>, dontNote: 'A failure told as a note.' },
    },
    positive: {
      purpose: <p>The action the person ran has worked.</p>,
      context: <Toast tone="positive" action={{ label: 'Undo', onAction: none }} onClose={none}>All lamps turned off</Toast>,
      practices: ['Name the device and what it did.', 'Offer Undo when the action was easy to run by mistake.'],
      pair: { do: <Toast tone="positive" onClose={none}>Lamp turned off</Toast>, doNote: 'Names the lamp.', dont: <Toast tone="positive" onClose={none}>Done</Toast>, dontNote: 'Repeats the status word and says nothing else.' },
    },
    warning: {
      purpose: <p>The action worked, but something needs attention soon.</p>,
      context: <Toast tone="warning" onClose={none}>Filter needs cleaning soon</Toast>,
      practices: ['Say what needs doing.', 'If it needs doing now, it is critical.'],
      pair: { do: <Toast tone="warning" onClose={none}>Filter needs cleaning soon</Toast>, doNote: 'Says what to do.', dont: <Toast tone="warning" onClose={none}>Something may be wrong</Toast>, dontNote: 'Gives the person nothing to act on.' },
    },
    critical: {
      purpose: <p>The action failed. It is announced at once, as an alert.</p>,
      context: <Toast tone="critical" action={{ label: 'Try again', onAction: none }} onClose={none}>Washer didn’t answer</Toast>,
      practices: ['Offer Try again when retrying can help.', 'Keep it to failures the person caused by pressing a key.'],
      pair: { do: <Toast tone="critical" action={{ label: 'Try again', onAction: none }} onClose={none}>Washer didn’t answer</Toast>, doNote: 'A way out of the failure.', dont: <Toast tone="critical" onClose={none}>Error 0x2F</Toast>, dontNote: 'A code nobody can act on.' },
    },
  },
  modifiers: [
    {
      name: 'action',
      rules: <p>One plastic key with a verb on it, such as Undo or Try again. Pressing it closes the toast. A toast with an action stays 10 s.</p>,
      pair: { do: <Toast tone="positive" action={{ label: 'Undo', onAction: none }} onClose={none}>Lamp turned off</Toast>, doNote: 'One verb.', dont: <Toast tone="positive" action={{ label: 'OK', onAction: none }} onClose={none}>Lamp turned off</Toast>, dontNote: 'OK does what the close key does.' },
    },
    {
      name: 'status',
      rules: <p>Replace the default word when a more exact one exists, such as Saved or Offline. Keep it to one word.</p>,
      pair: { do: <Toast tone="warning" status="Offline" onClose={none}>Hallway lamp lost its connection</Toast>, doNote: 'One exact word.', dont: <Toast tone="warning" status="Please note" onClose={none}>Hallway lamp lost its connection</Toast>, dontNote: 'Two words that tell nothing.' },
    },
    {
      name: 'onClose',
      rules: <p>Shows the 44px close key. <code>useToast()</code> always adds it, so a person can close a toast before its timer ends.</p>,
      pair: { do: <Toast tone="neutral" onClose={none}>Schedule saved</Toast>, doNote: 'A way to close it early.', dont: <Toast tone="neutral">Schedule saved</Toast>, dontNote: 'It can only wait out its timer.' },
    },
  ],
  related: [['/components/dialog', 'Dialog', 'Ask before an action that is hard to undo.'], ['/components/display', 'Display', 'A state that stays, as opposed to an event.'], ['/components/button', 'Button', 'The action key on the toast.']],
  references: [
    { title: 'WCAG 2.2 · 4.1.3 Status Messages', url: 'https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html', why: 'Why a toast is a live region that does not take focus.' },
    { title: 'WCAG 2.2 · 2.2.1 Timing Adjustable', url: 'https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html', why: 'Why the timer is at least five seconds and pauses on hover and focus.' },
    { title: 'WAI-ARIA Authoring Practices · Alert pattern', url: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/', why: 'Why only the critical tone uses role alert.' },
  ],
};
