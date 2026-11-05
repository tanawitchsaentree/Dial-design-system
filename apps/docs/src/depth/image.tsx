// Usage tab for Image (component-depth.md U1–U14). Image shows a picture in a recessed window at a fixed proportion.
import { Image, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const hall = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 30"><rect width="40" height="30" fill="tan"/><circle cx="29" cy="9" r="4" fill="wheat"/><path d="M0 30L12 12l9 11 6-7 13 14z" fill="saddlebrown"/></svg>')}`;
const hallImage = (props: Partial<React.ComponentProps<typeof Image>> = {}) => <Image src={hall} alt="The hall, seen from the front door" ratio="4/3" {...props} />;

export const IMAGE: Depth = {
  overview: (
    <>
      <p>Image shows a picture the way a device shows a reading: through a window cut into the body. The window holds one proportion, so the page does not move when the picture arrives or fails.</p>
      <p>The picture is content, so the window is not a key and cannot be pressed. Words about the picture are printed on the body below it, never over the photo.</p>
    </>
  ),
  whenToUse: ['To show a photo, a camera frame or a plan inside a card or a page.', 'To hold the space of a picture that loads late.'],
  whenNot: [
    { situation: 'A person or an owner', to: '/components/avatar', label: 'Avatar' },
    { situation: 'A glyph for a device or a room', to: '/components/icon', label: 'Icon' },
    { situation: 'Any content that needs a fixed shape but is not a picture', to: '/components/aspect-ratio', label: 'AspectRatio' },
  ],
  variants: { na: 'Image has one look, a recessed window. The ratio and the fit are props, and they change the shape of the window, not its material.' },
  anatomy: {
    render: <Stack gap="sm">{hallImage({ caption: 'Hall, north wall, 08:10' })}</Stack>,
    parts: [
      { part: 'Window', selector: '[data-component="Image"] > div', what: 'A recess with a hairline ring and the inverse light, held at the ratio.' },
      { part: 'Picture', selector: '[data-component="Image"] img', what: 'Fills the window and is clipped by its ring.' },
      { part: 'Caption', selector: '[data-component="Image"] figcaption', what: 'One line in secondary ink on the body, under the window.' },
    ],
  },
  sizes: { na: 'Image has no size prop. It is as wide as its column, and the ratio sets the height.' },
  emphasis: { na: 'An Image is never loud. It is a window with ink around it, and nothing in it is orange.' },
  placement: {
    rows: [['The head of a card', 'Use 3/2 or 16/9, with the title in a Heading below.'], ['A gallery', 'Use the same ratio for every picture, so the windows line up.']],
    examples: [{ title: 'In a card', render: <Unit><Stack gap="sm">{hallImage({ ratio: '3/2' })}<p className="flush">Hall</p></Stack></Unit> }],
  },
  combinations: {
    good: [['Image + Card', 'The window heads the card and the text stands on the body below.'], ['Image + caption', 'The caption is printed under the window, on the body.']],
    avoid: [{ title: 'mixed ratios in one row', why: 'Windows of different heights break the line they share. Pick one ratio for the whole row.', render: <Unit><Stack direction="row" gap="sm">{hallImage({ ratio: '1/1' })}{hallImage({ ratio: '16/9' })}</Stack></Unit> }],
  },
  content: {
    formula: <p>Write <code>alt</code> as what a person who cannot see the picture needs to know, in one sentence. The <code>caption</code> adds what the picture cannot say, such as a place and a time.</p>,
    pair: {
      do: hallImage({ alt: 'The hall, seen from the front door, with the stairs on the right' }), doNote: 'It says what is in the picture.',
      dont: hallImage({ alt: 'image.jpg' }), dontNote: 'A file name tells nobody anything.',
    },
    overflow: { text: 'A long caption wraps under the window. The window itself keeps its size.', render: hallImage({ caption: 'Hall, north wall, 08:10, after the motion light came on for the third time in the same hour' }) },
    rtl: { text: 'In right-to-left languages the caption starts at the right edge of the window. The picture is not mirrored.', render: <div dir="rtl">{hallImage({ caption: 'الردهة، الجدار الشمالي' })}</div> },
    expansion: { text: 'The window is as wide as its column, so a longer caption only adds lines under it.', render: hallImage({ caption: 'Hall, north wall, 08:10 and a longer line of text under the picture' }) },
  },
  behaviours: {
    states: [
      ['Loading', 'One dash in the window. The height is already held.', 'The picture is announced when it arrives.'],
      ['Loaded', 'The picture fills the window under the inverse light.', 'Read as an image with its alt text.'],
      ['Failed', 'Two dashes in the window. No broken-image icon.', 'The window is an image named by alt.'],
    ],
    interactions: [
      ['Keyboard', 'Tab', 'Takes no focus. An Image is not a control.', 'none'],
      ['Screen reader', 'Read', 'An image with the alt text. With an empty alt it is skipped.', 'img alt, role="img"'],
    ],
    loading: <p>While the picture loads the window shows one dash and keeps its height. Nothing pulses or shimmers. When the picture arrives it replaces the dash at once.</p>,
    focus: <p>Image never takes focus. To make a picture pressable, put it inside a link or a button that has its own name.</p>,
  },
  deepDive: { na: 'Image has a single variant, so there is no section per variant.' },
  modifiers: [
    {
      name: 'alt',
      rules: <p>Required. Say what the picture shows. Pass an empty string only when the text beside it already says everything, and the window is then hidden from assistive tech.</p>,
      pair: { do: hallImage({ alt: 'The hall, seen from the front door' }), doNote: 'The picture is described.', dont: hallImage({ alt: 'Picture' }), dontNote: 'It names the kind of thing and nothing about it.' },
    },
    {
      name: 'fit',
      rules: <p><code>cover</code> fills the window and crops. Use <code>contain</code> for a chart or a plan, where a cropped edge would lose information.</p>,
      pair: { do: hallImage({ fit: 'cover' }), doNote: 'A photo fills the window.', dont: hallImage({ fit: 'contain', ratio: '1/1' }), dontNote: 'A photo in a window of another shape leaves plastic at the sides for no reason.' },
    },
  ],
  related: [['/components/aspect-ratio', 'AspectRatio', 'The frame Image uses for its proportion; use it for content that is not a picture.'], ['/components/avatar', 'Avatar', 'A person or owner as a picture or letters.'], ['/components/card', 'Card', 'The body an Image usually heads.']],
  references: [
    { title: 'WCAG 2.2 · 1.1.1 Non-text Content', url: 'https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html', why: 'When a picture needs a text alternative and when it is decoration.' },
    { title: 'W3C WAI · Images tutorial', url: 'https://www.w3.org/WAI/tutorials/images/', why: 'How to write alt text for informative, decorative and complex pictures.' },
  ],
};
