/**
 * FILE:   src/shared/components/Spinner/Spinner.tsx   (+ Spinner.module.css, Spinner.data.json)
 * LAYER:  shared
 * STATUS: implemented
 * ANATOMY: structure (.tsx) + presentation (.module.css) + data (.data.json). No logic hook needed.
 *
 * PURPOSE
 *   The single loading indicator: session bootstrap, lazy route chunks (HydrateFallback), buttons.
 *
 * CONTENT
 *   <Spinner size="sm|md|lg" labelKey="loading" />
 *   - Accessible: role="status" + visually hidden label (common namespace key, default `loading`).
 *   - Motion: under prefers-reduced-motion the rotation slows down (2 s per turn) instead of
 *     freezing, so the indicator still reads as "busy" (Spinner.module.css).
 *   - Named export (lint).
 *
 * EXPORTS
 *   function Spinner, interface ISpinnerProps
 *
 * USED BY
 *   routes/router.tsx (HydrateFallback, SessionGate), feature buttons in a loading state.
 *
 * MAY IMPORT
 *   react-i18next, ./Spinner.module.css, ./Spinner.data.json.
 */
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import data from './Spinner.data.json';
import styles from './Spinner.module.css';

export interface ISpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  labelKey?: string;
}

export function Spinner({ size = 'md', labelKey = data.labelKey }: ISpinnerProps): ReactElement {
  const { t } = useTranslation('common');
  return (
    <span role="status" className={styles.root}>
      <span className={`${styles.spinner} ${styles[size]}`} aria-hidden="true" />
      <span className={styles.visuallyHidden}>{t(labelKey)}</span>
    </span>
  );
}
