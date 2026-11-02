// Usage tab for BottomNav (component-depth.md U1–U14). BottomNav prints the app's main sections on the case.
import { BottomNav } from 'dial-react';
import type { Depth } from './types';

const g = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const icon = {
  home: <svg {...g}><path d="M4 11l8-7 8 7v9H4z" /><path d="M10 20v-5h4v5" /></svg>,
  rooms: <svg {...g}><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg>,
  media: <svg {...g}><circle cx="12" cy="12" r="8.5" /><path d="M10 8.5l5.5 3.5-5.5 3.5z" /></svg>,
  settings: <svg {...g}><path d="M4 7h10M18 7h2M4 17h2M10 17h10" /><circle cx="16" cy="7" r="2" /><circle cx="8" cy="17" r="2" /></svg>,
};
type Sec = { value: string; label: string };
const make = (list: Sec[]) => list.map((s) => ({ ...s, href: `/${s.value}`, icon: icon[s.value as keyof typeof icon] ?? icon.home }));
const FOUR = make([{ value: 'home', label: 'Home' }, { value: 'rooms', label: 'Rooms' }, { value: 'media', label: 'Media' }, { value: 'settings', label: 'Settings' }]);
const stop = (_v: string, e: React.MouseEvent) => e.preventDefault();
const Phone = ({ children }: { children: React.ReactNode }) => <div style={{ inlineSize: 'min(100%, 375px)' }}>{children}</div>;
const Bar = (p: { items?: ReturnType<typeof make>; current?: string; label?: string }) => <Phone><BottomNav layout="bar" items={p.items ?? FOUR} current={p.current ?? 'rooms'} label={p.label} onNavigate={stop} /></Phone>;

export const BOTTOM_NAV: Depth = {
  overview: (
    <>
      <p>BottomNav holds the three to five main sections of the phone app, such as Home, Rooms, Media and Settings. They are printed along the bottom edge of the screen the way band names are printed under a radio’s dial. Each section has a glyph with its word under it, and the section on screen is set a step heavier with one short ink mark under its word.</p>
      <p>Each section is a link, because pressing it goes to another page of the app. The link to the page on screen carries <code>aria-current="page"</code>, so a screen reader says which section you are in. Nothing in the strip is orange, because orange belongs to the one main control of each unit on the page above it.</p>
      <p>On a screen wider than it is tall the same links are printed down the inline start as a rail, like the index at the side of this book. The glyph sits beside the word there, and the mark stands beside the row.</p>
    </>
  ),
  whenToUse: ['To move between the three to five main sections of a phone app.', 'To show at a glance which section of the app is on screen.', 'To keep the sections in one place on every page, under the thumb.'],
  whenNot: [
    { situation: 'Switching between panels on one page', to: '/components/tabs', label: 'Tabs' },
    { situation: 'Picking one of a few modes for a device', to: '/components/segmented-control', label: 'SegmentedControl' },
    { situation: 'Rare actions for one object', to: '/components/action-sheet', label: 'ActionSheet' },
  ],
  variants: { na: 'BottomNav has no variant prop. Every strip is the same printing; layout only says whether it runs along the bottom or down the side.' },
  anatomy: {
    render: <Bar />,
    parts: [
      { part: 'Strip', selector: '[data-component="BottomNav"]', what: 'A plastic band at unit height along the bottom edge, with room under it for the phone’s home indicator.' },
      { part: 'Link', selector: '[data-component="BottomNav"] a', what: 'One section, a quarter of the strip wide and at least 52px tall.' },
      { part: 'Glyph', selector: '[data-component="BottomNav"] a > span:first-child', what: 'A 20px stroke drawing printed over the word.' },
      { part: 'Word', selector: '[data-component="BottomNav"] a > span:nth-child(2)', what: 'The section name at the label size; the current one is set in medium weight.' },
      { part: 'Mark', selector: '[data-component="BottomNav"] a[aria-current] > span:last-child', what: 'A short ink bar under the current word, the same mark Tabs uses.' },
    ],
  },
  sizes: { na: 'BottomNav has one size. The links share the width of the strip in equal parts.' },
  emphasis: {
    text: <p>The strip is printing, so it never holds the loud part of a screen. Only one section is marked at a time. Mark it with weight and the ink bar, never with a tinted fill or the accent colour.</p>,
    pair: {
      do: <Bar current="rooms" />, doNote: 'One section marked by weight and an ink bar.',
      dont: <Bar current="none" />, dontNote: 'No section marked, so nobody can tell where they are.',
    },
  },
  placement: {
    rows: [
      ['Along the bottom edge on a phone', 'The strip is fixed to the bottom of the screen with fixed, above the home indicator.'],
      ['Down the inline start on a wide screen', 'layout auto prints the rail beside the page when the screen is wider than it is tall.'],
      ['In the flow of a page', 'Leave fixed off to place it in your own shell, as in these examples.'],
    ],
    examples: [{ title: 'The rail beside a page', render: <div style={{ blockSize: 240, display: 'flex' }}><BottomNav layout="rail" items={FOUR} current="media" onNavigate={stop} /></div> }],
  },
  combinations: {
    good: [['BottomNav + Snackbar', 'The snackbar sits just above the strip, so Undo is under the thumb.'], ['BottomNav + Sheet', 'A sheet rises over the strip and the strip stays where it was when it closes.'], ['BottomNav + DeviceCard', 'The Rooms section shows a card per device on the page above the strip.']],
    avoid: [{ title: 'six sections in one strip', why: 'Six words in 375px squeeze each target and shrink the words. Keep three to five and move the rest into Settings.', render: <Bar items={make([{ value: 'home', label: 'Home' }, { value: 'rooms', label: 'Rooms' }, { value: 'media', label: 'Media' }, { value: 'energy', label: 'Energy' }, { value: 'scenes', label: 'Scenes' }, { value: 'settings', label: 'Settings' }])} /> }],
  },
  content: {
    formula: <><p>Each section is one noun the person would say out loud, such as Rooms or Media. Keep words short so all of them fit at the label size, and use the same word as the page’s heading.</p><p>Give every section a glyph. The glyph helps the eye find the section, and the word says what it is, so never ship glyphs alone.</p></>,
    pair: {
      do: <Bar />, doNote: 'Short nouns that match the page headings.',
      dont: <Bar items={make([{ value: 'home', label: 'Overview' }, { value: 'rooms', label: 'Manage' }, { value: 'media', label: 'Play' }, { value: 'settings', label: 'More' }])} current="rooms" />, dontNote: 'Verbs and More say nothing about where you will go.',
    },
    overflow: { text: 'A word too long for its quarter wraps onto a second line inside its own link, and the strip grows with it.', render: <div data-overflow-demo=""><Bar items={make([{ value: 'home', label: 'Home' }, { value: 'rooms', label: 'Rooms and zones' }, { value: 'media', label: 'Media' }, { value: 'settings', label: 'Household settings' }])} /></div> },
    rtl: { text: 'In right-to-left languages the order runs from the right, and the rail stands at the right edge.', render: <div dir="rtl"><Bar items={make([{ value: 'home', label: 'الرئيسية' }, { value: 'rooms', label: 'الغرف' }, { value: 'media', label: 'الوسائط' }, { value: 'settings', label: 'الإعدادات' }])} label="الأقسام" /></div> },
    expansion: { text: 'German runs about 30% longer. Each word keeps its quarter and wraps before it shrinks.', render: <Bar items={make([{ value: 'home', label: 'Startseite' }, { value: 'rooms', label: 'Räume' }, { value: 'media', label: 'Medien' }, { value: 'settings', label: 'Einstellungen' }])} label="Hauptbereiche" /> },
  },
  behaviours: {
    states: [
      ['Default', 'Word and glyph in the secondary ink, regular weight.', 'A link.'],
      ['Hover', 'The ink turns one step darker over 240ms.', 'Nothing moves.'],
      ['Current', 'Medium weight, primary ink and the ink mark under the word.', 'aria-current="page".'],
      ['Focus', 'The focus ring is drawn inside the link’s edge.', 'Keyboard only.'],
    ],
    interactions: [
      ['Keyboard', 'Tab / Shift+Tab', 'Moves from one section link to the next.', 'native links'],
      ['Keyboard', 'Enter', 'Follows the link, or calls onNavigate first.', 'native links'],
      ['Pointer', 'Click', 'Goes to the section.', 'onNavigate'],
      ['Screen reader', 'Landmark', 'Announced as a navigation named Main, with the current page marked.', 'aria-label, aria-current'],
    ],
    loading: <p>The strip never waits for data. Mark the section the app opens on at once, and let the page above it show its own loading state.</p>,
    focus: <p>The strip takes no focus on its own. Tab reaches each link in order; after a section changes, move focus to the new page’s heading, as the book does.</p>,
  },
  deepDive: { na: 'BottomNav has no variant prop, so there is nothing to compare one variant against.' },
  modifiers: [
    {
      name: 'layout',
      rules: <p>Leave it on auto, so a phone held upright gets the strip and a wide screen the rail. Use bar or rail only in a shell that has already decided its own layout.</p>,
      pair: { do: <Bar />, doNote: 'The strip on a phone.', dont: <div style={{ inlineSize: 'min(100%, 375px)', blockSize: 220, display: 'flex' }}><BottomNav layout="rail" items={FOUR} current="rooms" onNavigate={stop} /></div>, dontNote: 'A rail forced on a phone takes most of the width.' },
    },
    {
      name: 'fixed',
      rules: <p>Turn it on in the app shell so the strip stays on the bottom edge with its safe area. Leave it off in a page or a preview, where it would cover the content.</p>,
      pair: { do: <Bar />, doNote: 'Placed by its parent in a preview.', dont: <Bar items={FOUR.slice(0, 1)} current="home" />, dontNote: 'One section alone needs no navigation at all.' },
    },
  ],
  related: [['/components/tabs', 'Tabs', 'Switch panels inside one page instead of pages.'], ['/components/snackbar', 'Snackbar', 'The message that sits above the strip.'], ['/components/segmented-control', 'SegmentedControl', 'Pick a mode instead of a place.']],
  references: [
    { title: 'WAI-ARIA Authoring Practices · Landmark regions, navigation', url: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/', why: 'The nav landmark and its name.' },
    { title: 'WAI-ARIA 1.2 · aria-current', url: 'https://www.w3.org/TR/wai-aria-1.2/#aria-current', why: 'Marking the link to the page on screen.' },
    { title: 'Dieter Rams, ten principles for good design (Vitsœ)', url: 'https://www.vitsoe.com/gb/about/good-design', why: 'The source of dial’s principles.' },
  ],
};
