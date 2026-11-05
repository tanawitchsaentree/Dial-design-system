import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import { Input } from '../Input';
import { Slider } from '../Slider';
import styles from './ColorPicker.module.css';

export interface ColorSwatch {
  /** The colour as a hex string, three or six digits with or without the hash. It is data: it paints the lens and is never read as a token. */
  value: string;
  /** The colour's name. It is the accessible name of the key and is printed in the readout when the key is chosen. */
  name: string;
}

export interface ColorPickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the keys. It is required, because it is also the accessible name of the radio group. */
  label: ReactNode;
  /** The named colours to choose from, in reading order. */
  swatches: ColorSwatch[];
  /** The chosen colour as a hex string when you control it, for example one of the swatch values. Pair it with `onValueChange`. */
  value?: string;
  /** The colour chosen at the start when the picker keeps its own state. */
  defaultValue?: string;
  /** Called with the new colour, always as a six-digit lowercase hex string with a hash, when a key, the fader or the hex well sets a different colour. */
  onValueChange?: (value: string) => void;
  /** Show a hue fader under the readout. Moving it sets a custom colour at fixed saturation and lightness. Default false. */
  hue?: boolean;
  /** Show a hex well under the readout. A valid entry sets the colour as you type; an invalid one prints a message and is dropped on leaving the field. Default false. */
  hex?: boolean;
  /** The form field name. When set, a hidden input carries the chosen colour so a form submits it. */
  name?: string;
  /** The keys, the fader and the well cannot be used; the keys lose their height. */
  disabled?: boolean;
  /** The words printed on the hue fader. Pass your own for another language. */
  hueLabel?: string;
  /** The words printed on the hex well. Pass your own for another language. */
  hexLabel?: string;
  /** The message printed under the hex well for an entry that is not a colour. */
  hexError?: string;
  /** Turns the chosen swatch, or null for a custom colour, into the readout line. The hex is the current value. */
  formatReadout?: (swatch: ColorSwatch | null, hex: string) => string;
  /** Class name for the root. */
  className?: string;
  /** Inline style for the root. */
  style?: CSSProperties;
}

/** Reads a hex string of three or six digits into a six-digit lowercase string with a hash, or null. */
export function normaliseHex(input: string): string | null {
  const body = input.trim().replace(/^#/, '').toLowerCase();
  if (/^[0-9a-f]{3}$/.test(body)) return `#${body.split('').map((c) => c + c).join('')}`;
  if (/^[0-9a-f]{6}$/.test(body)) return `#${body}`;
  return null;
}

const SATURATION = 0.85;
const LIGHTNESS = 0.55;
const HUE_SLACK = 2;

function hueToHex(h: number): string {
  const a = SATURATION * Math.min(LIGHTNESS, 1 - LIGHTNESS);
  const channel = (n: number) => {
    const k = (n + h / 30) % 12;
    const v = LIGHTNESS - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(v * 255).toString(16).padStart(2, '0');
  };
  return `#${channel(0)}${channel(8)}${channel(4)}`;
}

function hexToHue(hex: string): number | null {
  const n = normaliseHex(hex);
  if (!n) return null;
  const r = parseInt(n.slice(1, 3), 16) / 255;
  const g = parseInt(n.slice(3, 5), 16) / 255;
  const b = parseInt(n.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (d === 0) return null;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return Math.round(((h * 60) + 360) % 360);
}

const near = (a: number, b: number) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b)) <= HUE_SLACK;

const defaultReadout = (swatch: ColorSwatch | null, hex: string) =>
  swatch ? messages.colorPicker.chosen(swatch.name) : hex ? messages.colorPicker.custom(hex) : messages.colorPicker.none;

/** A lamp colour chooser: round lens keys with a ring and a tick on the chosen one, a printed readout, and an optional hue fader and hex well. */
export const ColorPicker = forwardRef<HTMLDivElement, ColorPickerProps>(function ColorPicker(
  {
    label,
    swatches,
    value,
    defaultValue = '',
    onValueChange,
    hue: withHue = false,
    hex: withHex = false,
    name,
    disabled = false,
    hueLabel = messages.colorPicker.hue,
    hexLabel = messages.colorPicker.hex,
    hexError = messages.colorPicker.invalidHex,
    formatReadout = defaultReadout,
    className,
    style,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const legendId = `${auto}-legend`;
  const controlled = value !== undefined;
  const [inner, setInner] = useState(() => normaliseHex(defaultValue) ?? '');
  const current = controlled ? normaliseHex(value) ?? '' : inner;
  const [draft, setDraft] = useState<string | null>(null);
  const lastHue = useRef(hexToHue(current) ?? 0);

  const set = useCallback(
    (next: string) => {
      if (!controlled) setInner(next);
      if (next !== current) onValueChange?.(next);
    },
    [controlled, current, onValueChange],
  );

  const chosen = swatches.find((s) => normaliseHex(s.value) === current) ?? null;
  const fromColour = hexToHue(current);
  const shownHue = fromColour !== null && !near(fromColour, lastHue.current) ? fromColour : lastHue.current;
  const invalid = withHex && draft !== null && normaliseHex(draft) === null;

  const onHex = (event: ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value;
    setDraft(text);
    const ok = normaliseHex(text);
    if (ok) {
      const h = hexToHue(ok);
      if (h !== null) lastHue.current = h;
      set(ok);
    }
  };

  return (
    <div
      ref={ref}
      data-component="ColorPicker"
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      <span id={legendId} className={styles.legend}>{label}</span>
      <div role="radiogroup" aria-labelledby={legendId} className={styles.group}>
        {swatches.map((swatch) => {
          const hexValue = normaliseHex(swatch.value) ?? swatch.value;
          const checked = hexValue === current;
          return (
            <label key={`${swatch.name}-${swatch.value}`} data-hit="" data-checked={checked || undefined} data-disabled={disabled || undefined} className={styles.swatch}>
              <input
                type="radio"
                className={styles.input}
                name={`${auto}-group`}
                value={hexValue}
                checked={checked}
                disabled={disabled}
                aria-label={swatch.name}
                onChange={() => {
                  const h = hexToHue(hexValue);
                  if (h !== null) lastHue.current = h;
                  setDraft(null);
                  set(hexValue);
                }}
              />
              <span className={styles.lens} style={{ '--swatch-color': hexValue } as CSSProperties}>
                <span className={styles.tick} aria-hidden="true"><Icon name="check" size="sm" /></span>
              </span>
            </label>
          );
        })}
      </div>
      <p className={styles.readout} role="status">{formatReadout(chosen, current)}</p>
      {(withHue || withHex) && (
        <div className={styles.extras}>
          {withHue && (
            <Slider
              label={hueLabel}
              min={0}
              max={360}
              step={1}
              value={shownHue}
              disabled={disabled}
              formatValue={(v) => `${v}°`}
              onValueChange={(h) => {
                lastHue.current = h;
                setDraft(null);
                set(hueToHex(h));
              }}
            />
          )}
          {withHex && (
            <Input
              label={hexLabel}
              value={draft ?? current}
              onChange={onHex}
              onBlur={() => setDraft(null)}
              error={invalid ? hexError : undefined}
              disabled={disabled}
              maxLength={7}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
            />
          )}
        </div>
      )}
      {name ? <input type="hidden" name={name} value={current} /> : null}
    </div>
  );
});
