import { useState } from 'react';
import { HiDocumentText, HiLink, HiTrash } from 'react-icons/hi';
import { Spinner } from '../../components/Spinner';
import { useTopbar } from '../../hooks/useTopbar';
import { useSharedFiles } from '../../hooks/useSharedFiles';
import { getPublicDownloadUrl } from '../../services/share.service';
import styles from './SharedPage.module.scss';

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

const SharedPage = (): React.JSX.Element => {
  const { shares, isLoading, revokeShare, isRevoking } = useSharedFiles();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useTopbar({ left: <span>Compartidos</span> });

  const handleCopy = (id: string): void => {
    void navigator.clipboard.writeText(getPublicDownloadUrl(id)).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className={styles['shared-page']}>
      {isLoading ? (
        <div className={styles['shared-page__loading']}>
          <Spinner size="lg" />
        </div>
      ) : shares.length === 0 ? (
        <div className={styles['shared-page__empty']}>
          <span className={styles['shared-page__empty-icon']}>
            <HiDocumentText />
          </span>
          <span>No hay archivos compartidos</span>
        </div>
      ) : (
        <ul className={styles['shared-page__list']}>
          {shares.map((share) => {
            const isCopied = copiedId === share.id;
            return (
              <li key={share.id} className={styles['shared-page__item']}>
                <span className={styles['shared-page__icon']}>
                  <HiDocumentText />
                </span>
                <div className={styles['shared-page__info']}>
                  <p className={styles['shared-page__name']}>{share.fileName}</p>
                  <div className={styles['shared-page__meta']}>
                    {share.createdAt && <><span>Creado {formatDate(share.createdAt)}</span><span>·</span></>}
                    <span>Expira {formatDate(share.expiresAt)}</span>
                  </div>
                </div>
                <div className={styles['shared-page__actions']}>
                  <button
                    className={
                      styles['shared-page__copy'] +
                      (isCopied ? ` ${styles['shared-page__copy--copied']}` : '')
                    }
                    onClick={() => handleCopy(share.id)}
                  >
                    <HiLink />
                    {isCopied ? 'Copiado' : 'Copiar enlace'}
                  </button>
                  <button
                    className={styles['shared-page__revoke']}
                    onClick={() => revokeShare(share.id)}
                    disabled={isRevoking}
                    title="Revocar enlace"
                  >
                    <HiTrash />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SharedPage;
