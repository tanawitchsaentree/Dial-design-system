import { forwardRef, useCallback, useId, useRef, useState, type ChangeEvent, type CSSProperties, type InputHTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Chip } from '../Chip';
import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './TagInput.module.css';

export interface TagInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'size' | 'type' | 'onChange'> {
  /** The printed name above the well. It is required, because it also names the text field and the list of tags. */
  label: ReactNode;
  /** A short line printed under the well that says which keys add and remove a tag. */
  hint?: ReactNode;
  /** A problem with the current tags that you found yourself, for example "Add at least one room". It is printed under the well with a glyph and wins over the field's own refusal message. */
  error?: ReactNode;
  /** The tags (controlled). Pair it with `onValueChange`. */
  value?: string[];
  /** The tags the field starts with when it is uncontrolled. */
  defaultValue?: string[];
  /** Called with the new list each time a tag is added or removed. */
  onValueChange?: (tags: string[]) => void;
  /** The most tags the field takes. At the limit a new tag is refused with `maxMessage`. Unset means no limit. */
  max?: number;
  /** Lets the same tag be added twice. Off by default, and the comparison ignores case. */
  allowDuplicates?: boolean;
  /** Adds the text still in the field as a tag when the field loses focus. Defaults to `true`, so a typed word is not lost. */
  addOnBlur?: boolean;
  /** Called with the text and the reason each time a tag is refused. */
  onReject?: (tag: string, reason: 'duplicate' | 'max') => void;
  /** Name for a form. One hidden input with this name is printed per tag, so a form posts the list. */
  name?: string;
  /** The accessible name of each remove key. Defaults to "Remove" and the tag. Pass your own for another language. */
  removeLabel?: (tag: string) => string;
  /** The line printed and announced when a tag is already in the list. Defaults to "{tag} is already added". */
  duplicateMessage?: (tag: string) => string;
  /** The line printed and announced when `max` is reached. Defaults to "At most {max} tags". */
  maxMessage?: (max: number) => string;
  /** The line announced when a tag is added. Defaults to "{tag} added". */
  addedMessage?: (tag: string) => string;
  /** The line announced when a tag is removed. Defaults to "{tag} removed". */
  removedMessage?: (tag: string) => string;
  /** Class name for the outer wrapper (label, well and message). */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** A text field that keeps its words as removable chips inside the well: Enter or a comma adds one, Backspace on an empty field takes the last back. */
export const TagInput = forwardRef<HTMLInputElement, TagInputProps>(function TagInput(
  {
    label, hint, error, value, defaultValue, onValueChange, max, allowDuplicates = false, addOnBlur = true, onReject, name,
    removeLabel = messages.tagInput.remove,
    duplicateMessage = messages.tagInput.duplicate,
    maxMessage = messages.tagInput.max,
    addedMessage = messages.tagInput.added,
    removedMessage = messages.tagInput.removed,
    id, className, style, disabled, onBlur, onKeyDown, 'aria-describedby': describedBy, ...rest
  },
  ref,
) {
  const auto = useId();
  const fieldId = id ?? `${auto}-field`;
  const labelId = `${auto}-label`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const inner = useRef<HTMLInputElement | null>(null);
  const setRef = useCallback((node: HTMLInputElement | null) => {
    inner.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
  }, [ref]);

  const [own, setOwn] = useState<string[]>(defaultValue ?? []);
  const tags = value ?? own;
  const [text, setText] = useState('');
  const [note, setNote] = useState<string | null>(null);
  const [said, setSaid] = useState('');

  const commit = (next: string[]) => {
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  /** Tries to add one tag to `list`. Returns the new list, or null when it was refused. */
  const tryAdd = (raw: string, list: string[]): string[] | null => {
    const tag = raw.trim();
    if (!tag) return null;
    if (max != null && list.length >= max) {
      const m = maxMessage(max);
      setNote(m); setSaid(m); onReject?.(tag, 'max');
      return null;
    }
    if (!allowDuplicates && list.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      const m = duplicateMessage(tag);
      setNote(m); setSaid(m); onReject?.(tag, 'duplicate');
      return null;
    }
    setNote(null); setSaid(addedMessage(tag));
    return [...list, tag];
  };

  const removeAt = (index: number) => {
    const gone = tags[index];
    if (gone === undefined) return;
    commit(tags.filter((_, i) => i !== index));
    setNote(null); setSaid(removedMessage(gone));
    inner.current?.focus();
  };

  const onType = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setNote(null);
    if (!v.includes(',')) { setText(v); return; }
    // a comma ends a tag (typed, pasted or sent by a phone keyboard); the text after the last comma stays in the field
    const parts = v.split(',');
    const rest = parts.pop() ?? '';
    let list = tags;
    let kept = rest;
    for (const part of parts) {
      if (!part.trim()) continue;
      const next = tryAdd(part, list);
      if (!next) { kept = part; break; }
      list = next;
    }
    if (list !== tags) commit(list);
    setText(kept);
  };

  const keys = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || e.nativeEvent.isComposing) return;
    if (e.key === 'Enter' && text.trim()) {
      e.preventDefault();
      const next = tryAdd(text, tags);
      if (next) { commit(next); setText(''); }
    } else if (e.key === 'Backspace' && text === '' && tags.length > 0) {
      e.preventDefault();
      removeAt(tags.length - 1);
    }
  };

  const blurred = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(e);
    if (!addOnBlur || !text.trim()) return;
    const next = tryAdd(text, tags);
    if (next) { commit(next); setText(''); }
  };

  const focusField = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled || (e.target as HTMLElement).closest('button, input')) return;
    e.preventDefault();
    inner.current?.focus();
  };

  const shown = error != null && error !== false && error !== '' ? error : note;
  const invalid = shown != null && shown !== '';
  const described = [hint != null ? hintId : null, invalid ? errorId : null, describedBy].filter(Boolean).join(' ') || undefined;

  return (
    <div data-component="TagInput" data-invalid={invalid || undefined} data-disabled={disabled || undefined} className={cx(styles.root, className)} style={style}>
      <label id={labelId} className={styles.label} htmlFor={fieldId}>{label}</label>
      <div className={styles.well} onMouseDown={focusField}>
        {tags.length > 0 && (
        <ul className={styles.list} role="list" aria-labelledby={labelId}>
          {tags.map((tag, i) => (
            <li key={`${tag}-${i}`} className={styles.item}>
              <Chip disabled={disabled} removeLabel={removeLabel(tag)} onRemove={() => removeAt(i)}>{tag}</Chip>
            </li>
          ))}
        </ul>
        )}
        <input
          ref={setRef}
          id={fieldId}
          type="text"
          className={styles.field}
          disabled={disabled}
          value={text}
          onChange={onType}
          onKeyDown={keys}
          onBlur={blurred}
          aria-invalid={invalid || undefined}
          aria-describedby={described}
          autoComplete="off"
          {...rest}
        />
      </div>
      {name != null && tags.map((tag, i) => <input key={`${tag}-${i}`} type="hidden" name={name} value={tag} />)}
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          {/* dial's one icon language, the dot matrix (R-005) */}
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{shown}</span>
        </p>
      )}
      <VisuallyHidden role="status" aria-live="polite">{said}</VisuallyHidden>
    </div>
  );
});
