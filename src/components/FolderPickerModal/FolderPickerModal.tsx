import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { HiArrowLeft, HiChevronRight, HiFolder } from 'react-icons/hi';
import { Modal } from '../Modal';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import { listRoot, getFolderContents, type RootContents } from '../../services/folders.service';
import type { FolderDto } from '../../types/api.types';
import type { FolderPickerModalProps } from './FolderPickerModal.types';
import styles from './FolderPickerModal.module.scss';

interface HistoryEntry {
  id: string | null;
  name: string;
}

const UNSELECTED = Symbol('unselected');

export const FolderPickerModal = ({
  isOpen,
  onClose,
  onConfirm,
  excludeId,
  isLoading,
}: FolderPickerModalProps): React.JSX.Element => {
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentName, setCurrentName] = useState('Mi Drive');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null | typeof UNSELECTED>(UNSELECTED);

  useEffect(() => {
    if (isOpen) {
      setCurrentFolderId(null);
      setCurrentName('Mi Drive');
      setHistory([]);
      setSelectedId(UNSELECTED);
    }
  }, [isOpen]);

  const { data: rootData, isLoading: isLoadingRoot } = useQuery<RootContents>({
    queryKey: ['folder-picker', 'root'],
    queryFn: listRoot,
    enabled: isOpen && currentFolderId === null,
    staleTime: 0,
  });

  const { data: folderData, isLoading: isLoadingFolder } = useQuery({
    queryKey: ['folder-picker', currentFolderId],
    queryFn: () => getFolderContents(currentFolderId!),
    enabled: isOpen && currentFolderId !== null,
    staleTime: 0,
  });

  const rawSubfolders: FolderDto[] = (currentFolderId === null
    ? rootData?.subfolders
    : folderData?.subfolders) ?? [];

  const subfolders = excludeId
    ? rawSubfolders.filter((f) => f.id !== excludeId)
    : rawSubfolders;

  const isLoadingContent = currentFolderId === null ? isLoadingRoot : isLoadingFolder;

  const navigateInto = (folder: FolderDto): void => {
    setHistory((prev) => [...prev, { id: currentFolderId, name: currentName }]);
    setCurrentFolderId(folder.id);
    setCurrentName(folder.name);
    setSelectedId(UNSELECTED);
  };

  const goBack = (): void => {
    const parent = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setCurrentFolderId(parent.id);
    setCurrentName(parent.name);
    setSelectedId(UNSELECTED);
  };

  const handleConfirm = (): void => {
    if (selectedId === UNSELECTED) return;
    onConfirm(selectedId as string | null);
    onClose();
  };

  const rowClass = (id: string | null): string => {
    const isSelected = selectedId !== UNSELECTED && selectedId === id;
    return [styles['folder-picker__row'], isSelected ? styles['folder-picker__row--selected'] : '']
      .filter(Boolean)
      .join(' ');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mover a"
      footer={
        <>
          <Button label="Cancelar" variant="ghost" size="sm" onClick={onClose} />
          <Button
            label="Mover"
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={selectedId === UNSELECTED}
            loading={isLoading}
          />
        </>
      }
    >
      <div className={styles['folder-picker__nav']}>
        {history.length > 0 && (
          <button className={styles['folder-picker__back']} onClick={goBack}>
            <HiArrowLeft />
            <span>Atrás</span>
          </button>
        )}
        <span className={styles['folder-picker__location']}>{currentName}</span>
      </div>

      <div className={styles['folder-picker__list']}>
        <button className={rowClass(null)} onClick={() => setSelectedId(null)}>
          <HiFolder className={styles['folder-picker__icon']} />
          <span className={styles['folder-picker__label']}>Mi Drive (raíz)</span>
        </button>

        {isLoadingContent ? (
          <div className={styles['folder-picker__loading']}>
            <Spinner size="sm" />
          </div>
        ) : subfolders.length === 0 ? (
          <p className={styles['folder-picker__empty']}>Sin subcarpetas</p>
        ) : (
          subfolders.map((folder) => (
            <div
              key={folder.id}
              className={rowClass(folder.id)}
              onClick={() => setSelectedId(folder.id)}
            >
              <HiFolder className={styles['folder-picker__icon']} />
              <span className={styles['folder-picker__label']}>{folder.name}</span>
              {folder.hasChildren && (
                <button
                  className={styles['folder-picker__navigate']}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateInto(folder);
                  }}
                  aria-label={`Navegar a ${folder.name}`}
                >
                  <HiChevronRight />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};
