import { useEffect, useState } from 'react';
import { Spinner } from '../Spinner';
import styles from './FilePreviewModal.module.scss';

interface TextViewerProps {
  blobUrl: string;
}

export const TextViewer = ({ blobUrl }: TextViewerProps): React.JSX.Element => {
  const [text, setText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(blobUrl)
      .then((r) => r.text())
      .then((content) => {
        if (cancelled) return;
        setText(content);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('No se pudo cargar el archivo');
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [blobUrl]);

  if (isLoading) {
    return (
      <div className={styles['file-preview__loading']}>
        <Spinner size="md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles['file-preview__error']}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles['file-preview__text-wrap']}>
      <pre className={styles['file-preview__text']}>
        <code>{text}</code>
      </pre>
    </div>
  );
};
