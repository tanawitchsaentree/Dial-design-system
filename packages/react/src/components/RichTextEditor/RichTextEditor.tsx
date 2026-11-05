'use client';
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Input } from '../Input';
import {
  applyLink,
  ensureBlocks,
  headingActive,
  inlineActive,
  insertHtml,
  linkAt,
  listActive,
  rangeIn,
  removeLink,
  select,
  toggleHeading,
  toggleInline,
  toggleList,
} from './commands';
import { safeHref, sanitizeHtml, textToHtml } from './sanitize';
import styles from './RichTextEditor.module.css';

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** The words and printed marks the editor speaks. Every key is optional; what you leave out falls back to English. */
export type RichTextEditorWords = {
  /** The toolbar's accessible name. Defaults to "Formatting". */
  toolbar: string;
  /** Name of the bold key. */
  bold: string;
  /** Name of the italic key. */
  italic: string;
  /** Name of the link key. */
  link: string;
  /** Name of the bulleted list key. */
  bulletList: string;
  /** Name of the numbered list key. */
  numberList: string;
  /** Name of the heading key. */
  heading: string;
  /** The mark printed on the bold key. Defaults to "B". */
  boldMark: string;
  /** The mark printed on the italic key. Defaults to "I". */
  italicMark: string;
  /** The mark printed on the link key. Defaults to "Link". */
  linkMark: string;
  /** The mark printed on the bulleted list key. */
  bulletMark: string;
  /** The mark printed on the numbered list key. */
  numberMark: string;
  /** The mark printed on the heading key. Defaults to "H". */
  headingMark: string;
  /** The shortcut announced for the bold key (aria-keyshortcuts). */
  boldShortcut: string;
  /** The shortcut announced for the italic key (aria-keyshortcuts). */
  italicShortcut: string;
  /** The shortcut announced for the link key (aria-keyshortcuts). */
  linkShortcut: string;
  /** The label of the address field that opens for a link. */
  address: string;
  /** The hint under the address field. */
  addressHint: string;
  /** The error shown when the address cannot be used. */
  badAddress: string;
  /** The word on the key that applies the link. */
  apply: string;
  /** The word on the key that removes a link. */
  removeLink: string;
  /** The word on the key that closes the address field. */
  cancel: string;
  /** The prompt printed in the empty writing area. */
  placeholder: string;
};

export interface RichTextEditorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'> {
  /** The printed name above the keys. It is required, because it is also the writing area's accessible name. */
  label: string;
  /** The HTML when controlled. It is sanitised before it is shown. Pair it with `onChange`. */
  value?: string;
  /** The starting HTML when uncontrolled. It is sanitised before it is shown. Leave it out for an empty editor. */
  defaultValue?: string;
  /** Called with the sanitised HTML string after each edit. Only `p`, `h2`, `strong`, `em`, `a[href]`, `ul`, `ol`, `li` and `br` can appear. An empty editor gives an empty string. */
  onChange?: (html: string) => void;
  /** The prompt printed in the empty writing area. Defaults to "Write here". Pass your own for another language. */
  placeholder?: string;
  /** A short line printed under the well that says what to write. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the well with a glyph. */
  error?: ReactNode;
  /** When set, the sanitised HTML is also written to a hidden input of this name, so the editor can sit in a native form. */
  name?: string;
  /** Prints the text with no keys and no caret. Unlike `disabled`, it stays at full ink, because it is a reading. */
  readOnly?: boolean;
  /** Fades the field, disables the keys and takes no input. */
  disabled?: boolean;
  /** Replacements for the built-in words and marks. */
  words?: Partial<RichTextEditorWords>;
  /** The smallest height of the writing area, as any CSS length. Defaults to about five lines. */
  minHeight?: string;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

type Active = { bold: boolean; italic: boolean; link: boolean; ul: boolean; ol: boolean; heading: boolean };
const NONE: Active = { bold: false, italic: false, link: false, ul: false, ol: false, heading: false };

/** A note field with formatting keys: bold, italic, link, lists and a heading, over a recessed well. It reports sanitised HTML. */
export const RichTextEditor = forwardRef<HTMLDivElement, RichTextEditorProps>(function RichTextEditor(
  { label, value, defaultValue = '', onChange, placeholder, hint, error, name, readOnly, disabled, words, minHeight, className, style, ...rest },
  ref,
) {
  const w = { ...messages.richTextEditor, ...words };
  const auto = useId();
  const labelId = `${auto}-label`;
  const fieldId = `${auto}-field`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const invalid = error != null && error !== false && error !== '';
  const controlled = value !== undefined;
  const field = useRef<HTMLDivElement | null>(null);
  const keys = useRef<Array<HTMLButtonElement | null>>([]);
  const addr = useRef<HTMLInputElement | null>(null);
  const saved = useRef<Range | null>(null);
  const last = useRef<string | null>(null);
  const [active, setActive] = useState<Active>(NONE);
  const [empty, setEmpty] = useState(true);
  const [html, setHtml] = useState('');
  const [stop, setStop] = useState(0);
  const [linking, setLinking] = useState(false);
  const [address, setAddress] = useState('');
  const [addressError, setAddressError] = useState(false);
  const inert = !!disabled || !!readOnly;
  const prompt = placeholder ?? w.placeholder;

  const refresh = useCallback(() => {
    const el = field.current;
    if (!el) return;
    setEmpty((el.textContent ?? '').trim() === '');
  }, []);

  // show the HTML: once for an uncontrolled editor, and whenever the value changes for a controlled one
  const first = useRef(true);
  useIsoLayoutEffect(() => {
    const el = field.current;
    if (!el) return;
    const source = controlled ? value : first.current ? defaultValue : null;
    first.current = false;
    if (source === null || source === undefined) return;
    const want = sanitizeHtml(source);
    if (sanitizeHtml(el.innerHTML) !== want || !el.firstChild) el.innerHTML = want || '<p><br></p>';
    last.current = want;
    setHtml(want);
    setEmpty((el.textContent ?? '').trim() === '');
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const emit = useCallback(() => {
    const el = field.current;
    if (!el) return;
    const next = sanitizeHtml(el.innerHTML);
    refresh();
    if (next === last.current) return;
    last.current = next;
    setHtml(next);
    onChange?.(next);
  }, [onChange, refresh]);

  // what is on at the caret, read from the selection
  useEffect(() => {
    const read = () => {
      const el = field.current;
      if (!el) return;
      const r = rangeIn(el);
      if (!r) return;
      saved.current = r.cloneRange();
      const next: Active = {
        bold: inlineActive(el, r, 'strong'),
        italic: inlineActive(el, r, 'em'),
        link: !!linkAt(el, r),
        ul: listActive(el, r, 'ul'),
        ol: listActive(el, r, 'ol'),
        heading: headingActive(el, r),
      };
      setActive((a) => (Object.keys(next).every((k) => a[k as keyof Active] === next[k as keyof Active]) ? a : next));
    };
    document.addEventListener('selectionchange', read);
    return () => document.removeEventListener('selectionchange', read);
  }, []);

  // run a command on the saved or live selection, then report the new HTML
  const run = useCallback(
    (fn: (el: HTMLDivElement, r: Range) => Range | null | void) => {
      const el = field.current;
      if (!el || inert) return;
      let r = rangeIn(el);
      if (!r && saved.current && el.contains(saved.current.commonAncestorContainer)) r = select(saved.current.cloneRange());
      if (!r) {
        el.focus();
        const end = document.createRange();
        end.selectNodeContents(el.lastElementChild ?? el);
        end.collapse(false);
        r = select(end);
      }
      r = ensureBlocks(el, r) ?? r;
      const next = fn(el, r);
      el.focus();
      if (next) select(next);
      emit();
    },
    [emit, inert],
  );

  const bold = () => run((el, r) => toggleInline(el, r, 'strong'));
  const italic = () => run((el, r) => toggleInline(el, r, 'em'));
  const bullets = () => run((el, r) => toggleList(el, r, 'ul'));
  const numbers = () => run((el, r) => toggleList(el, r, 'ol'));
  const heading = () => run((el, r) => toggleHeading(el, r));

  const openLink = () => {
    const el = field.current;
    if (!el || inert) return;
    const r = rangeIn(el);
    if (r) saved.current = r.cloneRange();
    const a = linkAt(el, saved.current);
    setAddress(a?.getAttribute('href') ?? '');
    setAddressError(false);
    setLinking(true);
  };
  useEffect(() => {
    if (linking) addr.current?.focus();
  }, [linking]);
  const closeLink = () => {
    setLinking(false);
    const el = field.current;
    el?.focus();
    if (el && saved.current && el.contains(saved.current.commonAncestorContainer)) select(saved.current.cloneRange());
  };
  const applyAddress = () => {
    const href = safeHref(address);
    if (!href) { setAddressError(true); return; }
    setLinking(false);
    run((el, r) => applyLink(el, r, href));
  };
  const dropLink = () => {
    setLinking(false);
    run((el, r) => removeLink(el, r));
  };

  // browser-level formatting requests (context menu, Safari shortcuts) are routed to the same commands
  useEffect(() => {
    const el = field.current;
    if (!el) return;
    const onBefore = (e: Event) => {
      const t = (e as InputEvent).inputType;
      if (t === 'formatBold') { e.preventDefault(); bold(); }
      else if (t === 'formatItalic') { e.preventDefault(); italic(); }
      else if (t === 'insertUnorderedList') { e.preventDefault(); bullets(); }
      else if (t === 'insertOrderedList') { e.preventDefault(); numbers(); }
      else if (t === 'insertFromDrop' || t === 'insertFromYank') e.preventDefault();
    };
    el.addEventListener('beforeinput', onBefore);
    return () => el.removeEventListener('beforeinput', onBefore);
  });

  const onFieldKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (inert || !(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
    const k = e.key.toLowerCase();
    if (k === 'b') { e.preventDefault(); bold(); }
    else if (k === 'i') { e.preventDefault(); italic(); }
    else if (k === 'k') { e.preventDefault(); openLink(); }
  };

  const onPaste = (e: ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (inert) return;
    const raw = e.clipboardData.getData('text/html');
    const clean = raw ? sanitizeHtml(raw) : textToHtml(e.clipboardData.getData('text/plain'));
    run((el, r) => insertHtml(el, r, clean));
  };

  const onBarKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const list = keys.current.filter(Boolean) as HTMLButtonElement[];
    const at = list.findIndex((k) => k === e.target);
    if (at < 0) return;
    const rtl = getComputedStyle(e.currentTarget).direction === 'rtl';
    const lastIndex = list.length - 1;
    let to: number | null = null;
    if (e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) to = at === lastIndex ? 0 : at + 1;
    else if (e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) to = at === 0 ? lastIndex : at - 1;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = lastIndex;
    if (to === null) return;
    e.preventDefault();
    setStop(to);
    list[to].focus();
  };
  // a mouse press on a key must not take the caret away from the text
  const keepCaret = (e: MouseEvent<HTMLDivElement>) => e.preventDefault();

  const items: Array<{ id: string; name: string; mark: string; on: boolean; shortcut?: string; act: () => void }> = [
    { id: 'bold', name: w.bold, mark: w.boldMark, on: active.bold, shortcut: w.boldShortcut, act: bold },
    { id: 'italic', name: w.italic, mark: w.italicMark, on: active.italic, shortcut: w.italicShortcut, act: italic },
    { id: 'link', name: w.link, mark: w.linkMark, on: active.link, shortcut: w.linkShortcut, act: openLink },
    { id: 'ul', name: w.bulletList, mark: w.bulletMark, on: active.ul, act: bullets },
    { id: 'ol', name: w.numberList, mark: w.numberMark, on: active.ol, act: numbers },
    { id: 'heading', name: w.heading, mark: w.headingMark, on: active.heading, act: heading },
  ];
  const describedBy = [hint != null ? hintId : null, invalid ? errorId : null].filter(Boolean).join(' ') || undefined;
  const hasLink = linking && !!field.current && !!linkAt(field.current, saved.current);

  return (
    <div
      ref={ref}
      data-component="RichTextEditor"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      <span id={labelId} className={styles.label} onClick={() => field.current?.focus()}>{label}</span>
      {!readOnly && (
        <div role="toolbar" aria-label={w.toolbar} aria-controls={fieldId} className={styles.bar} onKeyDown={onBarKeyDown} onMouseDown={keepCaret}>
          {items.map((k, i) => (
            <IconButton
              key={k.id}
              ref={(el) => { keys.current[i] = el; }}
              label={k.name}
              aria-pressed={k.on}
              aria-keyshortcuts={k.shortcut}
              tabIndex={i === stop ? 0 : -1}
              disabled={disabled}
              data-key={k.id}
              onFocus={() => setStop(i)}
              onClick={k.act}
            >
              {k.mark}
            </IconButton>
          ))}
        </div>
      )}
      {linking && !readOnly && (
        <div role="group" aria-label={w.link} className={styles.linkRow}>
          <Input
            ref={addr}
            label={w.address}
            hint={w.addressHint}
            error={addressError ? w.badAddress : undefined}
            value={address}
            inputMode="url"
            autoComplete="off"
            onChange={(e) => { setAddress(e.target.value); setAddressError(false); }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); applyAddress(); }
              else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeLink(); }
            }}
          />
          <div className={styles.linkKeys}>
            <Button onClick={applyAddress}>{w.apply}</Button>
            {hasLink && <Button onClick={dropLink}>{w.removeLink}</Button>}
            <Button onClick={closeLink}>{w.cancel}</Button>
          </div>
        </div>
      )}
      <div className={styles.well}>
        <div
          ref={field}
          id={fieldId}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={labelId}
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          aria-readonly={readOnly || undefined}
          aria-disabled={disabled || undefined}
          aria-placeholder={prompt}
          contentEditable={!inert}
          suppressContentEditableWarning
          spellCheck
          tabIndex={disabled ? -1 : 0}
          data-empty={empty || undefined}
          data-placeholder={prompt}
          className={styles.field}
          style={minHeight ? { minBlockSize: minHeight } : undefined}
          onInput={emit}
          onKeyDown={onFieldKeyDown}
          onPaste={onPaste}
        />
      </div>
      {name && <input type="hidden" name={name} value={html} />}
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});
