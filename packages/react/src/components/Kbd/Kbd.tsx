import { Fragment, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import styles from './Kbd.module.css';

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  /** The key name as printed on the cap: `Esc`, `Enter`, `K`, or an `Icon`. */
  children: ReactNode;
  /** The spoken name when the cap shows a symbol or an icon, such as "Up arrow". The printed cap is then hidden from assistive tech. */
  label?: string;
  /** Class name for the cap. */
  className?: string;
  /** Inline style for the cap. */
  style?: CSSProperties;
}

export interface KbdComboProps extends HTMLAttributes<HTMLElement> {
  /** The keys of a chord, in the order they are pressed together: `['Ctrl', 'K']`. */
  keys: ReactNode[];
  /** The word read out between the keys. Pass your own for another language. Default "plus". */
  joinLabel?: string;
  /** Class name for the chord. */
  className?: string;
  /** Inline style for the chord. */
  style?: CSSProperties;
}

/** A key name printed as a small keycap: flat top, a hard lower edge. A name, not a control. */
export function Kbd({ children, label, className, style, ...rest }: KbdProps) {
  return (
    <kbd data-component="Kbd" className={cx(styles.root, className)} style={style} {...rest}>
      {label ? (
        <>
          <span aria-hidden="true">{children}</span>
          <span className={styles.hidden}>{label}</span>
        </>
      ) : (
        children
      )}
    </kbd>
  );
}

/** Several keys pressed together, joined by a printed plus that is read out as a word. */
export function KbdCombo({ keys, joinLabel = messages.kbdJoin, className, style, ...rest }: KbdComboProps) {
  return (
    <kbd data-component="KbdCombo" className={cx(styles.combo, className)} style={style} {...rest}>
      {keys.map((key, i) => (
        <Fragment key={i}>
          {i > 0 && (
            <>
              <span className={styles.join} aria-hidden="true">+</span>
              <span className={styles.hidden}>{joinLabel}</span>
            </>
          )}
          <Kbd>{key}</Kbd>
        </Fragment>
      ))}
    </kbd>
  );
}
