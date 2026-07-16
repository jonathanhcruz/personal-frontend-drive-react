import { useEffect, useRef, useState, useCallback } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { pdfjsLib } from '../../lib/pdfjs';
import { Spinner } from '../Spinner';
import styles from './FilePreviewModal.module.scss';

interface PdfViewerProps {
  blobUrl: string;
}

export const PdfViewer = ({ blobUrl }: PdfViewerProps): React.JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    setPdfDoc(null);

    pdfjsLib.getDocument({ url: blobUrl }).promise
      .then((doc) => {
        if (cancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setIsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('No se pudo cargar el PDF');
        setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [blobUrl]);

  const renderPage = useCallback(async (doc: PDFDocumentProxy, pageNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
      renderTaskRef.current = null;
    }

    const page = await doc.getPage(pageNum);
    const viewport = page.getViewport({ scale: 1.5 });

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const renderTask = page.render({ canvas, viewport });
    renderTaskRef.current = renderTask;

    try {
      await renderTask.promise;
    } catch {
      // RenderingCancelledException — página cancelada por navegación rápida
    } finally {
      renderTaskRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!pdfDoc) return;
    renderPage(pdfDoc, currentPage);
  }, [pdfDoc, currentPage, renderPage]);

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
    <div className={styles['file-preview__pdf']}>
      <div className={styles['file-preview__pdf-canvas-wrap']}>
        <canvas ref={canvasRef} className={styles['file-preview__pdf-canvas']} />
      </div>

      {totalPages > 1 && (
        <div className={styles['file-preview__pdf-controls']}>
          <button
            className={styles['file-preview__pdf-btn']}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
          >
            ←
          </button>
          <span className={styles['file-preview__pdf-info']}>
            {currentPage} / {totalPages}
          </span>
          <button
            className={styles['file-preview__pdf-btn']}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};
