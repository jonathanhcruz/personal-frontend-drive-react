import { HiUpload, HiViewGrid, HiViewList } from 'react-icons/hi';
import { Button } from '../Button';
import type { ExplorerTopbarActionsProps } from './ExplorerTopbarActions.types';
import styles from './ExplorerTopbarActions.module.scss';

export const ExplorerTopbarActions = ({
  viewMode,
  onViewChange,
  onUpload,
}: ExplorerTopbarActionsProps): React.JSX.Element => {
  return (
    <>
      <div className={styles['explorer-topbar-actions__view-toggle']}>
        <button
          type="button"
          className={[
            styles['explorer-topbar-actions__view-btn'],
            viewMode === 'grid' ? styles['explorer-topbar-actions__view-btn--active'] : '',
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
            styles['explorer-topbar-actions__view-btn'],
            viewMode === 'list' ? styles['explorer-topbar-actions__view-btn--active'] : '',
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
    </>
  );
};
