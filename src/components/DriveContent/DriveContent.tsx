import { HiFolderAdd } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Button';
import { FolderItem } from '../FolderItem';
import { FileItem } from '../FileItem';
import styles from './DriveContent.module.scss';
import type { DriveContentProps } from './DriveContent.types';

export const DriveContent = ({
  folderName,
  subfolders,
  files,
  viewMode,
  onNewFolder,
  onOptions,
}: DriveContentProps): React.JSX.Element => {
  const navigate = useNavigate();

  const meta = [
    subfolders.length > 0 ? `${subfolders.length} carpeta${subfolders.length !== 1 ? 's' : ''}` : null,
    files.length > 0 ? `${files.length} archivo${files.length !== 1 ? 's' : ''}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <div className={styles['drive-content']}>
      <div className={styles['drive-content__heading']}>
        <div className={styles['drive-content__heading-info']}>
          <h1 className={styles['drive-content__title']}>{folderName}</h1>
          {meta && <p className={styles['drive-content__meta']}>{meta}</p>}
        </div>
        <Button
          label="Nueva carpeta"
          variant="secondary"
          size="sm"
          iconStart={<HiFolderAdd />}
          onClick={onNewFolder}
        />
      </div>

      {subfolders.length > 0 && (
        <section className={styles['drive-content__section']}>
          <h2 className={styles['drive-content__section-label']}>CARPETAS</h2>
          <div
            className={[
              styles['drive-content__folder-grid'],
              viewMode === 'list' ? styles['drive-content__folder-grid--list'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {subfolders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                onClick={(id) => navigate(`/drive/${id}`)}
                onOptions={(id, pos) => onOptions(id, 'folder', pos)}
                viewMode={viewMode}
              />
            ))}
          </div>
        </section>
      )}

      {files.length > 0 && (
        <section className={styles['drive-content__section']}>
          <h2 className={styles['drive-content__section-label']}>ARCHIVOS</h2>
          <div
            className={[
              styles['drive-content__file-grid'],
              viewMode === 'list' ? styles['drive-content__file-grid--list'] : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {files.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onOptions={(id, pos) => onOptions(id, 'file', pos)}
                viewMode={viewMode}
              />
            ))}
          </div>
        </section>
      )}

      {subfolders.length === 0 && files.length === 0 && (
        <div className={styles['drive-content__empty']}>
          <p className={styles['drive-content__empty-text']}>Esta carpeta está vacía</p>
        </div>
      )}
    </div>
  );
};
