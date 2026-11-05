import {
  createContext,
  forwardRef,
  useContext,
  useId,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cx } from '../../cx';
import { Divider } from '../Divider';
import { Heading, type HeadingLevel } from '../Heading';
import { Stack } from '../Stack';
import { Text } from '../Text';
import styles from './SettingsLayout.module.css';

/** The ids a row hands to the part inside it, so the part can name itself from the row's printing. */
export interface SettingsRowIds {
  /** Id of the row's name. Pass it to the part as `aria-labelledby`. */
  labelId: string;
  /** Id of the row's small print, or undefined when the row has none. Pass it to the part as `aria-describedby`. */
  descriptionId: string | undefined;
}

const LevelContext = createContext<HeadingLevel>(2);

export interface SettingsLayoutProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The page title, printed at the top. It names the whole layout for assistive tech, so it is required. */
  title: ReactNode;
  /** A line of small print under the title. It is read out as the layout's description. */
  description?: ReactNode;
  /** Heading level of the title, 1 to 3. Section headings take the next level down. Default 1. */
  titleLevel?: 1 | 2 | 3;
  /** The sections, as `SettingsSection` elements. */
  children: ReactNode;
  /** Class name for the layout. */
  className?: string;
  /** Inline style for the layout. */
  style?: CSSProperties;
}

/** A settings page: a titled column of sections, each a printed box of rows, a name on the start side and its part on the end. */
export const SettingsLayout = forwardRef<HTMLElement, SettingsLayoutProps>(function SettingsLayout(
  { title, description, titleLevel = 1, children, className, style, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const auto = useId();
  const titleId = `${auto}-title`;
  const descId = `${auto}-description`;
  const described = [description != null ? descId : null, describedBy].filter(Boolean).join(' ') || undefined;
  return (
    <LevelContext.Provider value={Math.min(titleLevel + 1, 4) as HeadingLevel}>
      <section
        ref={ref}
        data-component="SettingsLayout"
        aria-labelledby={titleId}
        aria-describedby={described}
        className={cx(styles.root, className)}
        style={style}
        {...rest}
      >
        <Stack gap="xs">
          <Heading id={titleId} level={titleLevel} className={styles.title}>{title}</Heading>
          {description != null && (
            <Text id={descId} size="label" tone="secondary" className={styles.intro}>{description}</Text>
          )}
        </Stack>
        <Stack gap="xl">{children}</Stack>
      </section>
    </LevelContext.Provider>
  );
});

export interface SettingsSectionProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The section's name, printed above its box. It is also the region's accessible name, so it is required. */
  heading: ReactNode;
  /** A note under the heading. It is read out as the region's description. */
  description?: ReactNode;
  /** The rows, as `SettingsRow` elements. */
  children: ReactNode;
  /** Class name for the section. */
  className?: string;
  /** Inline style for the section. */
  style?: CSSProperties;
}

/** One group of settings: a heading on the inset line and a hairline box of rows parted by seams. */
export const SettingsSection = forwardRef<HTMLElement, SettingsSectionProps>(function SettingsSection(
  { heading, description, children, className, style, 'aria-describedby': describedBy, ...rest },
  ref,
) {
  const level = useContext(LevelContext);
  const auto = useId();
  const headingId = `${auto}-heading`;
  const descId = `${auto}-description`;
  const described = [description != null ? descId : null, describedBy].filter(Boolean).join(' ') || undefined;
  return (
    <section
      ref={ref}
      data-component="SettingsSection"
      aria-labelledby={headingId}
      aria-describedby={described}
      className={cx(styles.section, className)}
      style={style}
      {...rest}
    >
      <Heading id={headingId} level={level} className={styles.sectionHeading}>{heading}</Heading>
      {description != null && (
        <Text id={descId} size="caption" tone="secondary" className={styles.sectionIntro}>{description}</Text>
      )}
      <div role="list" className={styles.box}>{children}</div>
    </section>
  );
});

export interface SettingsRowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The setting's name, printed on the start side. It names the part, so it is required. */
  label: ReactNode;
  /** The setting's small print, under the name. */
  description?: ReactNode;
  /** The `id` of a native field in the row. The name then becomes its `<label>`. Leave it out for a switch, a select or any custom part. */
  htmlFor?: string;
  /** Fades the name and small print. Disable the part inside yourself; the row cannot reach into it. */
  disabled?: boolean;
  /** The part that sets the value, shown on the end side. Pass a function to receive the name and description ids and point the part at them; a plain node is wrapped in a group named by the row. */
  children: ReactNode | ((ids: SettingsRowIds) => ReactNode);
  /** Class name for the row. */
  className?: string;
  /** Inline style for the row. */
  style?: CSSProperties;
}

/** One setting: a name and small print on the start side and the part that sets it on the end, dropping under the name when narrow. */
export const SettingsRow = forwardRef<HTMLDivElement, SettingsRowProps>(function SettingsRow(
  { label, description, htmlFor, disabled = false, children, className, style, ...rest },
  ref,
) {
  const auto = useId();
  const labelId = `${auto}-label`;
  const descId = description != null ? `${auto}-description` : undefined;
  const isFn = typeof children === 'function';
  return (
    <div
      ref={ref}
      role="listitem"
      data-component="SettingsRow"
      data-disabled={disabled ? '' : undefined}
      className={cx(styles.row, className)}
      style={style}
      {...rest}
    >
      <Divider decorative className={styles.seam} />
      <div className={styles.text}>
        <Text as={htmlFor ? 'label' : 'div'} htmlFor={htmlFor} id={labelId} className={styles.label}>{label}</Text>
        {description != null && (
          <Text id={descId} size="caption" tone="secondary" className={styles.description}>{description}</Text>
        )}
      </div>
      {isFn ? (
        <div className={styles.control}>{(children as (ids: SettingsRowIds) => ReactNode)({ labelId, descriptionId: descId })}</div>
      ) : (
        <div role="group" aria-labelledby={labelId} aria-describedby={descId} className={styles.control}>
          {children}
        </div>
      )}
    </div>
  );
});
