import type { LogoProps } from './Logo.types';
import styles from './Logo.module.scss';

export const Logo = ({ size = 'md' }: LogoProps): React.JSX.Element => {
  const classes = [styles['logo'], styles[`logo--${size}`]].join(' ');

  return (
    <div className={classes}>
      <span className={styles['logo__dot']} />
    </div>
  );
};
