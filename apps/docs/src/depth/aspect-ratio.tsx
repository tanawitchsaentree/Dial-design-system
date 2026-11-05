// Usage tab for AspectRatio (component-depth.md U1–U14). AspectRatio is a layout primitive (identity: false):
// it holds its child at one of four ratios and has no look of its own beyond the optional media corner.
import { AspectRatio, Display, Stack } from 'dial-react';
import type { Depth } from './types';

const Unit = ({ children }: { children: React.ReactNode }) => <div className="demo-box demo-card">{children}</div>;
const view = (ratio: '1/1' | '4/3' | '16/9' | '3/2' = '16/9', rounded = false, value = 'Front door') => (
  <AspectRatio ratio={ratio} rounded={rounded}><Display kind="oled" label="Doorbell camera" value={value} /></AspectRatio>
);

export const ASPECT_RATIO: Depth = {
  overview: (
    <>
      <p>AspectRatio holds a picture, a camera view or a chart window at a fixed proportion. The frame takes its height from its width, so the space is kept before the content loads and nothing below it moves.</p>
      <p>Its one child fills the frame edge to edge. The proportion comes from a short list: square, four to three, sixteen to nine and three to two.</p>
    </>
  ),
  whenToUse: ['To keep room for a picture or video before it has loaded.', 'To make a row of tiles the same shape.', 'To hold a chart or camera window to one proportion.'],
  whenNot: [
    { situation: 'Space between siblings', to: '/components/stack', label: 'Stack' },
    { situation: 'Columns of equal width', to: '/components/grid', label: 'Grid' },
  ],
  variants: { na: 'AspectRatio has no variant prop. The ratio is a modifier, covered below.' },
  anatomy: {
    render: view(),
    parts: [
      { part: 'Frame', selector: '[data-component="AspectRatio"]', what: 'A box as wide as its parent, with its height set by the ratio.' },
      { part: 'Child', selector: '[data-component="AspectRatio"] > *', what: 'The one element inside, stretched to fill the frame.' },
    ],
  },
  sizes: { na: 'AspectRatio has no size prop. It is as wide as its parent, so the parent sets the size.' },
  emphasis: { na: 'A layout primitive has no emphasis of its own. Nothing in a frame is orange.' },
  placement: {
    rows: [['Above a name in a tile', 'Square, with the media corner on.'], ['Across a unit', 'Sixteen to nine for video and camera views.']],
    examples: [{ title: 'A camera view in a unit', render: <Unit><Stack gap="sm">{view('16/9', true)}<p className="flush">Front door</p></Stack></Unit> }],
  },
  combinations: {
    good: [['AspectRatio + Display', 'A window with a reading fills the frame.'], ['AspectRatio + Stack', 'A stack sets the gap between a frame and its caption.']],
    avoid: [{ title: 'two children in one frame', why: 'Each child is stretched to the full frame, so they pile on top of each other. Wrap them in one element.', render: <Unit><AspectRatio ratio="4/3"><Display kind="oled" label="First" value="One" /></AspectRatio></Unit> }],
  },
  content: { na: 'AspectRatio holds no text of its own.' },
  behaviours: {
    states: [['Rest', 'A frame at the chosen ratio with the child filling it.', 'Structure only. It paints nothing.'], ['Forced colours', 'No change, because it draws nothing.', 'The child keeps its own border.']],
    interactions: [['Keyboard', 'Tab', 'Not focusable. Children keep their own order.', 'Renders a div'], ['Screen reader', 'Read', 'Not announced. It has no role. Name the child, not the frame.', 'Renders a div']],
    loading: <p>The frame is the loading state. Its height is held from the first paint, so a picture arriving later does not push the page down.</p>,
    focus: <p>It never takes focus. Reading and tab order follow the DOM order of its child.</p>,
  },
  deepDive: { na: 'There is no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'ratio',
      rules: <p>Pick <code>1/1</code>, <code>4/3</code>, <code>16/9</code> (the default) or <code>3/2</code> by the shape of the content. Use the ratio the content was made in, because a child that does not match is cropped.</p>,
      pair: { do: view('16/9'), doNote: 'A wide camera view in a wide frame.', dont: view('1/1', false, 'Front door camera, wide'), dontNote: 'A wide view in a square frame is cropped at both sides.' },
    },
    {
      name: 'rounded',
      rules: <p>Turn it on when the frame stands alone, such as a tile. It uses the same media corner as the windows. Leave it off when the frame sits flush inside a unit that already rounds its own edge.</p>,
      pair: { do: view('3/2', true), doNote: 'A free-standing tile with the media corner.', dont: <Unit>{view('3/2', true)}</Unit>, dontNote: 'A rounded frame inside a rounded unit gives two corners that do not nest.' },
    },
  ],
  related: [['/components/stack', 'Stack', 'Space between a frame and its caption.'], ['/components/grid', 'Grid', 'A row of equal frames.'], ['/components/display', 'Display', 'A window to put inside a frame.']],
  references: [
    { title: 'MDN · aspect-ratio', url: 'https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio', why: 'How the browser derives a height from a width.' },
    { title: 'Every Layout · The Frame', url: 'https://every-layout.dev/layouts/frame/', why: 'The case for a frame that crops its child to a ratio.' },
    { title: 'web.dev · Optimize Cumulative Layout Shift', url: 'https://web.dev/articles/optimize-cls', why: 'Why space is reserved before media loads.' },
  ],
};
