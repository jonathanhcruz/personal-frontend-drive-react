import type { ReactElement } from 'react';

export interface MenuItem {
  label: string;
  icon: ReactElement;
  onClick: () => void;
  variant?: 'default' | 'danger';
}

export interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  items: MenuItem[];
}
