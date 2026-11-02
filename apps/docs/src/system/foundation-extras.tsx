// Sections that cover the topics Carbon, Atlassian and Apple give each foundation page
// (tooling/kiln/data/topics/*.json, gate G-BT1). Each Section id is mapped to its topic in
// system/benchmark-coverage.json; a topic dial does not need is declined there with a reason from the
// concept. Every number is read from the tokens through tok(); every claim was checked against
// packages/react and packages/tokens on 2026-11-01. The Content and Accessibility foundations live in
// guides.tsx, so their topics are covered there.
import type { ReactElement } from 'react';
import { DoDont, Section, TOKENS } from '../book/kit';

const tok = (p: string) => String(TOKENS[p]?.value ?? '—');
const bp = (p: string, at: string) => String(TOKENS[p]?.breakpoints?.[at]?.value ?? tok(p));
const dark = (p: string) => String(TOKENS[p]?.themes?.dark?.value ?? tok(p));

function ColorExtras() {
  return (
    <>
      <Section id="color-anatomy" title="Families">
        <p>The palette has a few small families. Warm-white ABS runs from {tok('color.abs.0')} to {tok('color.abs.900')} and is the light edition. Charcoal is the dark edition, with {tok('color.charcoal.950')} as its darkest step. Orange has four steps around {tok('color.orange.500')}.</p>
        <p>Two window families sit apart from the plastic. The LCD is grey-green {tok('color.lcd.bg')} with ink {tok('color.lcd.ink')}, and the OLED is {tok('color.oled.bg')} with ink {tok('color.oled.ink')}. Green, amber and red exist only for status lamps. The alpha colours are light and shade for the one light source.</p>
      </Section>
      <Section id="color-layering" title="Layering">
        <p>Colour steps with height. The page is {tok('surface.page')}. A unit body sits on it in {tok('surface.solid')}, one step darker, and is lifted by its shadow. A well or display window is recessed into the body and uses {tok('surface.sunken')}, the next step down.</p>
        <p>In dark the order holds. The page is {dark('surface.page')}, the body {dark('surface.solid')} and a well {dark('surface.sunken')}. A part never gets a lighter colour because it is higher. Height is told by the shadow.</p>
      </Section>
      <Section id="color-tokens" title="Colour through tokens">
        <p>Primitives are named after the material and a step, such as <code>color.abs.100</code>. Components never read them. They read a semantic role such as <code>surface.solid</code> or <code>action.accent</code>, or a component token such as <code>unit.knob-bg</code> that points at a role.</p>
        <p>Component CSS holds no raw colour. The lint in <code>tooling/no-hardcode-lint.mjs</code> fails the build when it finds one. To change a colour, change the role it belongs to and every part that uses it follows.</p>
      </Section>
      <Section id="color-states" title="States in colour">
        <p>Hover darkens a key's printing one step, to <code>text.primary</code>. The orange control's hover is {tok('action.accent-hover')}. Pressed is told by height, since the part drops and its shadow collapses. Selected is the orange part or a lit indicator.</p>
        <p>Focus is a {tok('focus-ring.width')} ring in {tok('focus.ring')} with a {tok('focus.halo')} halo, so it shows on plastic and on orange. Disabled parts go flat and fade to {tok('opacity.disabled')}.</p>
      </Section>
      <Section id="color-themes" title="Colour in each theme">
        <p>Light is the base. Its page is {tok('surface.page')} and its printing is {tok('text.primary')}. Dark is the charcoal edition, with page {dark('surface.page')} and printing {dark('text.primary')}. Orange stays {tok('action.accent')} in both, because the same dyed plastic is used in both editions.</p>
        <p>The orange rim changes. It is {tok('action.accent-rim')} in light and {dark('action.accent-rim')} in dark, so the edge of the knob still reads against the body.</p>
      </Section>
      <Section id="color-high-contrast" title="High contrast">
        <p>Nineteen components carry a <code>forced-colors</code> rule. In Windows high contrast, edges become system colours and the knob, keys and wells keep a visible outline. Shadows drop out there, so every raised part also has a border.</p>
        <p>dial has no separate increased-contrast theme yet. Its normal pairs already hold 4.5:1 for text, which is what most people who turn up contrast need.</p>
      </Section>
      <Section id="color-a11y" title="Contrast and meaning">
        <p>Every text pair holds 4.5:1 or more in both themes, measured pixel by pixel on the built pages. Ink on orange is {tok('text.on-accent')}, which holds above 5:1. Control edges aim for 3:1 against the body.</p>
        <p>Colour never carries meaning alone. A status lamp always has a word beside it, and the chosen key is also the one that is down or marked.</p>
      </Section>
      <Section id="color-platforms" title="Colour spaces and platforms">
        <p>All colours are written as sRGB hex. dial also ships tokens for SwiftUI, Tailwind and Figma, and the native targets need hex, so there are no Display P3 values. The same hex reaches every platform, which keeps the plastic the same colour on a phone and a laptop.</p>
      </Section>
    </>
  );
}

function TypographyExtras() {
  return (
    <>
      <Section id="type-principles" title="How type is used">
        <p>Type in dial is printing on a case. It labels a part and says a value. It does not decorate. Hierarchy comes from size and position. A heading is larger and sits higher. A label sits on the inset line beside its control.</p>
        <p>Weight changes little, and colour never changes for emphasis.</p>
      </Section>
      <Section id="type-typeface" title="Typeface">
        <p>One grotesk, set through the stack {tok('type.family')}. Code and token names use {tok('type.mono')}. Display values on the LCD are drawn as SVG segments, so they need no font.</p>
      </Section>
      <Section id="type-custom-fonts" title="Brand fonts">
        <p>dial loads no web font. The stack starts with Helvetica Neue, which most Apple devices have, and falls back to Arial and the system sans elsewhere. A product can put its own grotesk at the front of <code>type.family</code>. It should keep two weights and tabular figures.</p>
      </Section>
      <Section id="type-styles" title="Styles by role">
        <p>Body text is {tok('type.body')} at leading {tok('type.leading-body')}. Long reading text is {tok('type.reading')} at {tok('type.leading-reading')}. Labels are {tok('type.label')} and captions {tok('type.caption')}. Titles are {tok('type.title')}, headlines {tok('type.headline')} and the display size {tok('type.display')}.</p>
        <p>Every number that changes uses tabular figures, so a value does not jump sideways when its digits change. Text picks these roles by name through its size prop.</p>
      </Section>
      <Section id="type-user-size" title="The reader's text size">
        <p>The type tokens are in pixels. Browser zoom scales them. A larger default font size in the browser settings does not change them yet. That is a known gap, and moving the scale to rem is on the list.</p>
      </Section>
      <Section id="type-color" title="Type colour">
        <p>Printing is {tok('text.primary')} or {tok('text.secondary')} on light plastic, and {dark('text.primary')} or {dark('text.secondary')} on charcoal. There is no tinted text. Links, labels and values all use ink, and orange is never used for text.</p>
      </Section>
      <Section id="type-legibility" title="Legibility">
        <p>The smallest step is {tok('type.micro')}, used only for scale numerals on a fader. Running text is at least {tok('type.body')}. Lines of reading text stop at {tok('type.measure')}. Every text pair is measured at 4.5:1 or more on its real background, in both themes.</p>
      </Section>
      <Section id="type-platforms" title="Type on other platforms">
        <p>The SwiftUI token file carries the same sizes as plain numbers. On iOS the stack resolves to Helvetica Neue. On Android it falls back to the system sans, which is close enough for a label and keeps tabular figures.</p>
      </Section>
    </>
  );
}

function SpacingExtras() {
  return (
    <>
      <Section id="space-base" title="The base unit">
        <p>Space is built on a {tok('space.1')} step. The body's inset is {tok('gap.inset')}, six steps, and grille holes sit on the same step. So a display, a grille and a knob inside one unit line up without any nudging.</p>
        <p>A few half steps exist for small parts, such as {tok('space.0-5')} and {tok('space.1-5')}.</p>
      </Section>
      <Section id="space-tokens" title="Space tokens">
        <p>Components read named gaps, such as <code>gap.inset</code> or <code>gap.section</code>, which point at a step of the scale. Layout uses the Stack gaps, from {tok('stack.gap-xs')} to {tok('stack.gap-xl')}. There are no negative space tokens. A part that overlaps another would break the fixed face of a unit.</p>
      </Section>
      <Section id="space-applying" title="Which space for which job">
        <p>Between a label and its control use {tok('gap.md')}. Between parts in one unit use {tok('gap.lg')} to {tok('gap.2xl')}. The edge of a unit to its contents is {tok('gap.inset')}. Between sections of a page use {tok('gap.section')}, and between page regions {tok('gap.page')}.</p>
      </Section>
      <Section id="space-stacking" title="Stacking">
        <p>Vertical space between blocks is the gap of the Stack that holds them. Children carry no margins of their own. A column of units uses <code>gap="lg"</code>, which is {tok('stack.gap-lg')}, and the controls inside a unit use the default {tok('stack.gap-md')}.</p>
      </Section>
      <Section id="space-relationships" title="Grouping by distance">
        <p>Things that belong together sit close. A label is {tok('gap.md')} from its knob, while two separate controls are at least {tok('gap.2xl')} apart. The model name and wordmark sit on the bottom inset line, apart from the controls, because they belong to the case.</p>
      </Section>
      <Section id="space-hierarchy" title="Hierarchy through space">
        <p>The loud control gets the largest clear area in the unit. The display sits at the top with the full inset around it. Secondary keys are packed tighter in a row. The reader finds the knob first because it has the most room.</p>
      </Section>
      <Section id="space-white" title="Empty space">
        <p>An appliance face has bare plastic, and dial keeps it. A unit shows a few readings and leaves the rest of its body empty. Units on a page are separated by the grid gutter, so each reads as its own object.</p>
      </Section>
      <Section id="space-optical" title="Optical adjustment">
        <p>Round parts look smaller than square ones of the same size, so knobs keep their full hit area even when the drawn disc is smaller. Window and well corners nest by subtracting the inset from the body's radius. That keeps the gap around a window even all the way round.</p>
      </Section>
      <Section id="space-safe" title="Safe areas">
        <p>dial has no safe-area tokens. The page margin is {tok('container.margin')} on a phone. In an app that draws under a notch or the home bar, add <code>env(safe-area-inset-*)</code> to the Container padding. Units inside never need to know about it.</p>
      </Section>
    </>
  );
}

function MotionExtras() {
  return (
    <>
      <Section id="motion-principles" title="How dial moves">
        <p>Motion is mechanical. A key goes down at once and comes back on a spring. A knob or fader settles into the nearest detent. Nothing enters with a show and nothing moves while idle, because an appliance on the shelf is still.</p>
        <p>Only a change of state moves anything.</p>
      </Section>
      <Section id="motion-duration" title="Durations">
        <p>A press lands in {tok('motion.press')}. The release runs {tok('motion.release')}, the time the spring takes to settle. Hover changes ink in {tok('motion.hover')}. A sheet enters in {tok('motion.enter')} and leaves in {tok('motion.exit')}. A display segment fades in {tok('motion.segment')}, and stagger is {tok('motion.stagger')}.</p>
      </Section>
      <Section id="motion-easing" title="Easing">
        <p>Entering uses {tok('motion.easing')}, which slows into place. Leaving uses {tok('motion.easing-exit')}, which speeds away, since nobody watches what leaves. The spring itself has mass {tok('mechanism.mass')}, stiffness {tok('mechanism.stiffness')} and damping {tok('mechanism.damping')}, which settles with almost no overshoot.</p>
      </Section>
      <Section id="motion-properties" title="What moves">
        <p>A key moves down by {tok('motion.press-travel')} and its shadow collapses. Press scale is {tok('motion.press-scale')}, so nothing shrinks. Hover lift is {tok('motion.lift')}, so nothing rises. A knob turns and a fader cap slides. A sheet moves {tok('motion.rise')} as it enters. Colour changes only on hover.</p>
      </Section>
      <Section id="motion-feedback" title="Motion as feedback">
        <p>Every press answers at once, in {tok('motion.press')}, so the reader feels the key take. A knob snaps to one of {tok('mechanism.detents')} detents across {tok('mechanism.sweep')} degrees, and the display shows the new value at the same moment. The value changes at once, while only the part travels.</p>
      </Section>
      <Section id="motion-choreography" title="Across a screen">
        <p>There is no entry choreography. Units appear in place when a screen opens, and the stagger token is {tok('motion.stagger')}. When one unit changes, only that unit moves. A toast or dialog is the one thing that travels, and it travels a short way.</p>
      </Section>
      <Section id="motion-a11y" title="Reduced motion">
        <p>Under Reduce motion the token stylesheet sets every duration to zero. Fourteen components also carry their own <code>prefers-reduced-motion</code> rule. Springs do not overshoot, detents change at once and grille levels fill without a sweep. A state still changes, so nothing is lost.</p>
      </Section>
      <Section id="motion-evaluation" title="Checking a movement">
        <ul>
          <li>It answers a state change the reader made or needs to see.</li>
          <li>The part moves the way the real mechanism would.</li>
          <li>A press lands in {tok('motion.press')} or less.</li>
          <li>With Reduce motion on, the new state still shows at once.</li>
          <li>Once the state has settled, the screen is still.</li>
        </ul>
      </Section>
    </>
  );
}

function IconsExtras() {
  return (
    <>
      <Section id="icon-principles" title="When to use an icon">
        <p>A printed word comes first. An icon is used only where a word will not fit, as on a small key, and only for a meaning everyone knows, such as close, add or search. Every icon key also carries an accessible name. The glyphs come from the <code>Icon</code> component in <code>dial-react</code>.</p>
      </Section>
      <Section id="icon-sizing" title="Sizes">
        <p>Icons come in three sizes. Small is {tok('control.icon-sm')} and sits inline with text. Medium is {tok('control.icon-md')} and goes on a key or at the start of a list row. Large adds one module step, {tok('space.1')}, to medium for a large key. Each size draws the same 7 by 7 field of dots.</p>
      </Section>
      <Section id="icon-targets" title="Targets around icons">
        <p>An icon is never the target. It sits on a key that keeps a {tok('layout.touch')} hit area, so a {tok('control.icon-sm')} icon is still easy to press with a thumb. IconButton requires a label, which becomes its accessible name, and the glyph inside it stays hidden.</p>
      </Section>
      <Section id="icon-color" title="Icon colour">
        <p>Icons use <code>currentColor</code>, so they take the ink of the key they sit on. They are never orange on their own. On the orange control the icon is {tok('text.on-accent')}, the same as its printing.</p>
      </Section>
      <Section id="icon-alignment" title="Icons beside text">
        <p>An icon next to a word is centred on the line box and set {tok('gap.sm')} from it. Use the small size beside body or caption text, so a label and its icon read as one piece of printing.</p>
      </Section>
      <Section id="icon-style" title="Style">
        <p>Every glyph is a pattern of round dots on a 7 by 7 field, the same holes the Grille uses for a level. A dot is two thirds of the pitch, the Grille’s ratio of an 8px hole on a 12px pitch. At the small size the dots grow to four fifths of the pitch, so every dot holds 3:1 against the plastic on a 1x screen. Glyphs are flat printing, with no recess, shadow or motion.</p>
        <p>The status glyphs keep the lamp shapes of Badge. Warning is a triangle, critical a square, info a diamond and positive a dot, and each prints its sign as missing dots. Four drawing systems were measured in <code>apps/lab/icon</code>. The 9 by 9 field lost its dots at 16px, and a hairline stroke shared nothing with the Grille, so the set has one dot weight and no stroke version.</p>
      </Section>
      <Section id="icon-standard" title="The standard icons">
        <p>The set covers transport (play, pause, previous, next, stop, volume, mute), devices (power, lamp, heat, cool, fan, washer, speaker, plug), the home (lock and the open lock, door, window, home, room), actions (plus, minus, close, check, edit, remove, share, refresh, search, more, drag, settings), the four chevrons, time (clock, schedule), signal (wifi, signal, battery) and status (warning, critical, info, positive). Anything outside the set is a word on a key until it is drawn.</p>
      </Section>
      <Section id="icon-contribute" title="Adding an icon">
        <p>Draw the glyph as seven rows of seven cells in <code>packages/react/src/components/Icon/glyphs.ts</code>, with a dot for each mark, and add its name to <code>IconName</code>. Check it at 16px in light and dark in the lab, then show it on a key with a label. If a word fits, use the word instead.</p>
      </Section>
    </>
  );
}

function ThemesExtras() {
  return (
    <>
      <Section id="theme-basics" title="What a theme is">
        <p>A theme is a second value for some semantic tokens. Components read only roles, so a theme changes the roles and every component follows. dial has two themes, which are two editions of the same object. They share one material, one light and one orange.</p>
      </Section>
      <Section id="theme-default" title="The default theme">
        <p>Light is the base, in warm-white ABS. Its page is {tok('surface.page')} and its bodies are {tok('surface.solid')}. With no <code>data-theme</code> attribute anywhere, the page follows the reader's system setting.</p>
      </Section>
      <Section id="theme-customising" title="Changing a theme">
        <p>Override semantic tokens under a theme selector, for example <code>surface.solid</code> or <code>action.accent</code>. Keep text at 4.5:1 against every surface it sits on, and keep only one accent. Changing a primitive changes every role that points at it.</p>
      </Section>
      <Section id="theme-dark" title="Dark colours">
        <p>Dark is the charcoal edition. The page is {dark('surface.page')}, bodies are {dark('surface.solid')} and wells are {dark('surface.sunken')}. Shadows get darker so a raised part still reads, and the lit hairline is fainter. Nothing glows except the displays and the status lamp.</p>
      </Section>
      <Section id="theme-images" title="Icons and windows in dark">
        <p>Icons use <code>currentColor</code>, so they switch with the printing. The LCD window darkens to {dark('display.lcd-bg')} so it does not shine out of the charcoal. The OLED window stays near-black in both themes, since it is a screen.</p>
      </Section>
      <Section id="theme-text" title="Text in dark">
        <p>Printing becomes {dark('text.primary')} and {dark('text.secondary')}. Every pair is measured again in dark on the built pages and holds 4.5:1. Weight stays the same in both themes.</p>
      </Section>
      <Section id="theme-applied" title="A device card in both editions">
        <p>A DeviceCard in light is a warm-white body with a grey-green LCD and an orange knob. In dark the body is charcoal, the LCD is darker and the knob is the same orange with a deeper rim. The layout, the sizes and the shadow direction do not change.</p>
      </Section>
    </>
  );
}

function ShapeExtras() {
  return (
    <>
      <Section id="shape-scale" title="The radius scale">
        <p>A unit's corner is {tok('corner.unit-ratio')} of its short side, capped at {tok('corner.panel')} so a large panel does not swell. Inner windows use {tok('corner.inner')} or the nested value. Wells and caps are {tok('corner.media')}, marks {tok('corner.mark')}, checkboxes {tok('corner.check')}, and round keys are fully round.</p>
      </Section>
      <Section id="shape-usage" title="Which radius where">
        <p>The radius follows the size of the part. Card measures its own short side and sets its corner from the ratio. Anything inside nests, with the inner radius equal to the outer radius minus the inset. It never drops below {tok('corner.mark')}. Keys and knobs are discs or capsules.</p>
      </Section>
      <Section id="shape-focus" title="The focus ring's radius">
        <p>Focus is an outline of {tok('focus-ring.width')}, set {tok('width.ring')} outside the part. The browser draws the outline along the part's own corner, so a round key gets a round ring and a well gets a rounded rectangle.</p>
      </Section>
      <Section id="shape-elevation" title="Kinds of height">
        <p>There are four. A well or window is recessed, with shade on its top-left inner edge. A unit body is raised by {tok('material.unit-height')}. A part such as a key is raised by {tok('material.height')}. A dialog or toast floats, with the longest shadow in the system.</p>
      </Section>
      <Section id="shape-pairings" title="Surfaces and shadows">
        <p>Each height has one surface. The page has no shadow. A body uses <code>elevation.unit</code> on {tok('surface.solid')}. A key uses <code>elevation.part</code>, and a well uses <code>elevation.well</code> on {tok('surface.sunken')}. A sheet uses <code>elevation.float</code>. Every shadow falls down and to the right, from one light at the top left.</p>
      </Section>
      <Section id="shape-dark" title="Height in dark">
        <p>The shadows keep their offsets and get darker, so charcoal parts still stand off the page. The lit edge drops to {dark('material.lit')}. Height is never shown with a lighter fill.</p>
      </Section>
      <Section id="shape-interaction" title="Height when pressed">
        <p>Hover does not lift anything. Hover lift is {tok('motion.lift')}. A press drops the part {tok('motion.press-travel')} in {tok('motion.press')} and its shadow collapses under it. It comes back on the spring. A disabled part loses its height and lies flat. dial has no dragged state yet.</p>
      </Section>
      <Section id="shape-z" title="Stacking order">
        <p>Few layers. Content is at {tok('layer.base')} and raised parts at {tok('layer.raised')}. Sticky bars are {tok('layer.sticky')}, overlays {tok('layer.overlay')} and toasts {tok('layer.toast')}. A unit never rises above another unit.</p>
      </Section>
      <Section id="shape-contrast" title="Contrast on raised parts">
        <p>A raised part and the page are close in colour, so edges carry the shape. Control edges aim for 3:1 against the body, and the orange rim is {tok('action.accent-rim')}. Text on every surface is measured at 4.5:1 in both themes.</p>
      </Section>
    </>
  );
}

function DimensionsExtras() {
  return (
    <>
      <Section id="dim-hierarchy" title="Size and hierarchy">
        <p>The loud control is the largest part. A knob takes {tok('unit.knob-ratio')} of the unit's short side, while secondary keys are {tok('size.key')} discs. The display gets the full width at the top. A reader sees the knob and the reading before anything else.</p>
      </Section>
      <Section id="dim-safe" title="Guides and safe areas">
        <p>A unit's guides are its inset lines, {tok('gap.inset')} in from each edge. Labels, the wordmark and the model name sit on them. On the page, the Container margin is the guide, {tok('container.margin')} on a phone.</p>
      </Section>
      <Section id="dim-density" title="Density">
        <p>dial has one density. A unit shows a few readings and keeps every target at {tok('layout.touch')}, so there is no compact mode that would shrink keys. A screen gets denser by placing more units side by side as the grid gains columns.</p>
      </Section>
    </>
  );
}

function GridExtras() {
  return (
    <>
      <Section id="grid-scope" title="What the grid governs">
        <p>The grid places units on a page. It decides how many units sit side by side and how far apart they are. It does not reach inside a unit. A unit's display, grille and controls are laid out by its own inset and spacing tokens, and keep their places at every width.</p>
        <p>Dialogs and toasts float above the grid.</p>
      </Section>
      <Section id="grid-unit" title="The base unit">
        <p>The grid shares the {tok('space.1')} step with spacing. Gutters and margins are multiples of it, {tok('grid.gutter')} and {tok('grid.margin')} on a phone. So a unit's edge, its inset and the gap to the next unit land on the same lines.</p>
      </Section>
      <Section id="grid-basis" title="What the breakpoints follow">
        <p>Breakpoints follow the viewport, at {tok('breakpoint.md')} and {tok('breakpoint.lg')}. Design for the phone first, with {tok('grid.columns')} columns, then add columns. Most people use dial on a phone at home.</p>
      </Section>
      <Section id="grid-columns" title="Column width">
        <p>Columns are equal shares of the space inside the margins. Grid uses <code>repeat(columns, minmax(0, 1fr))</code>, so a column is never a fixed width and a long word cannot push one wider than the rest.</p>
      </Section>
      <Section id="grid-types" title="Fluid and fixed">
        <p>The page grid is fluid between breakpoints. Container caps it at a maximum width, so the result is a hybrid. Units inside are fluid in width and keep their own proportions, with the corner read from their own short side.</p>
      </Section>
      <Section id="grid-max" title="Maximum widths">
        <p>Container sizes are sm {tok('container.max-sm')}, md {tok('container.max-md')}, lg {tok('container.max-lg')}, xl {tok('container.max-xl')} (the default) and 2xl {tok('container.max-2xl')}. Use xl for a room of devices. Use sm for a settings page that is mostly reading.</p>
      </Section>
      <Section id="grid-gutters" title="Gutters">
        <p>The gutter is {bp('layout.gutter', 'base')} on a phone, {bp('layout.gutter', 'md')} from {tok('breakpoint.md')} and {bp('layout.gutter', 'lg')} from {tok('breakpoint.lg')}. It is the bare plastic between two units, so nothing is ever placed in it. dial has no gutterless grid. Two units that touched would read as one object.</p>
      </Section>
      <Section id="grid-margins" title="Margins">
        <p>The outer margin is {bp('layout.margin', 'base')}, {bp('layout.margin', 'md')} and {bp('layout.margin', 'lg')} at the three breakpoints. Container adds it as padding. Leave columns empty only for layout reasons. Margins come from Container, so a page never fakes them with spare columns.</p>
      </Section>
      <Section id="grid-padding" title="Padding inside a unit">
        <p>Every unit pads its contents by {tok('gap.inset')}. Labels, the display window and the bottom printing all align to that inset line. Text inside a unit lines up with the inset, and the grid column edge has no say there.</p>
      </Section>
      <Section id="grid-aligns" title="What aligns to the grid">
        <p>Units and page regions align to columns. Everything inside a unit uses spacing tokens instead. That covers keys, knobs, icons, labels and the display. A key is never stretched to fill a column, because a real key has its own size.</p>
      </Section>
      <Section id="grid-nested" title="Nested grids">
        <p>A region can hold its own Grid with a fixed count, for example <code>{'<Grid columns={2}>'}</code> for two lamps side by side inside a room panel. Keep nested grids to page regions. A single unit does not get a grid inside it.</p>
      </Section>
      <Section id="grid-behaviours" title="How a screen grows">
        <p>When the screen gets wider, dial shows more units before it makes units bigger. A unit spans the full {tok('grid.columns')} columns on a phone, half of {bp('layout.columns', 'md')} on a tablet and a third or quarter of {bp('layout.columns', 'lg')} on a desktop. The unit's face stays the same.</p>
      </Section>
      <Section id="grid-ui" title="Regions and how they scale">
        <p>A header spans the full width and keeps its height. A side list of rooms is {tok('layout.sidebar')} wide and belongs on screens from {tok('breakpoint.lg')}. On a phone it moves to the top. The device area takes the rest and fills with units. Tables are not part of dial yet.</p>
      </Section>
      <Section id="grid-regions" title="Screen regions">
        <p>A typical dial screen has three regions. A header names the home or room. An optional side list switches rooms. The device area is the grid of units. Panels that float, such as a dialog, sit above all three at the overlay layer.</p>
      </Section>
      <Section id="grid-keylines" title="Key lines">
        <p>Inside a unit, the inset is the key line, so labels, the display and the model name share one left edge. Across units in a row, the tops line up and so do the displays. Keep the bodies in one row the same height.</p>
      </Section>
      <Section id="grid-density" title="Density and the grid">
        <p>Gutters and margins do not change with density, since dial has one density. They change only with the breakpoint. A busy home gets more units on the screen as columns are added. Each unit keeps the same targets and spacing.</p>
      </Section>
      <Section id="grid-sizing" title="Sizes of fixed parts">
        <p>Fixed parts inside a unit use the size tokens. Keys are {tok('size.key')}, the switch is {tok('size.switch')} long, fader caps are {tok('size.cap-w')} by {tok('size.cap-h')} and lamps are {tok('size.lamp')}. The unit around them is fluid. Its corner and inset follow its short side.</p>
      </Section>
      <Section id="grid-rhythm" title="Vertical rhythm">
        <p>Rows of units are {tok('grid.gutter')} apart on a phone, the same as the gutter, so the space between units is even in both directions. Page sections are {tok('gap.section')} apart and page regions {tok('gap.page')}.</p>
      </Section>
      <Section id="grid-components" title="Components in the grid">
        <p>Card and DeviceCard fill the span they are given and set their corner from their own size. Controls inside them keep fixed sizes. Text wraps to the unit's width. A GridItem span is clamped to the column count, so a six-column item does not overflow a phone grid.</p>
      </Section>
      <Section id="grid-dodont" title="Do and don't">
        <DoDont items={[
          { do: 'Leave the gutter as bare plastic between two units.', dont: 'Run a unit or a label into the gutter so two units touch.' },
          { do: 'Let Container add the page margin at each breakpoint.', dont: 'Leave the first and last columns empty to fake a margin.' },
          { do: 'Lay out the inside of a unit with its inset and spacing tokens.', dont: 'Stretch a key or a knob to the width of a column.' },
        ]} />
      </Section>
      <Section id="grid-reading" title="Further reading">
        <ul>
          <li><a href="https://www.vitsoe.com/gb/about/good-design">Dieter Rams, ten principles for good design</a>, the source of dial's principles.</li>
          <li>Josef Müller-Brockmann, <i>Grid Systems in Graphic Design</i>, on columns, margins and modules.</li>
          <li><a href="https://carbondesignsystem.com/elements/2x-grid/overview/">Carbon's 2x grid</a>, a fuller account of fluid and fixed boxes.</li>
        </ul>
      </Section>
    </>
  );
}

export const EXTRAS: Record<string, () => ReactElement> = {
  '/foundations/color': ColorExtras,
  '/foundations/typography': TypographyExtras,
  '/foundations/spacing': SpacingExtras,
  '/foundations/motion': MotionExtras,
  '/foundations/icons': IconsExtras,
  '/foundations/themes': ThemesExtras,
  '/foundations/shape': ShapeExtras,
  '/foundations/dimensions': DimensionsExtras,
  '/foundations/grid': GridExtras,
};
