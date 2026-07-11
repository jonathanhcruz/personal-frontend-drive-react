import { NavLink } from 'react-router-dom';
import { HiLogout } from 'react-icons/hi';
import { Logo } from '../Logo';
import { useAuth } from '../../hooks/useAuth';
import { NAV_ITEMS } from './constants';
import styles from './Sidebar.module.scss';
import type { SidebarProps } from './Sidebar.types';

export const Sidebar = ({ isOpen, onClose }: SidebarProps): React.JSX.Element => {
  const { logout, isLoggingOut } = useAuth();

  return (
    <aside className={[styles['sidebar'], isOpen ? styles['sidebar--open'] : ''].filter(Boolean).join(' ')}>
      <div className={styles['sidebar__brand']}>
        <Logo size="sm" />
        <div className={styles['sidebar__brand-text']}>
          <span className={styles['sidebar__brand-name']}>PRIVATE</span>
          <span className={styles['sidebar__brand-sub']}>DRIVE</span>
        </div>
      </div>

      <nav className={styles['sidebar__nav']}>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                styles['sidebar__nav-item'],
                isActive ? styles['sidebar__nav-item--active'] : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            <span className={styles['sidebar__nav-icon']}><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className={styles['sidebar__storage']}>
        <div className={styles['sidebar__storage-header']}>
          <span className={styles['sidebar__storage-label']}>ALMACENAMIENTO</span>
          <span className={styles['sidebar__storage-pct']}>37%</span>
        </div>
        <div className={styles['sidebar__storage-track']}>
          <div className={styles['sidebar__storage-fill']} style={{ width: '37%' }} />
        </div>
        <span className={styles['sidebar__storage-info']}>18.4 GB / 30 GB</span>
      </div>

      <button
        type="button"
        className={styles['sidebar__logout']}
        onClick={() => { logout(); onClose?.(); }}
        disabled={isLoggingOut}
      >
        <span className={styles['sidebar__nav-icon']}><HiLogout /></span>
        Cerrar sesión
      </button>
    </aside>
  );
};
