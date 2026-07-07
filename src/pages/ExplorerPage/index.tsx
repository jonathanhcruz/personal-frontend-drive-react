import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { HiDownload, HiPencilAlt, HiShare, HiTrash } from 'react-icons/hi';
import { Spinner } from '../../components/Spinner';
import { DriveContent } from '../../components/DriveContent';
import { CreateFolderModal, DeleteModal, RenameModal } from '../../components/Modal';
import { SharePanel } from '../../components/SharePanel';
import { ContextMenu } from '../../components/ContextMenu';
import { useFolders } from '../../hooks/useFolders';
import { useFiles } from '../../hooks/useFiles';
import { useTopbar } from '../../hooks/useTopbar';
import type { ViewMode } from '../../types/api.types';
import type { MenuItem } from '../../components/ContextMenu';
import { BreadcrumbNav } from './BreadcrumbNav';
import { ExplorerTopbarActions } from './ExplorerTopbarActions';
import styles from './ExplorerPage.module.scss';

type ModalState =
  | { type: 'create-folder' }
  | { type: 'rename-folder'; id: string; name: string }
  | { type: 'delete-folder'; id: string; name: string }
  | { type: 'delete-file'; id: string; name: string }
  | { type: 'share-file'; id: string; name: string }
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
    deleteFolder,
    isDeleting,
  } = useFolders(folderId);

  const activeFolderId = currentFolder?.id;

  const { uploadFile, deleteFile, isDeletingFile, downloadFile } = useFiles(activeFolderId);

  const handleUpload = (): void => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
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
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
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

      <SharePanel
        isOpen={modal?.type === 'share-file'}
        onClose={closeModal}
        fileId={modal?.type === 'share-file' ? modal.id : ''}
        fileName={modal?.type === 'share-file' ? modal.name : ''}
      />
    </>
  );
};

export default ExplorerPage;
