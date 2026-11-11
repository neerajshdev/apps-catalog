import { IconCheck } from '@/components/Icons';
import styles from './FeatureList.module.css';

/** Checkmark list for a short set of concrete capabilities. */
export default function FeatureList({ items }: { items: string[] }) {
  if (items.length === 0) return null;

  return (
    <ul className={styles['features']}>
      {items.map((item) => (
        <li key={item} className={styles['feature']}>
          <span className={styles['feature-icon']} aria-hidden="true">
            <IconCheck size={16} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
