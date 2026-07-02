import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HiX } from 'react-icons/hi';
import styles from './Modal.module.scss';
import type { ModalProps } from './Modal.types';

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps): React.JSX.Element | null => {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles['modal']} onClick={onClose} role="dialog" aria-modal>
      <div className={styles['modal__panel']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal__header']}>
          <h2 className={styles['modal__title']}>{title}</h2>
          <button className={styles['modal__close']} onClick={onClose} aria-label="Cerrar">
            <HiX />
          </button>
        </div>
        <div className={styles['modal__body']}>{children}</div>
        {footer && <div className={styles['modal__footer']}>{footer}</div>}
      </div>
    </div>,
    document.body,
  );
};
