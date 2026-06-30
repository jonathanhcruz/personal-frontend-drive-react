import { HiFolder, HiDotsVertical } from 'react-icons/hi';
import styles from './FolderItem.module.scss';
import type { FolderItemProps } from './FolderItem.types';

export const FolderItem = ({ folder, onClick, onOptions }: FolderItemProps): React.JSX.Element => {
  const handleOptionsClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onOptions(folder.id);
  };

  return (
    <div className={styles['folder-item']} onClick={() => onClick(folder.id)} role="button" tabIndex={0}
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
