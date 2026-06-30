import { HiFolder, HiUsers } from 'react-icons/hi';
import type { IconType } from 'react-icons';

export interface NavItem {
  to: string;
  label: string;
  icon: IconType;
  end: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/drive', label: 'Mi Drive', icon: HiFolder, end: true },
  { to: '/shared', label: 'Compartidos', icon: HiUsers, end: false },
];
