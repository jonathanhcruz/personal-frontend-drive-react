import { HiCheck, HiX, HiExclamation } from 'react-icons/hi';
import type { UploadItem, UploadPanelProps } from './UploadPanel.types';
import styles from './UploadPanel.module.scss';

const StatusIcon = ({ item }: { item: UploadItem }): React.JSX.Element => {
  if (item.status === 'done') return <HiCheck className={styles['upload-panel__icon--done']} />;
  if (item.status === 'error') return <HiExclamation className={styles['upload-panel__icon--error']} />;
  return <span className={styles['upload-panel__spinner']} aria-hidden="true" />;
};

export const UploadPanel = ({ items, isVisible, onClose }: UploadPanelProps): React.JSX.Element | null => {
  if (!isVisible) return null;

  const uploading = items.filter((i) => i.status === 'uploading').length;
  const done = items.filter((i) => i.status === 'done').length;
  const errors = items.filter((i) => i.status === 'error').length;

  const headerText =
    uploading > 0
      ? `Subiendo ${uploading} ${uploading === 1 ? 'archivo' : 'archivos'}…`
      : errors > 0
        ? `${done} subidos · ${errors} con error`
        : `${done} ${done === 1 ? 'archivo subido' : 'archivos subidos'}`;

  return (
    <div className={styles['upload-panel']} role="status" aria-live="polite">
      <div className={styles['upload-panel__header']}>
        <span className={styles['upload-panel__title']}>{headerText}</span>
        <button
          type="button"
          className={styles['upload-panel__close']}
          onClick={onClose}
          aria-label="Cerrar panel de subida"
        >
          <HiX />
        </button>
      </div>

      <ul className={styles['upload-panel__list']}>
        {items.map((item) => (
          <li key={item.id} className={styles['upload-panel__item']}>
            <div className={styles['upload-panel__item-top']}>
              <span className={styles['upload-panel__name']}>{item.name}</span>
              <StatusIcon item={item} />
            </div>

            {item.status === 'uploading' && (
              <div className={styles['upload-panel__bar']}>
                <div
                  className={styles['upload-panel__bar-fill']}
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}

            {item.status === 'error' && item.error && (
              <p className={styles['upload-panel__error']}>{item.error}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
