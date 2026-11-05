import { forwardRef, useId, useRef, useState, type CSSProperties, type DragEvent, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { VisuallyHidden } from '../VisuallyHidden';
import styles from './Dropzone.module.css';

export interface DropzoneProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onDrop' | 'children'> {
  /** Called with the files taken, from a drop or from the picker. Files that fail `accept`, or come after the first when `multiple` is off, are not in it. */
  onFilesDrop?: (files: File[]) => void;
  /** Called with the files that were not taken, so the product can say why. */
  onFilesReject?: (files: File[]) => void;
  /** Which files are taken, as the `accept` of a file input: `.pdf`, `image/*` or `application/pdf`, comma separated. Everything when empty. */
  accept?: string;
  /** Take more than one file at a time. Default false: the first file is taken and the rest are rejected. */
  multiple?: boolean;
  /** Turns the tray off: no drop, and the key is disabled. */
  disabled?: boolean;
  /** The name of the file input, for a form that submits the chosen files. */
  name?: string;
  /** The title while the tray waits. Default "Drop files here". Pass your own for another language. */
  title?: ReactNode;
  /** The title while a file is held over the tray. Default "Release to add". */
  overTitle?: ReactNode;
  /** The second line while the tray waits. Default "or choose them from this device". */
  hint?: ReactNode;
  /** The second line while a file is held over the tray. Default "Files are taken when you let go". */
  overHint?: ReactNode;
  /** The words on the key that opens the picker. Default "Choose files". */
  chooseLabel?: string;
  /** Builds the announcement after files are taken, such as "3 files added". Pass your own for another language. */
  addedLabel?: (count: number) => string;
  /** Builds the announcement when files are turned away, such as "1 file not accepted". */
  rejectedLabel?: (count: number) => string;
  /** Class name for the tray. */
  className?: string;
  /** Inline style for the tray. */
  style?: CSSProperties;
}

/** Does a file match one entry of an `accept` list: an extension, a `type/*` family or an exact type. */
function matches(file: File, entry: string): boolean {
  const want = entry.trim().toLowerCase();
  if (!want) return true;
  if (want.startsWith('.')) return file.name.toLowerCase().endsWith(want);
  if (want.endsWith('/*')) return file.type.toLowerCase().startsWith(want.slice(0, -1));
  return file.type.toLowerCase() === want;
}

const hasFiles = (e: DragEvent) => Array.from(e.dataTransfer?.types ?? []).includes('Files');

/** A tray window that takes dropped files and carries a real key that opens the picker. */
export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(function Dropzone(
  {
    onFilesDrop, onFilesReject, accept, multiple = false, disabled = false, name,
    title = messages.dropzone.drop, overTitle = messages.dropzone.over,
    hint = messages.dropzone.or, overHint = messages.dropzone.overHint,
    chooseLabel = messages.dropzone.choose, addedLabel = messages.dropzone.added, rejectedLabel = messages.dropzone.rejected,
    className, style, onClick, ...rest
  },
  ref,
) {
  const auto = useId();
  const titleId = `${auto}-title`;
  const hintId = `${auto}-hint`;
  const input = useRef<HTMLInputElement | null>(null);
  const depth = useRef(0);
  const [over, setOver] = useState(false);
  const [said, setSaid] = useState('');

  const take = (list: File[]) => {
    const entries = (accept ?? '').split(',');
    const ok = list.filter((f) => entries.some((en) => matches(f, en)));
    const taken = multiple ? ok : ok.slice(0, 1);
    const turned = list.filter((f) => !taken.includes(f));
    if (taken.length) onFilesDrop?.(taken);
    if (turned.length) onFilesReject?.(turned);
    setSaid([taken.length ? addedLabel(taken.length) : '', turned.length ? rejectedLabel(turned.length) : ''].filter(Boolean).join('. '));
  };
  const open = () => { if (!disabled) input.current?.click(); };
  const enter = (e: DragEvent<HTMLDivElement>) => {
    if (disabled || !hasFiles(e)) return;
    e.preventDefault();
    depth.current += 1;
    setOver(true);
  };
  const leave = (e: DragEvent<HTMLDivElement>) => {
    if (disabled || !hasFiles(e)) return;
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setOver(false);
  };
  const dragOver = (e: DragEvent<HTMLDivElement>) => {
    if (disabled || !hasFiles(e)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  const drop = (e: DragEvent<HTMLDivElement>) => {
    if (disabled || !hasFiles(e)) return;
    e.preventDefault();
    depth.current = 0;
    setOver(false);
    take(Array.from(e.dataTransfer.files));
  };

  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={titleId}
      aria-describedby={hintId}
      data-component="Dropzone"
      data-over={over || undefined}
      data-disabled={disabled || undefined}
      className={cx(styles.root, className)}
      style={style}
      onDragEnter={enter}
      onDragLeave={leave}
      onDragOver={dragOver}
      onDrop={drop}
      onClick={(e) => { onClick?.(e); if (!e.defaultPrevented && !(e.target as HTMLElement).closest('button')) open(); }}
      {...rest}
    >
      <Icon name={over ? 'plus' : 'share'} size="md" className={styles.glyph} />
      <p id={titleId} className={styles.title}>{over ? overTitle : title}</p>
      <p id={hintId} className={styles.hint}>{over ? overHint : hint}</p>
      <Button className={styles.key} disabled={disabled} onClick={open}>{chooseLabel}</Button>
      <input
        ref={input}
        type="file"
        hidden
        tabIndex={-1}
        aria-hidden="true"
        name={name}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => { take(Array.from(e.target.files ?? [])); e.target.value = ''; }}
      />
      <VisuallyHidden><span role="status" aria-live="polite">{said}</span></VisuallyHidden>
    </div>
  );
});
