import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../cx';
import styles from './Avatar.module.css';

export type AvatarSize = 'sm' | 'md' | 'lg';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The person's or owner's name. The initials are taken from it when there is no picture. */
  name?: string;
  /** The picture's address. If it fails to load, the window falls back to the initials. */
  src?: string;
  /** Letters to print instead of the ones taken from `name`. One or two letters read best. */
  initials?: string;
  /** Window size: `sm` 32px, `md` 44px, `lg` 80px. Default `md`. */
  size?: AvatarSize;
  /**
   * A name for assistive tech. With a label the window is role img and named. Without one it is hidden,
   * because the name is normally printed beside it. Pass a label when nothing else names the person.
   */
  label?: string;
  /** Class name for the window. */
  className?: string;
}

const LEADING_VOWELS = /^[เแโใไ]/;

function graphemes(text: string): string[] {
  const Seg = (Intl as unknown as { Segmenter?: new (l?: string, o?: { granularity: string }) => { segment(s: string): Iterable<{ segment: string }> } }).Segmenter;
  if (Seg) return Array.from(new Seg(undefined, { granularity: 'grapheme' }).segment(text), (s) => s.segment);
  return Array.from(text);
}

/** The letter a word starts with. A Thai leading vowel is written before its consonant, so the two go together. */
function firstLetter(word: string): string {
  const g = graphemes(word);
  if (g.length > 1 && LEADING_VOWELS.test(g[0])) return g[0] + g[1];
  return g[0] ?? '';
}

/** Up to two initials: the first letters of the first and last word of the name. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const letters = words.length === 1 ? [firstLetter(words[0])] : [firstLetter(words[0]), firstLetter(words[words.length - 1])];
  return letters.join('').toLocaleUpperCase();
}

/** A person or owner shown as a picture or initials in a recessed window. Not a control. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, initials, size = 'md', label, className, ...rest },
  ref,
) {
  const [failed, setFailed] = useState<string | undefined>(undefined);
  const showImage = Boolean(src) && failed !== src;
  const text = initials ?? (name ? initialsOf(name) : '');
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true as const };
  return (
    <span ref={ref} data-component="Avatar" data-size={size} className={cx(styles.root, className)} {...a11y} {...rest}>
      {showImage ? (
        <img className={styles.image} src={src} alt="" onError={() => setFailed(src)} />
      ) : text ? (
        <span className={styles.initials}>{text}</span>
      ) : (
        <span className={styles.mark} />
      )}
    </span>
  );
});
