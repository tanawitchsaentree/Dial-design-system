import { forwardRef, useCallback, useRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../../cx';
import { useIsoLayoutEffect } from '../../spring';
import styles from './Card.module.css';

export type CardElement = 'div' | 'section' | 'article' | 'li';
export type CardPadding = 'sm' | 'md' | 'lg' | 'unit';

/** The measured border box of a card, in px. `short` is the smaller of the two sides. */
export interface CardBox {
  inline: number;
  block: number;
  short: number;
}

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. Use `div` (default), `section` or `article` for a unit with its own heading, `li` inside a list of cards. */
  as?: CardElement;
  /** The inset from the edge of the body to its content. `sm` 16px for small cards in a list, `md` (default) gap.inset (24px), `lg` 32px for a large panel, `unit` corner.inset-ratio (0.077) of the short side, like anchor A. */
  padding?: CardPadding;
  /** A title row on the top inset line, such as a Heading with a Text or a key at its end. */
  header?: ReactNode;
  /** A row of actions at the bottom of the body, above the printed labels. */
  footer?: ReactNode;
  /** The wordmark printed bottom-left on the inset line, such as "dial". */
  wordmark?: ReactNode;
  /** The model name printed bottom-right on the inset line. It is set in lowercase and is never the only name of the card. */
  model?: ReactNode;
  /** Called with the body's measured size whenever it changes, so parts can be sized from the unit (for example a Rotary's `unitSide`). */
  onMeasure?: (box: CardBox) => void;
}

function assign<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value);
  else if (ref) (ref as { current: T }).current = value;
}

/** The body of a unit: one rounded rectangle of matte plastic whose corner follows its short side, lit from the top left. */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as: Tag = 'div', padding = 'md', header, footer, wordmark, model, onMeasure, className, children, ...rest },
  ref,
) {
  const node = useRef<HTMLElement | null>(null);
  const measure = useRef(onMeasure);
  measure.current = onMeasure;
  const setRef = useCallback((el: HTMLElement | null) => { node.current = el; assign(ref, el); }, [ref]);

  // the radius and the `unit` inset follow the short side, so the body is measured, not guessed
  useIsoLayoutEffect(() => {
    const el = node.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let last = -1;
    const update = () => {
      const r = el.getBoundingClientRect();
      const box = { inline: Math.round(r.width), block: Math.round(r.height), short: Math.round(Math.min(r.width, r.height)) };
      if (box.short !== last) { last = box.short; el.style.setProperty('--card-short', `${box.short}px`); }
      measure.current?.(box);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const labels = wordmark != null || model != null;
  return (
    <Tag
      ref={setRef as never}
      data-component="Card"
      data-padding={padding}
      className={cx(styles.root, styles[padding], className)}
      {...rest}
    >
      {header != null && <div className={styles.header}>{header}</div>}
      {children != null && <div className={styles.body}>{children}</div>}
      {footer != null && <div className={styles.footer}>{footer}</div>}
      {labels && (
        <div className={styles.labels}>
          {wordmark != null && <span className={styles.wordmark}>{wordmark}</span>}
          {model != null && <span className={styles.model}>{model}</span>}
        </div>
      )}
    </Tag>
  );
});
