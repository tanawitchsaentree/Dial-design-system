// Getting started guides and the Content and Accessibility foundations. Developing and Contributing
// are kiln's (true for every system built with it); Designing, Migrating, Content and Accessibility are
// the system's own, checked against packages/react on 2026-11-01.
import type { ReactElement } from 'react';
import { FocusPlayground, LabelPlayground } from '../book/playgrounds';
import { Code, Link, Page, Section, TOKENS } from '../book/kit';
import { NAME, PACKAGES } from './content';
import meta from '../book/meta.json';

const tok = (p: string) => String(TOKENS[p]?.value ?? '—');

function Designing() {
  return (
    <Page eyebrow="Getting started" title={`Designing with ${NAME}`} lede={<p>A dial screen is a shelf of small appliances. Each unit runs one thing in the home, and the reader should know its state at a glance.</p>}>
      <Section id="unit" title="Start from one unit">
        <p>Pick the device and the one thing a person does with it most. That is the unit's loud control, and it is the only orange part. Put the state in the display at the top. Add secondary keys only if people use them weekly.</p>
        <p>Use DeviceCard for a device with a display and a knob, and Card for anything else.</p>
      </Section>
      <Section id="screen" title="Lay out the screen">
        <p>Place units on the page grid. A unit spans all {tok('layout.columns')} columns on a phone. On wider screens show more units side by side before making any of them larger. Keep each unit's parts in the same place in every state, so nothing jumps when the washer finishes.</p>
        <p>Use Container for the page width and margin, Grid for units and Stack inside a unit.</p>
      </Section>
      <Section id="hierarchy" title="What decides hierarchy">
        <p>Size and position decide it. Colour and weight stay out of it. The loud control is the largest part with the most clear space around it. The display is read first because it sits at the top. Labels sit on the inset line beside their control, and the wordmark and model name sit at the bottom like printing on a case.</p>
      </Section>
      <Section id="checklist" title="Before hand-off">
        <ul>
          <li>Each unit has one orange control and one display.</li>
          <li>Every control has a printed label, a value where it has one and a {tok('layout.touch')} target.</li>
          <li>Status is a lamp with a word beside it, never colour alone.</li>
          <li>The screen works in light and dark.</li>
          <li>Nothing moves while the screen is idle.</li>
          <li>All values come from tokens, so the design matches the code.</li>
        </ul>
      </Section>
    </Page>
  );
}

function Migrating() {
  return (
    <Page eyebrow="Getting started" title="Migrating" lede={<p>dial is at {meta.version}. There is no earlier release to move from, so this page is mostly about coming from another system.</p>}>
      <Section id="versions" title="Between versions">
        <p>No version has been released yet. When one is, each change will be listed per component in the change history, with what to edit. Until 1.0 a minor version may change a component's props.</p>
      </Section>
      <Section id="from-other" title="From another system">
        <p>Move one screen at a time. Wrap the screen in dial's stylesheet and theme attribute, then replace each card with a Card or DeviceCard. Most systems have several button styles. In dial a unit has one orange Button and the rest are keys, so pick the one primary action per unit first.</p>
        <p>Map colours to roles. A primary brand colour usually becomes <code>action.accent</code>, but only for that one control. Links, borders and selections move to ink.</p>
      </Section>
      <Section id="watch" title="What usually needs a second look">
        <ul>
          <li>Hover effects that lift a card. dial does not lift on hover.</li>
          <li>Entry animations on page load. dial has none.</li>
          <li>Inputs with a bordered box. dial's inputs are recessed wells.</li>
          <li>Coloured status text. dial prints a lamp and a word.</li>
        </ul>
      </Section>
    </Page>
  );
}

function ContentFoundation() {
  return (
    <Page eyebrow="Foundations" title="Content" lede={<p>Words in dial are printing on an appliance. They are short, plain and true, and they say what the device is doing.</p>}>
      <Section id="audience" title="Who reads it">
        <p>People at home, often with one hand busy. They are not experts and they glance for a few seconds. Use the words they use for their own things, such as heating, lamp, washer or speaker. Avoid model codes and protocol names unless they need them to fix something.</p>
      </Section>
      <Section id="voice" title="Voice">
        <p>dial sounds like a well-made appliance. It is calm and plain, and it is honest about what it knows. It names the state and the action and then stops. It does not cheer, apologise or joke. The same voice holds on every screen.</p>
      </Section>
      <Section id="tone" title="Tone by situation">
        <p>Normal states are as short as a display can hold, such as 21.5° or Done. When something needs attention, say what happened and what to do, in two short sentences. A fault gets the same calm voice with more detail. Nothing is written in capitals for urgency.</p>
      </Section>
      <Section id="clarity" title="Clear and short">
        <p>One idea per sentence. Put the state or the number first. Cut words a person would skip, like "please", "currently" or "successfully". A display value is a number and a unit. A label is one or two words.</p>
      </Section>
      <Section id="inclusive" title="Plain and inclusive">
        <p>Write for everyone in the house, including children and guests. Use common words and spell things out. Avoid idioms that do not translate. Refer to people as "you" and name nobody's role, since anyone at home can use the controls.</p>
      </Section>
      <Section id="labels" title="Labels"><LabelPlayground /></Section>
      <Section id="label-words" title="Action and navigation labels">
        <p>An action label is a verb and an object when the object is not obvious, such as Start wash or Skip track. Navigation labels are the names of rooms and devices. A key that toggles shows the state it will set, and the printing beside it shows the state now.</p>
      </Section>
      <Section id="capitalisation" title="Capitals">
        <p>Use sentence case for labels, titles and messages. Model names are always lowercase, as on the case. Units keep their own form, so it is kWh and °C. Product names keep their capitals.</p>
      </Section>
      <Section id="consistency" title="Same words every time">
        <p>Pick one word for each thing and keep it. A device is on or off, a timer is set, a cycle is done. Use the same word in the label, the display and any message, so the reader never wonders if two words mean two things.</p>
      </Section>
      <Section id="multistep" title="Guiding through steps">
        <p>Keep set-up to one question per sheet. The title asks it, the keys answer it, and the primary key says what happens next, such as Connect or Save. Show the step count when there are more than two, and let people go back without losing what they entered.</p>
      </Section>
      <Section id="writing-a11y" title="Writing for accessibility">
        <p>Every control has a printed name, and that name is its accessible name. An icon key gets a label that says the action. Displays are read as live regions, so a value should make sense on its own, for example "21.5 degrees". Status always has a word beside its lamp.</p>
      </Section>
    </Page>
  );
}

function AccessibilityFoundation() {
  return (
    <Page eyebrow="Foundations" title="Accessibility" lede={<p>What dial promises to people who use a keyboard, a screen reader, high contrast or reduced motion, and what it does not do yet.</p>}>
      <Section id="a11y-principles" title="Principles">
        <p>A part behaves like the mechanism it draws, and it says what it is. Every control has a keyboard map, a role, a visible label and a value. Contrast is measured on the built pages, never assumed. A gap stays on this page until it is closed.</p>
      </Section>
      <Section id="standards" title="Standards">
        <p>dial aims at WCAG 2.2 level AA. Text holds 4.5:1 and control edges aim for 3:1 against their body. Targets are at least {tok('layout.touch')}. Every component's keyboard and role checks run in Chromium on each verify.</p>
      </Section>
      <Section id="vision" title="Blind and low-vision readers">
        <p>Displays are live regions, so a screen reader hears a new value without moving focus. Grilles that show a level expose it as a meter with a value. Every control has a role such as slider, switch or radio. Status never relies on colour, since a lamp always has a word. Under forced colours, nineteen components keep visible edges.</p>
      </Section>
      <Section id="hearing" title="Deaf and hard-of-hearing readers">
        <p>dial plays no sounds. Every alert is shown on screen, in the display or as a toast. A toast stays at least five seconds, and one that must be read can stay until it is closed. A device that beeps in the room, such as a washer at the end of a cycle, should also show that state in its unit.</p>
      </Section>
      <Section id="mobility" title="Limited mobility">
        <p>Every part has a {tok('layout.touch')} hit area, even when it draws smaller. No control needs a drag. Arrows step a knob or fader by one detent, Home and End reach the ends, and Space or Enter press a key. Dialogs trap focus and close with Escape.</p>
      </Section>
      <Section id="cognitive" title="Cognitive load">
        <p>One unit, one job. The state is in one place and the main control is the one orange part. Layouts do not reflow between states and nothing moves while idle. Words are short and the same word always means the same thing.</p>
      </Section>
      <Section id="speech" title="Speech and voice control">
        <p>Printed labels are the accessible names, so a voice control user can say the word they see to press a key. Icon keys need a label with the word a person would say. dial does not take voice input itself.</p>
      </Section>
      <Section id="focus" title="Focus"><FocusPlayground /></Section>
      <Section id="a11y-tools" title="Tools and testing">
        <p>Contrast is measured pixel by pixel with Playwright and Chromium, on every backdrop, in both themes and in three display modes. Behaviour checks for each component live in <code>system/conformance/</code>. The <Link to="/accessibility">verification page</Link> shows the last results.</p>
      </Section>
      <Section id="missing" title="Not done yet">
        <ul>
          <li>Type sizes are in pixels, so the browser's default font size setting does not change them. Zoom does.</li>
          <li>Runs with VoiceOver, TalkBack and NVDA are not recorded in this book yet.</li>
          <li>There is no increased-contrast theme.</li>
        </ul>
      </Section>
    </Page>
  );
}

export function Developing() {
  return (
    <Page eyebrow="Getting started" title={`Developing with ${NAME}`} lede={<p>The set-up details the install steps leave out, covering TypeScript, themes and server rendering.</p>}>
      <Section id="css" title="Load the styles once">
        <p>Import one stylesheet once, at the root of the app. It holds the tokens and every component’s styles. It ships a type declaration, so <code>tsc</code> passes on TypeScript 6 and later, which check side-effect imports by default.</p>
        <Code label="main.tsx">{`import '${PACKAGES.react}/all.css';`}</Code>
      </Section>
      <Section id="theme" title="Themes">
        <p>Set <code>data-theme="dark"</code> or <code>data-theme="light"</code> on the root element. Every token switches with it. A subtree can set its own theme the same way. Follow the reader’s system setting by default and store their choice.</p>
        <Code label="theme">{"document.documentElement.dataset.theme =\n  matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';"}</Code>
      </Section>
      <Section id="ssr" title="Server rendering">
        <p>Every component renders on the server. The smoke test server-renders the components listed in system/kiln.config.json from the packed tarball on every verify run. Set the theme attribute in the HTML you send, so the first frame already has the right colours.</p>
      </Section>
      <Section id="versions" title="Versions">
        <p>The packages are at {meta.version}. Until 1.0 a minor version can change component APIs, and the change history lists every change per component. Every verify run tests React 18.</p>
      </Section>
    </Page>
  );
}

export function Contributing() {
  return (
    <Page eyebrow="Getting started" title="Contributing" lede={<p>How a component gets into the system, in the order the tooling enforces. Concept first, then derivation, a pick, the code, the docs and the gates.</p>}>
      <Section id="order" title="The order">
        <ol>
          <li>Read <code>system/CONCEPT.md</code>. Every form in this system comes from its principles.</li>
          <li>Write <code>&lt;Name&gt;.why.json</code> first. Name the pattern-library default it must not become, cite a reference from the system’s lineage, and derive the form in at least three steps that quote the principles word for word.</li>
          <li>Render three variants in <code>apps/lab/&lt;name&gt;/</code>, all with the same content. The pick is recorded in the component’s why.json and in <code>system/REVIEW.md</code> for the milestone review.</li>
          <li>Only then write the CSS and TSX. The derivation guard blocks those files until the pick is recorded.</li>
          <li>Write the docs pages the same day, with a depth file for the Usage tab, examples for the Code tab and a subject for the Style tab.</li>
          <li>Run <code>pnpm run verify</code>. It must be green.</li>
        </ol>
      </Section>
      <Section id="rules" title="Rules the build enforces">
        <ul>
          <li>Component CSS holds no raw values. Every colour, size and duration is a token, checked by <code>tooling/no-hardcode-lint.mjs</code>.</li>
          <li>Every token and every part, state and motion of a component has a reason tied to a principle, checked by <code>tooling/kiln/rationale.mjs</code>.</li>
          <li>Text is measured per pixel on every backdrop, in every theme and three display modes, checked by <code>tooling/kiln/evidence.mjs</code>.</li>
          <li>Keyboard, roles and measured values are tested in Chromium by <code>tooling/kiln/conformance.mjs</code>, which runs each component’s checks from <code>system/conformance/</code> and fails a component that has none.</li>
          <li>Every page’s prose passes the human-tone lint, checked by <code>tooling/kiln/tone-gate.mjs</code>.</li>
        </ul>
      </Section>
      <Section id="machine" title="Keeping the machine usable">
        <p>Use <code>pnpm run verify:quick</code> while working. The full verify measures both themes and takes the better part of an hour, so run it before a commit that changes how things look.</p>
      </Section>
    </Page>
  );
}


// The direction the user set at intake (system/INTAKE.md, summarised in BRIEF) and the anchor they picked (D-001).
const VECTOR: Array<[string, number, string]> = [
  ['Chroma', 3, 'One orange, spent on one control per unit; everything else is plastic and ink.'],
  ['Type', 1, 'One grotesk, two weights. Size and position do the work.'],
  ['Grid', 2, 'One module and fixed positions, like the face of an appliance.'],
  ['Surface', 8, 'The loud axis. One matte plastic lit from the top left, grilles, display windows and real mechanisms.'],
  ['Motion', 3, 'Presses, springs and detents. Nothing moves while idle.'],
  ['Density', 4, 'A few readings per unit, many units per screen.'],
];
const BRIEF: Array<[string, string]> = [
  ['Name', 'dial, with the packages dial-tokens and dial-react.'],
  ['For', 'A control app for home devices and media, on the web and on phones, used by everyday people at home.'],
  ['App type', 'Home devices. Later waves add media parts such as a player, progress and lists.'],
  ['References', 'A sheet of Rams-era white appliances leads. The image is not in the repo yet, so values are estimated.'],
  ['Lineage', 'Braun and Ulm school industrial design. Rams’ ten principles are the source of the principles.'],
  ['Must never become', 'A retro costume, the Braun name or logo, orange spread across the screen, light grey on light grey or a bloated round toy.'],
  ['Themes', 'Light and dark. Light is the base in warm-white plastic and dark is charcoal.'],
  ['Backdrops', 'Plain flat surfaces with no imagery.'],
  ['Targets', 'React, Tailwind, Figma and SwiftUI tokens, with colours written as hex.'],
  ['Budget', 'Standard.'],
  ['Anchor', 'Device card A, picked by the user.'],
];
function Direction() {
  return (
    <Page eyebrow="Introduction" title="Direction" lede={<p>Where dial comes from, how loud each axis is and what the brief asked for.</p>}>
      <Section id="anchor" title="The anchor">
        <p>The anchor is device card A. It has a full-width LCD at the top, a large orange knob and shallow shadows. The wordmark sits bottom left and the model name bottom right. Every component since then is measured against it.</p>
        <p>Its colours and sizes are estimated from the reference seen in chat. They will be measured again from <code>system/refs/ref-01.png</code> once that file is in the repo.</p>
      </Section>
      <Section id="lineage" title="Lineage">
        <p>dial borrows from Braun and Ulm school industrial design, from Dieter Rams and his “Weniger, aber besser”. His ten principles are the source of the system's principles. A home control app has the problem those appliances solved. Someone glances at it, reads the state and finds the one control that matters, and nothing decorative gets in the way.</p>
        <p>dial uses its own wordmark. It never uses the Braun name or logo.</p>
      </Section>
      <Section id="vector" title="Intensity vector">
        <table className="token-table"><thead><tr><th scope="col">Axis</th><th scope="col">Score</th><th scope="col">What it spends</th></tr></thead>
          <tbody>{VECTOR.map(([a, n, w]) => <tr key={a}><th scope="row">{a}</th><td>{n}</td><td>{w}</td></tr>)}</tbody></table>
        <p>Surface is loud at 8, and type at 1 and grid at 2 pay for it.</p>
      </Section>
      <Section id="intake" title="The brief">
        <p>The answers given at the start, in short.</p>
        <table className="token-table"><thead><tr><th scope="col">Question</th><th scope="col">Answer</th></tr></thead>
          <tbody>{BRIEF.map(([q, a]) => <tr key={q}><th scope="row">{q}</th><td>{a}</td></tr>)}</tbody></table>
      </Section>
    </Page>
  );
}

export const GUIDES: Record<string, () => ReactElement> = {
  '/direction': Direction,
  '/getting-started/designing': Designing,
  '/getting-started/developing': Developing,
  '/getting-started/contributing': Contributing,
  '/getting-started/migrating': Migrating,
  '/foundations/content': ContentFoundation,
  '/foundations/accessibility': AccessibilityFoundation,
};
