import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiDownload, HiPencilAlt, HiShare, HiSwitchHorizontal, HiTrash } from 'react-icons/hi';
import { Spinner } from '../../components/Spinner';
import { DriveContent } from '../../components/DriveContent';
import { CreateFolderModal, DeleteModal, RenameModal } from '../../components/Modal';
import { FolderPickerModal } from '../../components/FolderPickerModal';
import { FilePreviewModal } from '../../components/FilePreviewModal';
import { SharePanel } from '../../components/SharePanel';
import { ContextMenu } from '../../components/ContextMenu';
import { useFolders } from '../../hooks/useFolders';
import { useFiles } from '../../hooks/useFiles';
import { useUploadQueue } from '../../hooks/useUploadQueue';
import { UploadPanel } from '../../components/UploadPanel';
import { useTopbar } from '../../hooks/useTopbar';
import type { FolderFile, ViewMode } from '../../types/api.types';
import type { MenuItem } from '../../components/ContextMenu';
import { BreadcrumbNav } from '../../components/BreadcrumbNav';
import { ExplorerTopbarActions } from '../../components/ExplorerTopbarActions';
import styles from './ExplorerPage.module.scss';

type ModalState =
  | { type: 'create-folder' }
  | { type: 'rename-folder'; id: string; name: string }
  | { type: 'rename-file'; id: string; name: string }
  | { type: 'move-file'; id: string }
  | { type: 'move-folder'; id: string }
  | { type: 'delete-folder'; id: string; name: string }
  | { type: 'delete-file'; id: string; name: string }
  | { type: 'share-file'; id: string; name: string }
  | { type: 'preview-file'; file: FolderFile }
  | null;

type ContextMenuState = {
  id: string;
  itemType: 'folder' | 'file';
  name: string;
  position: { x: number; y: number };
} | null;

const ExplorerPage = (): React.JSX.Element => {
  const { folderId } = useParams<{ folderId?: string }>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [modal, setModal] = useState<ModalState>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
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
    moveFolder,
    isMovingFolder,
    deleteFolder,
    isDeleting,
  } = useFolders(folderId);

  const activeFolderId = currentFolder?.id;

  const { deleteFile, isDeletingFile, downloadFile, renameFile, isRenamingFile, moveFile, isMovingFile } = useFiles(folderId);
  const { items: uploadItems, enqueue, clearCompleted } = useUploadQueue();

  const handleUpload = (): void => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0 && activeFolderId) {
      enqueue(e.target.files, activeFolderId, folderId);
      e.target.value = '';
    }
  };

  const handleOptions = (
    id: string,
    itemType: 'folder' | 'file',
    position: { x: number; y: number },
  ): void => {
    const name =
      itemType === 'folder'
        ? (subfolders.find((f) => f.id === id)?.name ?? '')
        : (files.find((f) => f.id === id)?.name ?? '');
    setContextMenu({ id, itemType, name, position });
  };

  const closeModal = (): void => setModal(null);
  const closeContextMenu = (): void => setContextMenu(null);

  const folderMenuItems: MenuItem[] = contextMenu
    ? [
        {
          label: 'Renombrar',
          icon: <HiPencilAlt />,
          onClick: () => setModal({ type: 'rename-folder', id: contextMenu.id, name: contextMenu.name }),
        },
        {
          label: 'Mover a...',
          icon: <HiSwitchHorizontal />,
          onClick: () => setModal({ type: 'move-folder', id: contextMenu.id }),
        },
        {
          label: 'Eliminar',
          icon: <HiTrash />,
          variant: 'danger',
          onClick: () => setModal({ type: 'delete-folder', id: contextMenu.id, name: contextMenu.name }),
        },
      ]
    : [];

  const fileMenuItems: MenuItem[] = contextMenu
    ? [
        {
          label: 'Renombrar',
          icon: <HiPencilAlt />,
          onClick: () => setModal({ type: 'rename-file', id: contextMenu.id, name: contextMenu.name }),
        },
        {
          label: 'Mover a...',
          icon: <HiSwitchHorizontal />,
          onClick: () => setModal({ type: 'move-file', id: contextMenu.id }),
        },
        {
          label: 'Compartir',
          icon: <HiShare />,
          onClick: () => setModal({ type: 'share-file', id: contextMenu.id, name: contextMenu.name }),
        },
        {
          label: 'Descargar',
          icon: <HiDownload />,
          onClick: () => downloadFile({ id: contextMenu.id, name: contextMenu.name }),
        },
        {
          label: 'Eliminar',
          icon: <HiTrash />,
          variant: 'danger',
          onClick: () => setModal({ type: 'delete-file', id: contextMenu.id, name: contextMenu.name }),
        },
      ]
    : [];

  const folderName = folderId ? (currentFolder?.name ?? '') : 'Mi Drive';

  useTopbar({
    left: <BreadcrumbNav breadcrumb={breadcrumb} />,
    right: (
      <ExplorerTopbarActions
        viewMode={viewMode}
        onViewChange={setViewMode}
        onUpload={handleUpload}
      />
    ),
  });

  return (
    <>
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
          onOptions={handleOptions}
          onPreview={(file) => {
            if (file.mimeType.startsWith('image/')) setModal({ type: 'preview-file', file });
          }}
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className={styles['explorer__file-input']}
        onChange={handleFileChange}
      />

      <ContextMenu
        isOpen={contextMenu !== null}
        onClose={closeContextMenu}
        position={contextMenu?.position ?? { x: 0, y: 0 }}
        items={contextMenu?.itemType === 'file' ? fileMenuItems : folderMenuItems}
      />

      <CreateFolderModal
        isOpen={modal?.type === 'create-folder'}
        onClose={closeModal}
        onCreate={(name) => createFolder({ name, parentId: activeFolderId ?? null })}
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

      <RenameModal
        isOpen={modal?.type === 'rename-file'}
        onClose={closeModal}
        currentName={modal?.type === 'rename-file' ? modal.name : ''}
        onRename={(name) => {
          if (modal?.type === 'rename-file') renameFile({ id: modal.id, name });
        }}
        isLoading={isRenamingFile}
      />

      <DeleteModal
        isOpen={modal?.type === 'delete-folder' || modal?.type === 'delete-file'}
        onClose={closeModal}
        name={modal?.type === 'delete-folder' || modal?.type === 'delete-file' ? modal.name : ''}
        type={modal?.type === 'delete-file' ? 'file' : 'folder'}
        onDelete={() => {
          if (modal?.type === 'delete-folder') deleteFolder({ id: modal.id, recursive: true });
          if (modal?.type === 'delete-file') deleteFile(modal.id);
          closeModal();
        }}
        isLoading={modal?.type === 'delete-folder' ? isDeleting : isDeletingFile}
      />

      <UploadPanel
        items={uploadItems}
        isVisible={uploadItems.length > 0}
        onClose={clearCompleted}
      />

      <SharePanel
        isOpen={modal?.type === 'share-file'}
        onClose={closeModal}
        fileId={modal?.type === 'share-file' ? modal.id : ''}
        fileName={modal?.type === 'share-file' ? modal.name : ''}
      />

      <FilePreviewModal
        isOpen={modal?.type === 'preview-file'}
        onClose={closeModal}
        file={modal?.type === 'preview-file' ? modal.file : null}
        onDownload={() => {
          if (modal?.type === 'preview-file') downloadFile({ id: modal.file.id, name: modal.file.name });
        }}
      />

      <FolderPickerModal
        isOpen={modal?.type === 'move-file' || modal?.type === 'move-folder'}
        onClose={closeModal}
        excludeId={modal?.type === 'move-folder' ? modal.id : undefined}
        isLoading={isMovingFile || isMovingFolder}
        onConfirm={(targetId) => {
          if (modal?.type === 'move-file') moveFile({ id: modal.id, targetFolderId: targetId });
          if (modal?.type === 'move-folder') moveFolder({ id: modal.id, targetParentId: targetId });
        }}
      />
    </>
  );
};

export default ExplorerPage;
