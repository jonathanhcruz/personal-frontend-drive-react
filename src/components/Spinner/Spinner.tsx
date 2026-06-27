import type { SpinnerProps } from './Spinner.types';
import styles from './Spinner.module.scss';

export const Spinner = ({
  size = 'md',
  color = 'primary',
  'aria-label': ariaLabel = 'Cargando...',
}: SpinnerProps): React.JSX.Element => {
  const classes = [
    styles['spinner'],
    styles[`spinner--${size}`],
    styles[`spinner--${color}`],
  ].join(' ');

  return <span className={classes} role="status" aria-label={ariaLabel} />;
};
