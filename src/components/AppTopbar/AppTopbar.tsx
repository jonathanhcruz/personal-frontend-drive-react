import { HiSearch } from 'react-icons/hi';
import styles from './AppTopbar.module.scss';
import type { AppTopbarProps } from './AppTopbar.types';

export const AppTopbar = ({ left, right }: AppTopbarProps): React.JSX.Element => {
  return (
    <header className={styles['app-topbar']}>
      <div className={styles['app-topbar__left']}>{left}</div>

      <div className={styles['app-topbar__search']}>
        <HiSearch className={styles['app-topbar__search-icon']} />
        <input
          className={styles['app-topbar__search-input']}
          type="text"
          placeholder="Buscar..."
          disabled
        />
      </div>

      <div className={styles['app-topbar__right']}>
        {right}
        <div className={styles['app-topbar__avatar']}>JL</div>
      </div>
    </header>
  );
};
