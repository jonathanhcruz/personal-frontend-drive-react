import { HiDotsVertical } from 'react-icons/hi';
import { EXTENSION_COLORS, DEFAULT_BADGE_COLOR } from './constants';
import styles from './FileItem.module.scss';
import type { FileItemProps } from './FileItem.types';

const getExtension = (name: string): string => {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
};

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

const formatDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

export const FileItem = ({ file, onOptions }: FileItemProps): React.JSX.Element => {
  const ext = getExtension(file.name);
  const badgeColor = EXTENSION_COLORS[ext] ?? DEFAULT_BADGE_COLOR;

  const handleOptionsClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    onOptions(file.id);
  };

  return (
    <div className={styles['file-item']}>
      <div className={styles['file-item__header']}>
        <span
          className={styles['file-item__badge']}
          style={{ backgroundColor: badgeColor }}
        >
          {ext.toUpperCase() || '—'}
        </span>
        <button
          type="button"
          className={styles['file-item__menu-btn']}
          onClick={handleOptionsClick}
          aria-label="Opciones de archivo"
        >
          <HiDotsVertical />
        </button>
      </div>

      <div className={styles['file-item__info']}>
        <span className={styles['file-item__name']}>{file.name}</span>
        <span className={styles['file-item__meta']}>
          {formatSize(file.size)} · {formatDate(file.createdAt)}
        </span>
      </div>
    </div>
  );
};
