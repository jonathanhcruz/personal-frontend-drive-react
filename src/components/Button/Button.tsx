import type { ButtonProps } from './Button.types';
import styles from './Button.module.scss';

export const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  iconStart,
  iconEnd,
  disabled,
  className,
  ...rest
}: ButtonProps): React.JSX.Element => {
  const classes = [
    styles['custom-btn'],
    styles[`custom-btn--${variant}`],
    styles[`custom-btn--${size}`],
    fullWidth ? styles['custom-btn--full-width'] : '',
    loading ? styles['custom-btn--loading'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} disabled={disabled || loading} {...rest}>
      {iconStart && <span className={styles['custom-btn__icon-start']}>{iconStart}</span>}
      <span className={styles['custom-btn__label']}>{label}</span>
      {iconEnd && <span className={styles['custom-btn__icon-end']}>{iconEnd}</span>}
    </button>
  );
};
