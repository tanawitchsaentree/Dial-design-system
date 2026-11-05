import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Editable.module.css';

export interface EditableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange' | 'children'> {
  /** The printed name above the value. It is required, and it is a string because the keys and the announcements are built from it, for example "Edit Room name". */
  label: string;
  /** The value when controlled. Pair it with `onValueChange`. Typing does not change it; only a commit does. */
  value?: string;
  /** The starting value when uncontrolled. Leave it out for an empty value. */
  defaultValue?: string;
  /** Called with the new text when an edit is committed by Enter, by the save key or by leaving the field. It is not called on every keystroke, and not when the text is unchanged or the edit was cancelled. */
  onValueChange?: (value: string) => void;
  /** Called with `true` when the field opens and `false` when it closes, whether it was saved or cancelled. */
  onEditingChange?: (editing: boolean) => void;
  /** The words printed in place of an empty value. Defaults to "Not set". Pass your own for another language. */
  placeholder?: string;
  /** A short line printed under the row that says what to enter, for example the allowed length. */
  hint?: ReactNode;
  /** The problem with the current value. When set, the field is marked invalid and the message is printed under the row with a glyph. */
  error?: ReactNode;
  /** The most characters the field accepts while editing. */
  maxLength?: number;
  /** When set, the committed value is also written to a hidden input of this name, so the Editable can sit in a native form. */
  name?: string;
  /** Prints the value with no key and no press area. Unlike `disabled`, it stays at full ink, because it is a reading and not an unavailable setting. */
  readOnly?: boolean;
  /** Fades the value, drops the key and takes no input. */
  disabled?: boolean;
  /** The name of the edit key. Defaults to "Edit {label}". Pass your own for another language. */
  editLabel?: string;
  /** The name of the save key. Defaults to "Save {label}". Pass your own for another language. */
  saveLabel?: string;
  /** The name of the cancel key. Defaults to "Cancel editing {label}". Pass your own for another language. */
  cancelLabel?: string;
  /** Builds the line announced after a change is committed. Defaults to "{label} changed to {value}" or "{label} cleared". */
  changedMessage?: (value: string) => string;
  /** The line announced after an edit is cancelled. Defaults to "{label} kept as it was". */
  cancelledMessage?: string;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

/** A value printed on the case that becomes an Input well when pressed: Enter or leaving the field commits, Escape restores. */
export const Editable = forwardRef<HTMLDivElement, EditableProps>(function Editable(
  {
    label,
    value,
    defaultValue = '',
    onValueChange,
    onEditingChange,
    placeholder = messages.editable.placeholder,
    hint,
    error,
    maxLength,
    name,
    readOnly,
    disabled,
    editLabel,
    saveLabel,
    cancelLabel,
    changedMessage,
    cancelledMessage,
    className,
    style,
    ...rest
  },
  ref,
) {
  const auto = useId();
  const labelId = `${auto}-label`;
  const valueId = `${auto}-value`;
  const hintId = `${auto}-hint`;
  const errorId = `${auto}-error`;
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [said, setSaid] = useState('');
  const field = useRef<HTMLInputElement>(null);
  const reading = useRef<HTMLButtonElement>(null);
  // set once an edit has ended, so the blur that follows an Escape or an unmount cannot commit a second time
  const settled = useRef(true);
  const giveFocusBack = useRef(false);
  const invalid = error != null && error !== false && error !== '';
  const described = [hint != null ? hintId : null, invalid ? errorId : null].filter(Boolean).join(' ') || undefined;
  const canEdit = !disabled && !readOnly;

  useEffect(() => {
    if (editing) {
      field.current?.focus();
      field.current?.select();
    } else if (giveFocusBack.current) {
      giveFocusBack.current = false;
      reading.current?.focus();
    }
  }, [editing]);

  const start = () => {
    if (!canEdit || editing) return;
    settled.current = false;
    setDraft(current);
    setSaid('');
    setEditing(true);
    onEditingChange?.(true);
  };

  const finish = (commit: boolean, returnFocus: boolean) => {
    if (settled.current) return;
    settled.current = true;
    const next = field.current ? field.current.value : draft;
    if (commit) {
      if (next !== current) {
        if (value === undefined) setInner(next);
        onValueChange?.(next);
        setSaid(changedMessage ? changedMessage(next) : messages.editable.changed(label, next));
      } else {
        setSaid('');
      }
    } else {
      setSaid(cancelledMessage ?? messages.editable.cancelled(label));
    }
    giveFocusBack.current = returnFocus;
    setEditing(false);
    onEditingChange?.(false);
  };

  const onRowKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // a Thai or Japanese composition uses Enter and Escape itself; those must not end the edit
    if (e.nativeEvent.isComposing || e.keyCode === 229) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      finish(false, true);
    } else if (e.key === 'Enter' && e.target === field.current) {
      e.preventDefault();
      finish(true, true);
    }
  };

  // leaving the row (not moving between the field and its keys) commits; the focus goes where the person sent it
  const onRowBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (e.relatedTarget instanceof Node && e.currentTarget.contains(e.relatedTarget)) return;
    finish(true, false);
  };

  // pressing a key must not blur the field first, or the blur would commit before the key is read
  const keepFocus = (e: MouseEvent<HTMLButtonElement>) => e.preventDefault();

  const empty = current === '';
  const shown = empty ? placeholder : current;

  return (
    <div
      ref={ref}
      data-component="Editable"
      data-editing={editing || undefined}
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      <span id={labelId} className={styles.label}>{label}</span>
      {editing ? (
        <div className={styles.row} onKeyDown={onRowKeyDown} onBlur={onRowBlur}>
          <div className={styles.well}>
            <input
              ref={field}
              type="text"
              className={styles.field}
              value={draft}
              maxLength={maxLength}
              enterKeyHint="done"
              aria-labelledby={labelId}
              aria-invalid={invalid || undefined}
              aria-describedby={described}
              onChange={(e) => setDraft(e.target.value)}
            />
          </div>
          <div className={styles.keys}>
            <IconButton label={cancelLabel ?? messages.editable.cancel(label)} onMouseDown={keepFocus} onClick={() => finish(false, true)}>
              <Icon name="close" size="sm" />
            </IconButton>
            <IconButton label={saveLabel ?? messages.editable.save(label)} onMouseDown={keepFocus} onClick={() => finish(true, true)}>
              <Icon name="check" size="sm" />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className={styles.row}>
          {readOnly ? (
            <p id={valueId} className={styles.reading} data-empty={empty || undefined}>{shown}</p>
          ) : (
            <button
              ref={reading}
              type="button"
              className={styles.reading}
              data-empty={empty || undefined}
              disabled={disabled}
              aria-labelledby={`${labelId} ${valueId}`}
              aria-describedby={described}
              onClick={start}
            >
              <span id={valueId}>{shown}</span>
            </button>
          )}
          {canEdit && (
            // the edit key is the way in for a thumb; the reading is the keyboard stop, so the key stays out of the tab order
            <IconButton label={editLabel ?? messages.editable.edit(label)} tabIndex={-1} onClick={start}>
              <Icon name="edit" size="sm" />
            </IconButton>
          )}
        </div>
      )}
      {name != null && <input type="hidden" name={name} value={current} />}
      {hint != null && <p id={hintId} className={styles.hint}>{hint}</p>}
      {invalid && (
        <p id={errorId} className={styles.error}>
          <Icon name="critical" size="sm" className={styles.glyph} />
          <span>{error}</span>
        </p>
      )}
      <VisuallyHidden role="status" aria-live="polite">{said}</VisuallyHidden>
    </div>
  );
});
