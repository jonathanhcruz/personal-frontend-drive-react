import { useEffect, useState } from 'react';
import { HiClipboardCopy, HiTrash } from 'react-icons/hi';
import { Modal } from '../Modal/Modal';
import { Button } from '../Button';
import { useShare } from '../../hooks/useShare';
import { getPublicDownloadUrl } from '../../services/share.service';
import type { SharePanelProps } from './SharePanel.types';
import styles from './SharePanel.module.scss';

const fmt = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short', year: 'numeric' });

export const SharePanel = ({ isOpen, onClose, fileId, fileName }: SharePanelProps): React.JSX.Element => {
  const { shares, isLoadingShares, createShare, isCreatingShare, revokeShare, isRevoking } =
    useShare(fileId);

  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCreatedUrl(null);
    setCopied(false);
  }, [fileId]);

  const handleCreate = (): void => {
    createShare(undefined, {
      onSuccess: (data) => setCreatedUrl(getPublicDownloadUrl(data.token)),
    });
  };

  const handleCopy = (url: string): void => {
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Compartir archivo">
      <p className={styles['share-panel__filename']}>{fileName}</p>

      <section className={styles['share-panel__section']}>
        <span className={styles['share-panel__section-label']}>ENLACES ACTIVOS</span>

        {isLoadingShares ? (
          <p className={styles['share-panel__empty']}>Cargando...</p>
        ) : shares.length === 0 && !createdUrl ? (
          <p className={styles['share-panel__empty']}>Sin enlaces activos</p>
        ) : (
          <ul className={styles['share-panel__list']}>
            {shares.map((share) => (
              <li key={share.id} className={styles['share-panel__item']}>
                <div className={styles['share-panel__item-meta']}>
                  <span>Creado {fmt.format(new Date(share.createdAt))}</span>
                  <span className={styles['share-panel__item-expiry']}>
                    Expira {fmt.format(new Date(share.expiresAt))}
                  </span>
                </div>
                <button
                  type="button"
                  className={styles['share-panel__revoke-btn']}
                  onClick={() => revokeShare(share.id)}
                  disabled={isRevoking}
                  aria-label="Revocar enlace"
                >
                  <HiTrash />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {createdUrl && (
        <div className={styles['share-panel__new-link']}>
          <span className={styles['share-panel__section-label']}>NUEVO ENLACE</span>
          <div className={styles['share-panel__new-link-row']}>
            <input
              readOnly
              value={createdUrl}
              className={styles['share-panel__new-link-input']}
              onFocus={(e) => e.target.select()}
            />
            <button
              type="button"
              className={styles['share-panel__copy-btn']}
              onClick={() => handleCopy(createdUrl)}
              aria-label="Copiar enlace"
            >
              <HiClipboardCopy />
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
        </div>
      )}

      <Button label="Crear enlace" onClick={handleCreate} loading={isCreatingShare} variant="primary" />
    </Modal>
  );
};
