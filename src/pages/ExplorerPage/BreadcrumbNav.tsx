import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';
import type { BreadcrumbItem } from '../../types/api.types';
import styles from './BreadcrumbNav.module.scss';

interface BreadcrumbNavProps {
  breadcrumb: BreadcrumbItem[];
}

const MAX_VISIBLE = 4;

export const BreadcrumbNav = ({ breadcrumb }: BreadcrumbNavProps): React.JSX.Element => {
  const isAtRoot = breadcrumb.length === 0;
  const isTruncated = breadcrumb.length > MAX_VISIBLE;
  const visibleItems = isTruncated ? breadcrumb.slice((MAX_VISIBLE -1 ) * -1) : breadcrumb;

  return (
    <nav className={styles['breadcrumb-nav']}>
      {isAtRoot ? (
        <span className={`${styles['breadcrumb-nav__item']} ${styles['breadcrumb-nav__item--current']}`}>
          Mi Drive
        </span>
      ) : (
        <Link to="/drive" className={styles['breadcrumb-nav__item']}>
          Mi Drive
        </Link>
      )}

      {isTruncated && (
        <span className={styles['breadcrumb-nav__segment']}>
          <HiChevronRight className={styles['breadcrumb-nav__sep']} />
          <span className={styles['breadcrumb-nav__ellipsis']}>…</span>
        </span>
      )}

      {visibleItems.map((item, index) => {
        const isCurrent = index === visibleItems.length - 1;
        return (
          <span key={item.id} className={styles['breadcrumb-nav__segment']}>
            <HiChevronRight className={styles['breadcrumb-nav__sep']} />
            {isCurrent ? (
              <span className={`${styles['breadcrumb-nav__item']} ${styles['breadcrumb-nav__item--current']}`}>
                {item.name}
              </span>
            ) : (
              <Link to={`/drive/${item.id}`} className={styles['breadcrumb-nav__item']}>
                {item.name}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
};
