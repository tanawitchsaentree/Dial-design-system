// Usage tab for VisuallyHidden (component-depth.md U1–U14). VisuallyHidden keeps words for assistive tech and takes them off the face.
import { Badge, Link, Stack, Text, VisuallyHidden } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const VISUALLY_HIDDEN: Depth = {
  overview: (
    <>
      <p>VisuallyHidden holds words that a screen reader should read and a sighted person should not see. A link that says only Heating gets its full sense this way, and so does a count that needs a unit after it.</p>
      <p>It clips its content to one pixel and takes it out of the flow. The words stay in the accessibility tree, so they are read aloud, found by search and usable as a label. With <code>focusable</code> it turns into a skip key while the keyboard is on it.</p>
    </>
  ),
  whenToUse: ['To add words for a screen reader that the face already says with a symbol or a number.', 'To name a region with a heading nobody needs to see.', 'To hold a skip link that shows only when the keyboard reaches it.'],
  whenNot: [
    { situation: 'Words everyone needs to read', to: '/components/text', label: 'Text' },
    { situation: 'Help that appears when pointing at a part', to: '/components/tooltip', label: 'Tooltip' },
  ],
  variants: { na: 'VisuallyHidden has one look, which is no look. The focusable form is a boolean, covered under Modifiers.' },
  anatomy: {
    render: <Unit><Badge count={3}>offline<VisuallyHidden> devices</VisuallyHidden></Badge></Unit>,
    parts: [
      { part: 'Hidden words', selector: '[data-component="VisuallyHidden"]', what: 'A one pixel box, clipped and out of the flow. Its text is still read aloud.' },
    ],
  },
  sizes: { na: 'VisuallyHidden has no size. Hidden, it is one pixel. As a focusable key it is the 44px control height.' },
  emphasis: { na: 'Nothing here is seen until focus arrives, and the revealed key is never orange.' },
  placement: {
    rows: [['Inside a control, after its visible word', 'The extra words complete the name without changing the face.'], ['First in the page, before the header', 'A focusable skip link, so the first Tab offers to jump past the navigation.']],
    examples: [{ title: 'After a visible word', render: <Unit><Link href="#heating">Heating<VisuallyHidden>, opens the heating rules</VisuallyHidden></Link></Unit> }],
  },
  combinations: {
    good: [['VisuallyHidden + Link', 'A short visible word with the full destination read aloud.'], ['VisuallyHidden + Badge', 'A number on the face with its unit for a screen reader.']],
    avoid: [{ title: 'hiding the only copy of an instruction', why: 'A sighted person cannot see it. If everyone needs the words, print them.', render: <Unit><Stack gap="sm"><Text>Heater</Text><VisuallyHidden>Hold the key for two seconds to reset</VisuallyHidden></Stack></Unit> }],
  },
  content: {
    formula: <p>Write the words as you would say them aloud, starting with the thing, as in <em>3 offline devices</em>. Keep to a phrase. Do not repeat what the visible word already says.</p>,
    pair: {
      do: <Link href="#heating">Heating<VisuallyHidden>, opens the heating rules</VisuallyHidden></Link>, doNote: 'The hidden words add the destination.',
      dont: <Link href="#heating">Heating<VisuallyHidden> Heating link</VisuallyHidden></Link>, dontNote: 'The screen reader says Heating twice and names the role again.',
    },
    overflow: { text: 'Hidden words never wrap or take room, so a long phrase does not change the layout. Keep it short for the listener.', render: <Unit><Badge count={3}>offline<VisuallyHidden> devices in the upstairs rooms of the house</VisuallyHidden></Badge></Unit> },
    rtl: { text: 'The box has no direction of its own. A focusable key appears at the start corner, which is the right in right-to-left languages.', render: <div dir="rtl"><Unit><Badge count={3}>غير متصل<VisuallyHidden> أجهزة</VisuallyHidden></Badge></Unit></div> },
    expansion: { text: 'Translated words can run 30% longer. The hidden box takes no room, and a revealed key grows to fit.', render: <Unit><Badge count={3}>offline<VisuallyHidden> Geräte sind nicht verbunden</VisuallyHidden></Badge></Unit> },
  },
  behaviours: {
    states: [
      ['Hidden', 'Nothing is drawn. The box is one pixel.', 'The words are read in order with the text around them.'],
      ['Focused (focusable)', 'A raised key with a focus ring at the start corner.', 'The link inside is announced as normal.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Moves to the focusable content inside. The wrapper itself takes no focus.', 'native'],
      ['Screen reader', 'Read', 'Reads the words in place, as if they were printed.', 'text in the accessibility tree'],
    ],
    loading: <p>VisuallyHidden has no loading state.</p>,
    focus: <p>A focusable VisuallyHidden is for a link or button. The element inside takes focus and the key appears at the top corner. Put it first in the page.</p>,
  },
  deepDive: { na: 'VisuallyHidden has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'focusable',
      rules: <p>Set <code>focusable</code> for a skip link or any control that a keyboard user must see when it has focus. Leave it off for plain words. A focusable wrapper with nothing focusable inside never appears.</p>,
      pair: {
        do: <VisuallyHidden focusable><Link href="#main">Skip to the content</Link></VisuallyHidden>, doNote: 'A link inside, so Tab shows the key.',
        dont: <VisuallyHidden focusable>Skip to the content</VisuallyHidden>, dontNote: 'Plain words cannot take focus, so the key never shows.',
      },
    },
    {
      name: 'asChild',
      rules: <p>Set <code>asChild</code> to hand the hiding to your own element, such as a router link. The element then keeps its own tag and is the thing that shows on focus.</p>,
      pair: {
        do: <VisuallyHidden asChild focusable><a href="#main">Skip to the content</a></VisuallyHidden>, doNote: 'One anchor, no extra wrapper.',
        dont: <VisuallyHidden asChild><span>Skip</span><span>Content</span></VisuallyHidden>, dontNote: 'asChild takes exactly one element.',
      },
    },
  ],
  related: [['/components/text', 'Text', 'Words everyone should read.'], ['/components/tooltip', 'Tooltip', 'Help that appears on point or focus.'], ['/components/link', 'Link', 'The usual thing to put inside a skip key.']],
  references: [
    { title: 'WCAG 2.2 · 2.4.1 Bypass Blocks', url: 'https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html', why: 'Why a skip link is expected on every page.' },
    { title: 'WebAIM · Invisible content just for screen reader users', url: 'https://webaim.org/techniques/css/invisiblecontent/', why: 'Why display none and off-screen boxes fail.' },
  ],
};
