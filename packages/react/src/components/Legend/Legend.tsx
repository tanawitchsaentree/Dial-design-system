import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { MECHANISM, useIsoLayoutEffect, useSpring } from '../../spring';
import { Rotary, ROTARY_DIAMETER, type RotaryKind, type RotarySize } from '../Rotary/Rotary';
import styles from './Legend.module.css';

export type LegendLayout = 'column' | 'row' | 'arc';
export type LegendControl = 'rotary' | 'none';

/** One printed choice. A plain string is both the value and the printed word. */
export type LegendOption = string | { value: string; label: string };

/** The angle between two neighbouring words on the knob, and the widest sweep it may reach. */
const STEP_DEG = 45;
const MAX_SWEEP = 270;

export interface LegendProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The name of the setting, such as Fan or Programme. It is printed under the knob, or above the words when there is no knob, and it is the accessible name. */
  label: ReactNode;
  /** Every choice the control has, in the order the knob walks them. Keep it to about ten; past that a Select fits better. */
  options: LegendOption[];
  /** The chosen value when controlled. Pair it with `onValueChange`. */
  value?: string;
  /** The starting value when uncontrolled. Default the first option. */
  defaultValue?: string;
  /** Called with the new value when the knob turns to another word or a word is pressed. */
  onValueChange?: (value: string) => void;
  /** `column` (default) prints the words in one fixed column beside the knob, `row` in equal cells under it, `arc` round the dial at each detent's angle. */
  layout?: LegendLayout;
  /** `rotary` (default) draws the knob that walks the legend, and the knob is the one tab stop. `none` prints the words alone as a radio group. `arc` always draws the knob. */
  control?: LegendControl;
  /** The knob's kind. `primary` (default) is the unit's one orange part; `key` is a plastic knob for a second dial. */
  knob?: RotaryKind;
  /** The knob's size, 44, 72 (default) or 108px across. */
  knobSize?: RotarySize;
  /** Nothing can be picked; the knob loses its height and the words fade with it. */
  disabled?: boolean;
}

const norm = (o: LegendOption) => (typeof o === 'string' ? { value: o, label: o } : o);

/** The printed legend of a control: every choice in plain sight, the one in use lit at full ink in medium weight with one ink index mark. */
export const Legend = forwardRef<HTMLDivElement, LegendProps>(function Legend(
  {
    label,
    options,
    value,
    defaultValue,
    onValueChange,
    layout = 'column',
    control = 'rotary',
    knob = 'primary',
    knobSize = 'md',
    disabled = false,
    className,
    style,
    ...rest
  },
  ref,
) {
  const items = options.map(norm);
  const n = items.length;
  const withKnob = control === 'rotary' || layout === 'arc';
  const nameId = useId();
  const listId = useId();
  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => defaultValue ?? items[0]?.value);
  const chosen = controlled ? value : inner;
  const index = Math.max(0, items.findIndex((o) => o.value === chosen));

  const rootRef = useRef<HTMLDivElement | null>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);
  const setRoot = useCallback((el: HTMLDivElement | null) => {
    rootRef.current = el;
    if (typeof ref === 'function') ref(el);
    else if (ref) ref.current = el;
  }, [ref]);

  // one index mark, moved between words on the material spring (an instant jump under reduce motion)
  const mounted = useRef(false);
  const [p0] = useState(index);
  const spring = useSpring((p) => rootRef.current?.style.setProperty('--p', p.toFixed(3)), MECHANISM, p0, 0.002);
  useIsoLayoutEffect(() => {
    spring.to(index, !mounted.current);
    mounted.current = true;
  }, [index]);

  const pick = (i: number) => {
    const next = items[Math.max(0, Math.min(n - 1, i))];
    if (!next || disabled || next.value === chosen) return;
    if (!controlled) setInner(next.value);
    onValueChange?.(next.value);
  };

  const sweep = Math.min(MAX_SWEEP, Math.max(1, n - 1) * STEP_DEG);
  const da = n > 1 ? sweep / (n - 1) : 0;
  const a0 = -sweep / 2;
  const d = ROTARY_DIAMETER[knobSize];

  // the arc's words reach past the dial: measure how far, so the legend's box holds every word in full
  useIsoLayoutEffect(() => {
    if (layout !== 'arc') return;
    const root = rootRef.current;
    const box = wordsRef.current;
    if (!root || !box) return;
    // with no padding the dial's centre is the hub; every word's overhang past the knob becomes padding
    const fit = () => {
      for (const k of ['--pad-top', '--pad-foot', '--pad-side']) root.style.setProperty(k, '0px');
      const knobEl = root.firstElementChild as HTMLElement | null;
      if (!knobEl) return;
      const k = knobEl.getBoundingClientRect();
      let up = 0, down = 0, side = 0;
      for (const w of Array.from(box.querySelectorAll<HTMLElement>('[data-word]'))) {
        const b = w.getBoundingClientRect();
        up = Math.max(up, k.top - b.top);
        down = Math.max(down, b.bottom - k.bottom);
        side = Math.max(side, k.left - b.left, b.right - k.right);
      }
      const px = (v: number) => `${Math.ceil(v)}px`;
      root.style.setProperty('--pad-top', px(up));
      root.style.setProperty('--pad-foot', px(down));
      root.style.setProperty('--pad-side', px(side));
    };
    fit();
    let live = true;
    document.fonts?.ready.then(() => { if (live) fit(); });
    return () => { live = false; };
  }, [layout, n, knobSize, items.map((o) => o.label).join('\u0000')]);

  // alone, the words are one radio group: one tab stop on the chosen word, arrows walk it word by word
  const onRadioKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const map: Record<string, number> = {
      ArrowDown: index + 1, ArrowUp: index - 1,
      ArrowRight: index + (rtl ? -1 : 1), ArrowLeft: index + (rtl ? 1 : -1),
      Home: 0, End: n - 1,
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    const i = Math.max(0, Math.min(n - 1, map[e.key]));
    pick(i);
    radios.current[i]?.focus();
  };

  const word = (o: { value: string; label: string }, i: number) => {
    const on = i === index;
    const inside = (
      <>
        <span className={styles.text}>{o.label}</span>
        <span className={styles.ghost} aria-hidden="true">{o.label}</span>
      </>
    );
    const place = layout === 'arc'
      ? ({ '--sx': Math.sin(((a0 + i * da) * Math.PI) / 180).toFixed(4), '--sy': (-Math.cos(((a0 + i * da) * Math.PI) / 180)).toFixed(4) } as CSSProperties)
      : undefined;
    if (withKnob) {
      // a press on a printed word turns the knob to it; the knob keeps the focus, so it stays the one tab stop
      return (
        <span
          key={o.value}
          data-word=""
          data-state={on ? 'on' : 'off'}
          className={styles.word}
          style={place}
          onPointerDown={(e) => {
            if (disabled || e.button !== 0) return;
            e.preventDefault();
            rootRef.current?.querySelector<HTMLElement>('[role="slider"]')?.focus();
            pick(i);
          }}
        >
          {inside}
        </span>
      );
    }
    return (
      <button
        key={o.value}
        ref={(el) => { radios.current[i] = el; }}
        type="button"
        role="radio"
        aria-checked={on}
        tabIndex={on ? 0 : -1}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        data-word=""
        data-state={on ? 'on' : 'off'}
        className={styles.word}
        onClick={() => pick(i)}
      >
        {inside}
      </button>
    );
  };

  // the knob's diameter is its control.knob-* token, so the printed arc follows the token too
  const vars = { ...style, '--n': n, '--a0': a0, '--da': da, '--d': d } as CSSProperties;

  return (
    <div
      ref={setRoot}
      data-component="Legend"
      data-layout={layout}
      data-control={withKnob ? 'rotary' : 'none'}
      data-disabled={disabled || undefined}
      className={cx(styles.root, styles[layout], withKnob && styles.paired, className)}
      style={vars}
      {...rest}
    >
      {withKnob ? (
        <Rotary
          label={label}
          kind={knob}
          size={knobSize}
          min={0}
          max={Math.max(1, n - 1)}
          step={1}
          sweep={sweep}
          value={index}
          onValueChange={(i) => pick(i)}
          formatValue={(i) => items[i]?.label ?? ''}
          printValue={false}
          describedBy={listId}
          disabled={disabled}
        />
      ) : (
        <span id={nameId} className={styles.name}>{label}</span>
      )}
      {withKnob ? (
        // the printed words belong to the knob: when it is off, they are part of an inactive control (WCAG 1.4.3)
        <div ref={wordsRef} className={cx(styles.words, layout === 'arc' && styles.hub)} aria-hidden="true" aria-disabled={disabled || undefined}>
          {items.map(word)}
          <span className={styles.mark} />
        </div>
      ) : (
        <div ref={wordsRef} role="radiogroup" aria-labelledby={nameId} aria-disabled={disabled || undefined} className={styles.words} onKeyDown={onRadioKey}>
          {items.map(word)}
          <span className={styles.mark} aria-hidden="true" />
        </div>
      )}
      {withKnob && <span id={listId} hidden>{items.length > 1 ? `${items.slice(0, -1).map((o) => o.label).join(', ')} or ${items[n - 1].label}` : items[0]?.label}</span>}
    </div>
  );
});
