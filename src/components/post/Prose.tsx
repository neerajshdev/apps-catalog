import type { ReactNode } from 'react';
import styles from './Prose.module.css';

/** Typographic wrapper for hand-written post copy. */
export default function Prose({ children }: { children: ReactNode }) {
  return <div className={styles['prose']}>{children}</div>;
}
