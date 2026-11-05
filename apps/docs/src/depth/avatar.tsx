// Usage tab for Avatar (component-depth.md U1–U14). Avatar shows a person or owner as a picture or initials.
import { Avatar, List, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const row = (size?: 'sm' | 'md' | 'lg') => <Avatar name="Maren Solberg" size={size} label="Maren Solberg" />;

export const AVATAR: Depth = {
  overview: (
    <>
      <p>Avatar shows who a row, a card or a device belongs to. It is a small window cut into the body with a picture in it, or one or two letters when there is none.</p>
      <p>It is a reading, not a control, so it is a rounded square and never a disc, and it cannot be pressed. Put it beside the person’s name, not instead of it.</p>
    </>
  ),
  whenToUse: ['To show the owner or a member at the start of a list row.', 'To head a profile or a device card with the person it belongs to.'],
  whenNot: [
    { situation: 'A state that a row prints, such as On or Away', to: '/components/badge', label: 'Badge' },
    { situation: 'A glyph for a device or a room', to: '/components/icon', label: 'Icon' },
  ],
  variants: { na: 'Avatar has one look, a recessed window. Whether it holds a picture or letters follows from the src and name props.' },
  anatomy: {
    render: <Stack direction="row" gap="md" align="end">{row('md')}<Avatar name="Maren Solberg" size="md" /></Stack>,
    parts: [
      { part: 'Window', selector: '[data-component="Avatar"]', what: 'A recess with a hairline ring and the inverse light, square with the media corner.' },
      { part: 'Initials', selector: '[data-component="Avatar"] > span', what: 'Up to two letters in medium ink, taken from the name.' },
    ],
  },
  sizes: {
    sm: { use: '32px, for dense rows and inside a field.', pairs: 'Body text in a one-line row.' },
    md: { use: '44px, the default, level with a row of controls.', pairs: 'A List row with a name and a description.' },
    lg: { use: '80px, for the head of a profile or a device card.', pairs: 'A heading with the person’s name.' },
  },
  emphasis: { na: 'An Avatar is never loud. It is grey plastic with ink whoever it shows, and nothing in it is orange.' },
  placement: {
    rows: [['The start of a List row', 'Pass it as leading. The row hides it from assistive tech.'], ['The head of a card', 'Use lg, with the name in a Heading beside it.']],
    examples: [{ title: 'In a list row', render: <Unit><List label="People"><List.Item leading={<Avatar name="Maren Solberg" />} label="Maren Solberg" description="Guest" /></List></Unit> }],
  },
  combinations: {
    good: [['Avatar + List', 'The window leads the row and the name stands beside it.'], ['Avatar + Heading', 'A large window beside the name heads a profile.']],
    avoid: [{ title: 'a stack of overlapping Avatars', why: 'Overlap hides the letters and the picture of every window but the top one. List the people instead.', render: <Unit><Stack direction="row" gap="xs">{row('sm')}{row('sm')}</Stack></Unit> }],
  },
  content: {
    formula: <p>Pass the full name. The window prints the first letter of the first and last word. Pass <code>initials</code> only when the name gives the wrong letters, as for a device or a room.</p>,
    pair: {
      do: <Avatar name="Maren Solberg" label="Maren Solberg" />, doNote: 'The full name, so the letters follow from it.',
      dont: <Avatar name="Maren Solberg" initials="Maren" label="Maren Solberg" />, dontNote: 'Five letters do not fit the window.',
    },
    overflow: { text: 'Letters never wrap. Only two are printed, so a long name cannot overflow the window.', render: <Avatar name="Maximilian Alexander von Hohenzollern-Sigmaringen" label="Maximilian" /> },
    rtl: { text: 'In right-to-left languages the window sits at the start of the row, on the right. The letters are the first of each word in reading order.', render: <div dir="rtl"><Avatar name="سارة خالد" label="سارة خالد" /></div> },
    expansion: { text: 'The window has a fixed size, so a longer name changes nothing in it. The name beside it wraps.', render: <Avatar name="Konstantinos Papadopoulos" label="Konstantinos Papadopoulos" /> },
  },
  behaviours: {
    states: [
      ['Picture', 'The picture fills the window under the inverse light.', 'Named by label, or hidden.'],
      ['Initials', 'Up to two letters in medium ink.', 'Named by label, or hidden.'],
      ['Picture failed', 'The window falls back to the initials.', 'Unchanged.'],
      ['Empty', 'One printed dash.', 'Named by label, or hidden.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Takes no focus. An Avatar is not a control.', 'none'],
      ['Screen reader', 'Read', 'With label it is an image with that name. Without it the window is hidden.', 'role="img", aria-hidden'],
    ],
    loading: <p>Avatar has no loading state. Until the picture arrives, the window shows the initials, and a slow picture appears over them.</p>,
    focus: <p>Avatar never takes focus. To make a person pressable, wrap the row in a List item with <code>href</code> or <code>onPress</code>.</p>,
  },
  deepDive: { na: 'Avatar has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'label',
      rules: <p>Leave it out when the name is printed beside the window, so it is not read twice. Pass it when the window stands alone.</p>,
      pair: { do: <Avatar name="Maren Solberg" label="Maren Solberg" />, doNote: 'A window that stands alone is named.', dont: <Avatar name="Maren Solberg" />, dontNote: 'Alone and silent: a screen reader user never learns who it is.' },
    },
  ],
  related: [['/components/list', 'List', 'The row an Avatar usually leads.'], ['/components/badge', 'Badge', 'A state printed as a lamp and a word.'], ['/components/icon', 'Icon', 'A glyph for a device or a room.']],
  references: [
    { title: 'WAI-ARIA · img role', url: 'https://www.w3.org/TR/wai-aria-1.2/#img', why: 'How a named window is exposed.' },
    { title: 'WCAG 2.2 · 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html', why: 'When a picture needs a text alternative and when it is decoration.' },
    { title: 'WCAG 2.2 · 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html', why: 'Why a picture has alternative text and initials are read as the name.' },
  ],
};
