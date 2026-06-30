import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../components/Spinner';
import { Sidebar } from '../../components/Sidebar';
import { DriveTopbar } from '../../components/DriveTopbar';
import { DriveContent } from '../../components/DriveContent';
import { useFolders } from '../../hooks/useFolders';
import { useFiles } from '../../hooks/useFiles';
import type { ViewMode } from '../../components/DriveTopbar';
import styles from './ExplorerPage.module.scss';

const ExplorerPage = (): React.JSX.Element => {
  const { folderId } = useParams<{ folderId?: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentFolder, subfolders, files, breadcrumb, isLoading } = useFolders(folderId);
  const { uploadFile } = useFiles(folderId);

  const handleUpload = (): void => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
      e.target.value = '';
    }
  };

  const folderName = folderId ? (currentFolder?.name ?? '') : 'Mi Drive';

  return (
    <div className={styles['explorer']}>
      <Sidebar />

      <div className={styles['explorer__main']}>
        <DriveTopbar
          breadcrumb={breadcrumb}
          viewMode={viewMode}
          onViewChange={setViewMode}
          onUpload={handleUpload}
        />

        {isLoading ? (
          <div className={styles['explorer__loading']}>
            <Spinner size="lg" />
          </div>
        ) : (
          <DriveContent
            folderName={folderName}
            subfolders={subfolders}
            files={files}
            viewMode={viewMode}
            onNewFolder={() => {}}
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className={styles['explorer__file-input']}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ExplorerPage;
