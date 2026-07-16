import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiX, HiDownload } from 'react-icons/hi';
import { Spinner } from '../Spinner';
import { Button } from '../Button';
import { useFileBlob } from '../../hooks/useFileBlob';
import type { FilePreviewModalProps } from './FilePreviewModal.types';
import styles from './FilePreviewModal.module.scss';

export const FilePreviewModal = ({
  isOpen,
  onClose,
  file,
  onDownload,
}: FilePreviewModalProps): React.JSX.Element | null => {
  const { blobUrl, isLoading, error } = useFileBlob(isOpen && file ? file.id : null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !file) return null;

  return createPortal(
    <div className={styles['file-preview']} onClick={onClose} role="dialog" aria-modal>
      <div className={styles['file-preview__panel']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['file-preview__header']}>
          <span className={styles['file-preview__title']}>{file.name}</span>
          <div className={styles['file-preview__actions']}>
            <Button
              label="Descargar"
              variant="ghost"
              size="sm"
              iconStart={<HiDownload />}
              onClick={onDownload}
            />
            <button className={styles['file-preview__close']} onClick={onClose} aria-label="Cerrar">
              <HiX />
            </button>
          </div>
        </div>

        <div className={styles['file-preview__body']}>
          {isLoading && (
            <div className={styles['file-preview__loading']}>
              <Spinner size="md" />
            </div>
          )}

          {error && !isLoading && (
            <div className={styles['file-preview__error']}>
              <p>No se pudo cargar la vista previa</p>
              <Button label="Descargar" variant="secondary" size="sm" onClick={onDownload} />
            </div>
          )}

          {blobUrl && !error && (
            <img
              src={blobUrl}
              alt={file.name}
              className={styles['file-preview__image']}
            />
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
