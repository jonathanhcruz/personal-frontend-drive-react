import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './ContextMenu.module.scss';
import type { ContextMenuProps } from './ContextMenu.types';

export const ContextMenu = ({ isOpen, onClose, position, items }: ContextMenuProps): React.JSX.Element | null => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    const handleClick = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onClose();
    };

    document.addEventListener('keydown', handleKey);
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={menuRef}
      className={styles['context-menu']}
      style={{ top: position.y, left: position.x }}
      role="menu"
    >
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          role="menuitem"
          className={[
            styles['context-menu__item'],
            item.variant === 'danger' ? styles['context-menu__item--danger'] : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            item.onClick();
            onClose();
          }}
        >
          <span className={styles['context-menu__item-icon']}>{item.icon}</span>
          <span className={styles['context-menu__item-label']}>{item.label}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
};
