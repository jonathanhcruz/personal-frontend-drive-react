import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../components/Spinner';
import { Sidebar } from '../../components/Sidebar';
import { DriveTopbar } from '../../components/DriveTopbar';
import { DriveContent } from '../../components/DriveContent';
import { CreateFolderModal, DeleteModal, RenameModal } from '../../components/Modal';
import { useFolders } from '../../hooks/useFolders';
import { useFiles } from '../../hooks/useFiles';
import type { ViewMode } from '../../components/DriveTopbar';
import styles from './ExplorerPage.module.scss';

type ModalState =
  | { type: 'create-folder' }
  | { type: 'rename-folder'; id: string; name: string }
  | { type: 'delete-folder'; id: string; name: string }
  | { type: 'delete-file'; id: string; name: string }
  | null;

const ExplorerPage = (): React.JSX.Element => {
  const { folderId } = useParams<{ folderId?: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modal, setModal] = useState<ModalState>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    currentFolder,
    subfolders,
    files,
    breadcrumb,
    isLoading,
    createFolder,
    isCreating,
    renameFolder,
    isRenaming,
    deleteFolder,
    isDeleting,
  } = useFolders(folderId);

  const { uploadFile, deleteFile, isDeletingFile } = useFiles(folderId);

  const handleUpload = (): void => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
      e.target.value = '';
    }
  };

  const closeModal = (): void => setModal(null);

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
            onNewFolder={() => setModal({ type: 'create-folder' })}
          />
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        className={styles['explorer__file-input']}
        onChange={handleFileChange}
      />

      <CreateFolderModal
        isOpen={modal?.type === 'create-folder'}
        onClose={closeModal}
        onCreate={(name) => createFolder({ name, parentId: folderId ?? null })}
        isLoading={isCreating}
      />

      <RenameModal
        isOpen={modal?.type === 'rename-folder'}
        onClose={closeModal}
        currentName={modal?.type === 'rename-folder' ? modal.name : ''}
        onRename={(name) => {
          if (modal?.type === 'rename-folder') renameFolder({ id: modal.id, name });
        }}
        isLoading={isRenaming}
      />

      <DeleteModal
        isOpen={modal?.type === 'delete-folder' || modal?.type === 'delete-file'}
        onClose={closeModal}
        name={modal?.type === 'delete-folder' || modal?.type === 'delete-file' ? modal.name : ''}
        type={modal?.type === 'delete-file' ? 'file' : 'folder'}
        onDelete={() => {
          if (modal?.type === 'delete-folder') deleteFolder({ id: modal.id, recursive: true });
          if (modal?.type === 'delete-file') deleteFile(modal.id);
        }}
        isLoading={modal?.type === 'delete-folder' ? isDeleting : isDeletingFile}
      />
    </div>
  );
};

export default ExplorerPage;
