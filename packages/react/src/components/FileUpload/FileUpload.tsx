import { forwardRef, useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button } from '../Button';
import { HelperText } from '../HelperText';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Progress } from '../Progress';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './FileUpload.module.css';

export type FileRejectionReason = 'size' | 'type' | 'count';

export interface FileRejection {
  /** The file that was refused. */
  file: File;
  /** Why: `size` is over `maxSize`, `type` is not in `accept`, `count` is past `maxFiles`. */
  reason: FileRejectionReason;
}

export interface FileUploadProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** The printed name above the key. It is required, because it is also the group's accessible name. */
  label: ReactNode;
  /** A short line printed under the key, such as the allowed types and the size limit. */
  hint?: ReactNode;
  /** The types the picker offers, in the `accept` syntax of a file input: `.pdf,image/*`. Files outside it are refused with a message. */
  accept?: string;
  /** Allow more than one file. Without it a new choice replaces the old one. Default false. */
  multiple?: boolean;
  /** The largest file in bytes. A larger file is refused and named in an error line. */
  maxSize?: number;
  /** The most files kept when `multiple` is set. Files past it are refused. */
  maxFiles?: number;
  /** The chosen files, for controlled use. Pair it with `onFilesChange`. */
  files?: File[];
  /** The files to start with, for uncontrolled use. */
  defaultFiles?: File[];
  /** Called with the whole list of chosen files after a choice or a removal. FileUpload sends nothing anywhere; this is the only way out. */
  onFilesChange?: (files: File[]) => void;
  /** Called with the files that were refused, so the product can log or show its own message. */
  onReject?: (rejections: FileRejection[]) => void;
  /** Return how far a file has been sent, from 0 to 100, and a Progress groove shows in its window. Return `undefined` for no groove. FileUpload does not send; you track the number. */
  progress?: (file: File) => number | undefined;
  /** A problem from outside, such as the server refusing the form. It is printed as an error line under the list. */
  error?: ReactNode;
  /** The `name` of the file input, so a surrounding form posts the chosen files. */
  name?: string;
  /** Turn the key and the remove keys off. */
  disabled?: boolean;
  /** The word on the key. Defaults to "Choose files", or "Choose a file" when `multiple` is off. Pass your own for another language. */
  buttonLabel?: string;
  /** The accessible name of a file's remove key. Defaults to "Remove {name}". */
  removeLabel?: (file: File) => string;
  /** How a size in bytes is printed. Defaults to "1.2 MB" style. */
  formatSize?: (bytes: number) => string;
  /** The word printed above a file's progress groove. Default "Sending". */
  progressLabel?: string;
  /** Class name for the outer wrapper. */
  className?: string;
  /** Inline style for the outer wrapper. */
  style?: CSSProperties;
}

function defaultFormat(bytes: number): string {
  const units = messages.fileUpload.units;
  let v = bytes;
  let i = 0;
  while (v >= 1000 && i < units.length - 1) { v /= 1000; i += 1; }
  const n = i === 0 ? String(v) : new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(v);
  return `${n} ${units[i]}`;
}

function matchesAccept(file: File, accept?: string): boolean {
  const tokens = (accept ?? '').split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = (file.type || '').toLowerCase();
  return tokens.some((t) => (t.startsWith('.') ? name.endsWith(t) : t.endsWith('/*') ? type.startsWith(t.slice(0, -1)) : type === t));
}

const same = (a: File, b: File) => a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;

/** A key that opens the file picker, and the chosen files read out in windows with a remove key each.
 *  It reports files through `onFilesChange` and never sends them. The ref points to the native file input. */
export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(
  {
    label, hint, accept, multiple = false, maxSize, maxFiles, files, defaultFiles, onFilesChange, onReject, progress, error, name,
    disabled = false, buttonLabel, removeLabel, formatSize = defaultFormat, progressLabel = messages.fileUpload.sending, className, style, ...rest
  },
  ref,
) {
  const auto = useId();
  const labelId = `${auto}-label`;
  const hintId = `${auto}-hint`;
  const [inner, setInner] = useState<File[]>(defaultFiles ?? []);
  const list = files ?? inner;
  const [refused, setRefused] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const keyRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const focusAt = useRef<number | null>(null);

  const setInput = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) (ref as { current: HTMLInputElement | null }).current = node;
  }, [ref]);

  const commit = (next: File[]) => {
    if (files === undefined) setInner(next);
    onFilesChange?.(next);
  };

  // keep the native input in step with the list, so a form posts what the windows show
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    try {
      const dt = new DataTransfer();
      list.forEach((f) => dt.items.add(f));
      input.files = dt.files;
    } catch { /* environments without DataTransfer keep the browser's own selection */ }
  }, [list]);

  // after a removal, focus goes to the remove key now in that place, or back to the choose key
  useEffect(() => {
    if (focusAt.current === null) return;
    const at = focusAt.current;
    focusAt.current = null;
    const keys = listRef.current?.querySelectorAll<HTMLButtonElement>('button') ?? [];
    (keys[Math.min(at, keys.length - 1)] ?? keyRef.current)?.focus();
  }, [list]);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = '';
    if (picked.length === 0) return;
    const lines: string[] = [];
    const rejections: FileRejection[] = [];
    const ok: File[] = [];
    for (const file of picked) {
      if (!matchesAccept(file, accept)) { rejections.push({ file, reason: 'type' }); lines.push(messages.fileUpload.wrongType(file.name)); }
      else if (maxSize !== undefined && file.size > maxSize) { rejections.push({ file, reason: 'size' }); lines.push(messages.fileUpload.tooBig(file.name, formatSize(maxSize))); }
      else ok.push(file);
    }
    let next = multiple ? [...list, ...ok.filter((f) => !list.some((g) => same(f, g)))] : ok.slice(0, 1);
    if (multiple && maxFiles !== undefined && next.length > maxFiles) {
      next.slice(maxFiles).forEach((file) => rejections.push({ file, reason: 'count' }));
      next = next.slice(0, maxFiles);
      lines.push(messages.fileUpload.tooMany(maxFiles));
    }
    setRefused(lines);
    setNote('');
    if (rejections.length > 0) onReject?.(rejections);
    if (ok.length > 0) commit(next);
  };

  const onRemove = (file: File, index: number) => {
    focusAt.current = index;
    setRefused([]);
    setNote(messages.fileUpload.removed(file.name));
    commit(list.filter((f) => f !== file));
  };

  const lines: ReactNode[] = [...refused, ...(error != null && error !== false && error !== '' ? [error] : [])];
  const errorIds = lines.map((_, i) => `${auto}-e${i}`);
  const describedBy = [hint != null ? hintId : null, ...errorIds].filter(Boolean).join(' ') || undefined;

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      data-component="FileUpload"
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
      style={style}
      {...rest}
    >
      <span id={labelId} className={styles.label}>{label}</span>
      <Button ref={keyRef} disabled={disabled} aria-describedby={describedBy} onClick={() => inputRef.current?.click()}>
        {buttonLabel ?? (multiple ? messages.fileUpload.chooseMany : messages.fileUpload.chooseOne)}
      </Button>
      <input ref={setInput} type="file" name={name} accept={accept} multiple={multiple} disabled={disabled} onChange={onPick} hidden tabIndex={-1} />
      {hint != null && <HelperText id={hintId}>{hint}</HelperText>}
      {list.length > 0 && (
        <ul ref={listRef} className={styles.list} aria-label={messages.fileUpload.list}>
          {list.map((file, i) => {
            const nameId = `${auto}-n${i}`;
            const sent = progress?.(file);
            return (
              <li key={`${file.name}-${file.size}-${file.lastModified}-${i}`} className={styles.item}>
                <div className={styles.window}>
                  <span id={nameId} className={styles.name}>{file.name}</span>
                  <span className={styles.size}>{formatSize(file.size)}</span>
                  {sent !== undefined && <Progress size="sm" label={progressLabel} value={sent} aria-labelledby={nameId} className={styles.progress} />}
                </div>
                <IconButton label={removeLabel ? removeLabel(file) : messages.fileUpload.remove(file.name)} disabled={disabled} onClick={() => onRemove(file, i)}>
                  <Icon name="close" size="sm" />
                </IconButton>
              </li>
            );
          })}
        </ul>
      )}
      <div className={styles.issues} aria-live="polite">
        {lines.map((line, i) => <HelperText key={errorIds[i]} id={errorIds[i]} tone="error">{line}</HelperText>)}
      </div>
      <VisuallyHidden aria-live="polite">{note}</VisuallyHidden>
    </div>
  );
});
