import { HiFolder, HiDotsVertical } from 'react-icons/hi';
import styles from './FolderItem.module.scss';
import type { FolderItemProps } from './FolderItem.types';

export const FolderItem = ({ folder, onClick, onOptions, viewMode = 'grid' }: FolderItemProps): React.JSX.Element => {
  const handleOptionsClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    onOptions(folder.id, { x: rect.left, y: rect.bottom + 4 });
  };

  return (
    <div
      className={[
        styles['folder-item'],
        viewMode === 'list' ? styles['folder-item--list'] : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => onClick(folder.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(folder.id)}
    >
      <div className={styles['folder-item__body']}>
        <span className={styles['folder-item__icon']}>
          <HiFolder />
        </span>
        <div className={styles['folder-item__info']}>
          <span className={styles['folder-item__name']}>{folder.name}</span>
        </div>
      </div>

      <button
        type="button"
        className={styles['folder-item__menu-btn']}
        onClick={handleOptionsClick}
        aria-label="Opciones de carpeta"
      >
        <HiDotsVertical />
      </button>
    </div>
  );
};
