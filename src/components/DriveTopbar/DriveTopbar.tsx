import { HiChevronRight, HiSearch, HiViewGrid, HiViewList, HiUpload } from 'react-icons/hi';
import { Button } from '../Button';
import styles from './DriveTopbar.module.scss';
import type { DriveTopbarProps } from './DriveTopbar.types';

export const DriveTopbar = ({
  breadcrumb,
  viewMode,
  onViewChange,
  onUpload,
}: DriveTopbarProps): React.JSX.Element => {
  return (
    <header className={styles['drive-topbar']}>
      <nav className={styles['drive-topbar__breadcrumb']}>
        <span className={styles['drive-topbar__breadcrumb-item']}>Raíz</span>
        {breadcrumb.map((item) => (
          <span key={item.id} className={styles['drive-topbar__breadcrumb-segment']}>
            <HiChevronRight className={styles['drive-topbar__breadcrumb-sep']} />
            <span className={styles['drive-topbar__breadcrumb-item']}>{item.name}</span>
          </span>
        ))}
      </nav>

      <div className={styles['drive-topbar__search']}>
        <HiSearch className={styles['drive-topbar__search-icon']} />
        <input
          className={styles['drive-topbar__search-input']}
          type="text"
          placeholder="Buscar..."
          disabled
        />
      </div>

      <div className={styles['drive-topbar__actions']}>
        <div className={styles['drive-topbar__view-toggle']}>
          <button
            type="button"
            className={[
              styles['drive-topbar__view-btn'],
              viewMode === 'grid' ? styles['drive-topbar__view-btn--active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onViewChange('grid')}
            aria-label="Vista cuadrícula"
          >
            <HiViewGrid />
          </button>
          <button
            type="button"
            className={[
              styles['drive-topbar__view-btn'],
              viewMode === 'list' ? styles['drive-topbar__view-btn--active'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onViewChange('list')}
            aria-label="Vista lista"
          >
            <HiViewList />
          </button>
        </div>

        <Button label="Subir" iconStart={<HiUpload />} onClick={onUpload} />

        <div className={styles['drive-topbar__avatar']}>JL</div>
      </div>
    </header>
  );
};
