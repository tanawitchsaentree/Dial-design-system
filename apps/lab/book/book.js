// Shared content and parts for the book-shell lab (apps/lab/book/). Each variant page lays the same
// content out its own way: ?page=home or ?page=display, ?theme=dark. Real tokens come from
// packages/tokens/build/css/tokens.css; the Display window is drawn with the lab's segment renderer.
const Q = new URLSearchParams(location.search);
document.documentElement.dataset.theme = Q.get('theme') === 'dark' ? 'dark' : 'light';
export const PAGE = Q.get('page') === 'home' ? 'home' : 'display';

const SEGS = { '0': 'abcdef', '1': 'bc', '2': 'abged', '3': 'abgcd', '4': 'fgbc', '5': 'afgcd', '6': 'afgedc', '7': 'abc', '8': 'abcdefg', '9': 'abcdfg', '-': 'g', ' ': '' };
function cell(ch, x, w, h, t, dp) {
  const on = SEGS[ch] ?? '', m = h / 2, s = t / 2;
  const H = (y) => `${x + s},${y} ${x + t},${y - s} ${x + w - t},${y - s} ${x + w - s},${y} ${x + w - t},${y + s} ${x + t},${y + s}`;
  const V = (xx, y0, y1) => `${xx},${y0 + s} ${xx + s},${y0 + t} ${xx + s},${y1 - t} ${xx},${y1 - s} ${xx - s},${y1 - t} ${xx - s},${y0 + t}`;
  const P = { a: H(s), g: H(m), d: H(h - s), f: V(x + s, s, m), b: V(x + w - s, s, m), e: V(x + s, m, h - s), c: V(x + w - s, m, h - s) };
  return Object.entries(P).map(([k, p]) => `<polygon class="${on.includes(k) ? 'on' : 'off'}" points="${p}"/>`).join('') + `<rect class="${dp ? 'on' : 'off'}" x="${x + w + 2}" y="${h - t}" width="${t}" height="${t}"/>`;
}
export function seg(str, cells = 3, h = 40) {
  const chars = []; for (const ch of str) { if (ch === '.' && chars.length) chars[chars.length - 1].dp = true; else chars.push({ ch, dp: false }); }
  while (chars.length < cells) chars.unshift({ ch: ' ', dp: false });
  const w = 20, t = 4.4, pitch = 32; let out = '';
  chars.forEach((c, i) => { out += cell(c.ch, 2 + i * pitch, w, 40, t, c.dp); });
  return `<svg class="seg" style="block-size:${h}px" aria-hidden="true" viewBox="0 0 ${2 + chars.length * pitch} 40">${out}</svg>`;
}
/** The Display component, faithful static markup: a recessed LCD window, detail line, value, unit. */
export const lcd = (v = '21.5', d = 'Heating to 22.0', h = 40) => `<div class="lcd-win" role="status" aria-label="Thermostat ${v} °C. ${d}"><span class="lcd-detail">${d}</span><span class="lcd-val">${seg(v, 3, h)}<span class="lcd-unit">°C</span></span></div>`;
export const key = (word, loud) => `<button type="button" class="key${loud ? ' loud' : ''}">${word}</button>`;

export const NAV = [
  ['introduction', ['Overview', 'Direction', 'Principles']],
  ['getting started', ['Getting started', 'Designing', 'Developing']],
  ['foundations', ['Colour', 'Typography', 'Spacing', 'Grid & layout', 'Shape & elevation', 'Motion']],
  ['components', ['Button', 'Switch', 'Text', 'Display', 'Grille', 'Slider', 'Rotary', 'Tabs', 'Dialog', 'Toast']],
];
export const DISPLAY = {
  eyebrow: 'components · 07', title: 'Display',
  purpose: 'Says what the device is doing now, in a window set into the unit, as LCD segments or OLED text.',
  facts: [['beta', 'status'], ['2026-11-01', 'updated'], ['1.7 kB', 'min+gz'], ['6 checks', 'a11y verified'], ['v0.0.0', 'since']],
  tabs: ['Usage', 'Style', 'Code', 'Accessibility'],
  code: '<Display kind="lcd" size="md" label="Thermostat"\n  value="21.5" unit="°C" detail="Heating to 22.0" />',
  sections: [
    ['Overview', 'Display is the one window of a unit that says what the device is doing now. It shows a number or a few words, such as 21.5 °C or 38 min, and nothing else in the unit repeats it. The window is set into the body, so its shadow falls on the inside edge.'],
    ['When to use it', 'To show the current state of a device, such as a temperature, a time left or a station. At the top of a unit, as the first thing anyone reads. For a reading that changes while the person watches.'],
    ['Variants', 'lcd: numbers that change, dark segments on grey-green. oled: words and numbers together, white text on near-black.'],
    ['Anatomy', 'Window: a recess in the body. Detail line: one short line at caption size. Value: segment cells on a fixed pitch, right-aligned. Unit: printed in the grotesk beside the value.'],
  ],
  anatomy: ['Window', 'Detail line', 'Value', 'Unit'],
};
export const HOME = {
  eyebrow: 'dial · design system', title: 'dial, the face of a home appliance drawn on a screen',
  lede: 'dial is for apps that run the heating, the lamps, the washer and the music at home. Each card behaves like one small appliance, with a warm-white matte body, one display that says the state and one orange control.',
  box: [['dial-tokens', '382 design tokens in three tiers, shipped as CSS, JS with types, SCSS and JSON.'], ['dial-react', '24 components. It carries the tokens, so one install and one import are enough.'], ['this book', 'Foundations, every component in four tabs, patterns, accessibility evidence and the token reference.']],
  numbers: [['167442', 'text checks pass'], ['172', 'conformance checks'], ['382', 'tokens']],
};
