// Usage tab for Kbd (component-depth.md U1–U14). Kbd prints a key name as a small keycap.
import { Icon, Kbd, KbdCombo, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;

export const KBD: Depth = {
  overview: (
    <>
      <p>Kbd prints the name of a key, such as Esc, Enter or Ctrl, as a small keycap. It sits in a sentence or at the end of a row in a shortcuts list. The cap is flat with a lit top edge and a hard lower edge, so it reads as a key without a blurred shadow.</p>
      <p>It is a name and not a control. Nothing in it can be pressed, hovered or focused. To show a chord, use KbdCombo, which joins the keys with a printed plus.</p>
    </>
  ),
  whenToUse: ['To name a key in a sentence, as in Press Esc to close.', 'To list the shortcuts of a screen, one action per row.'],
  whenNot: [
    { situation: 'A key the person can press on screen', to: '/components/button', label: 'Button' },
    { situation: 'A short status word or a count', to: '/components/badge', label: 'Badge' },
  ],
  variants: { na: 'Kbd has one look, a flat cap with a hard lower edge. A chord is a second export, KbdCombo, not a variant.' },
  anatomy: {
    render: <p>Press <KbdCombo keys={['Ctrl', 'K']} /> to search.</p>,
    parts: [
      { part: 'Chord', selector: '[data-component="KbdCombo"]', what: 'Groups the caps of one chord so it never breaks across lines.' },
      { part: 'Cap', selector: '[data-component="KbdCombo"] > kbd', what: 'The key name on the knob plastic, with a lit top edge and a lower edge in ring ink.' },
      { part: 'Plus', selector: '[data-component="KbdCombo"] > span[aria-hidden]', what: 'The printed plus between caps. A screen reader hears the word plus instead.' },
    ],
  },
  sizes: { na: 'Kbd has one size. The cap is at least 24px square and takes the label size, so it sits in a line of body text.' },
  emphasis: { na: 'A cap is plastic and ink. It is never orange, and the orange key of the unit stays the only loud part.' },
  placement: {
    rows: [['Inside a sentence', 'Put the cap where the key name would be written.'], ['End of a row in a list', 'Put the action on the start side and the keys on the end side.']],
    examples: [{
      title: 'In a shortcuts list',
      render: (
        <Unit>
          <Stack gap="md">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Search</span><KbdCombo keys={['Ctrl', 'K']} /></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>Mute</span><Kbd>M</Kbd></div>
          </Stack>
        </Unit>
      ),
    }],
  },
  combinations: {
    good: [['Kbd + Text', 'A key name inside a sentence of body text.'], ['KbdCombo + List', 'One chord at the end of each row of shortcuts.']],
    avoid: [{ title: 'a Kbd that looks like a Button', why: 'A cap that someone has to press belongs to Button. A Kbd takes no click, so wiring one to a handler hides a control from the keyboard.', render: <Unit><Kbd>Enter</Kbd></Unit> }],
  },
  content: {
    formula: <p>Write the key as it is printed on a keyboard: <em>Esc</em>, <em>Enter</em>, <em>Ctrl</em>, or a single capital letter. One key per cap, and use KbdCombo for a chord.</p>,
    pair: {
      do: <p>Press <Kbd>Esc</Kbd>.</p>, doNote: 'One key, one cap.',
      dont: <p>Press <Kbd>Esc or Enter</Kbd>.</p>, dontNote: 'Two keys in one cap read as one key with a long name.',
    },
    overflow: { text: 'A long key name does not wrap. The cap grows with the word and keeps its height.', render: <p>Press <Kbd>Page Down</Kbd> to move on.</p> },
    rtl: { text: 'In right-to-left languages the caps of a chord run in reading order and the text around them flows from the right.', render: <div dir="rtl"><p>اضغط <KbdCombo keys={['Ctrl', 'K']} /> للبحث.</p></div> },
    expansion: { text: 'Translated key names can run 30% longer. The cap grows inline and the line box stays the same.', render: <p>Drücken Sie <Kbd>Eingabetaste</Kbd>.</p> },
  },
  behaviours: {
    states: [
      ['Default', 'The only state. A flat cap with a lit top edge and a lower edge.', 'Read as the key name in the text.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Does not stop on a Kbd. It is not interactive.', 'none'],
      ['Screen reader', 'Read', 'Read as text. A cap with an icon is read by its label, and the plus of a chord is read as the word plus.', 'kbd, label'],
    ],
    loading: <p>Kbd has no loading state.</p>,
    focus: <p>A Kbd never takes focus.</p>,
  },
  deepDive: { na: 'Kbd has a single look, so there is no section per variant.' },
  modifiers: [
    {
      name: 'label',
      rules: <p>Pass <code>label</code> when the cap shows an icon or a symbol, so a screen reader hears the key name. The printed cap is then hidden from assistive tech.</p>,
      pair: {
        do: <p>Use <Kbd label="Up arrow"><Icon name="chevron-up" size="sm" /></Kbd> to go up.</p>, doNote: 'The icon has a spoken name.',
        dont: <p>Use <Kbd><Icon name="chevron-up" size="sm" /></Kbd> to go up.</p>, dontNote: 'The cap is silent: nothing names the key.',
      },
    },
    {
      name: 'keys',
      rules: <p>On KbdCombo, <code>keys</code> lists the keys in the order they are pressed together. Use <code>joinLabel</code> to translate the word read between them.</p>,
      pair: {
        do: <KbdCombo keys={['Ctrl', 'Shift', 'N']} />, doNote: 'One chord, one group that never breaks across lines.',
        dont: <span><Kbd>Ctrl</Kbd> + <Kbd>K</Kbd></span>, dontNote: 'Separate caps with a loose plus can wrap between the keys.',
      },
    },
  ],
  related: [['/components/button', 'Button', 'A key the person presses on screen.'], ['/components/badge', 'Badge', 'A printed word or count that is not a key.'], ['/components/text', 'Text', 'The body text a key name sits in.']],
  references: [
    { title: 'MDN · The Keyboard Input element', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd', why: 'Why a chord is a kbd that holds kbd elements.' },
    { title: 'WCAG 2.2 · 1.4.11 Non-text Contrast', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html', why: 'The 3:1 minimum for the cap edge.' },
  ],
};
