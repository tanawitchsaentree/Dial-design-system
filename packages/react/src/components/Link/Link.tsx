import {
  cloneElement,
  forwardRef,
  isValidElement,
  type AnchorHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { messages } from '../../messages';
import { Icon } from '../Icon';
import styles from './Link.module.css';

export type LinkVariant = 'inline' | 'standalone';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  /** The words of the link, or with `asChild` one element such as a router link. Name where it goes, such as "heating rules". */
  children: ReactNode;
  /** `inline` (default) stands inside a sentence and takes its size and line height. `standalone` stands on its own line and is 44px tall. */
  variant?: LinkVariant;
  /** The link leaves the app. Prints the dot-matrix mark at its end, opens a new tab with `rel="noopener noreferrer"`, and announces the new tab. Your own `target` and `rel` win. */
  external?: boolean;
  /** The name of the external mark for assistive tech. Pass your own for another language. Defaults to "Opens in a new tab". */
  externalLabel?: string;
  /** The person has already been there. Prints the words one ink step lighter with a dotted rule. The browser also steps the ink on its own for visited URLs, but cannot change the rule, so a router sets this. */
  visited?: boolean;
  /** Hand the link styles to your own child, such as a router link, instead of printing an anchor. */
  asChild?: boolean;
  /** Class name for the link. */
  className?: string;
}

/** A reference to somewhere else: ink words with a thin rule under them, in a sentence or on its own line. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { children, variant = 'inline', external, externalLabel = messages.link.external, visited, asChild, className, target, rel, ...rest },
  ref,
) {
  const mark = external ? <Icon name="share" size="sm" label={externalLabel} className={styles.mark} /> : null;
  const props = {
    ref,
    'data-component': 'Link',
    'data-visited': visited ? '' : undefined,
    target: target ?? (external ? '_blank' : undefined),
    rel: rel ?? (external ? 'noopener noreferrer' : undefined),
    ...rest,
  };
  const cls = cx(styles.link, variant === 'standalone' && styles.standalone, className);
  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string; children?: ReactNode }>;
    return cloneElement(
      child,
      { ...props, className: cx(cls, child.props.className) } as Record<string, unknown>,
      child.props.children,
      mark,
    );
  }
  return <a {...props} className={cls}>{children}{mark}</a>;
});
