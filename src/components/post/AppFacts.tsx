import type { AppFact, Platform } from '@/types/post';
import { PlatformChips } from './Tags';
import styles from './AppFacts.module.css';

interface AppFactsProps {
  facts: AppFact[];
  platforms: Platform[];
}

/**
 * Label/value row for release facts (version, price, size, ...).
 * The list is passed in per post, so each post only shows what applies to it.
 */
export default function AppFacts({ facts, platforms }: AppFactsProps) {
  return (
    <dl className={styles['app-facts']}>
      {facts.map((fact) => (
        <div key={fact.label} className={styles['app-fact']}>
          <dt className={styles['app-fact-label']}>{fact.label}</dt>
          <dd className={styles['app-fact-value']}>{fact.value}</dd>
        </div>
      ))}

      <div className={styles['app-fact']}>
        <dt className={styles['app-fact-label']}>Platforms</dt>
        <dd className={styles['app-fact-value']}>
          <PlatformChips platforms={platforms} />
        </dd>
      </div>
    </dl>
  );
}
