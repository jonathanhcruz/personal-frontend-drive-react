import { useState } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import type { TextInputProps } from './Input.types';
import styles from './Input.module.scss';

export const TextInput = ({
  size = 'md',
  fullWidth = false,
  iconStart,
  iconEnd,
  showPasswordToggle = false,
  error,
  type = 'text',
  disabled,
  className,
  ...rest
}: TextInputProps): React.JSX.Element => {
  const [showPassword, setShowPassword] = useState(false);

  const resolvedType =
    showPasswordToggle && type === 'password'
      ? showPassword
        ? 'text'
        : 'password'
      : type;

  const wrapperClasses = [
    styles['text-input'],
    styles[`text-input--${size}`],
    fullWidth ? styles['text-input--full-width'] : '',
    error ? styles['text-input--error'] : '',
    disabled ? styles['text-input--disabled'] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapperClasses}>
      {iconStart && (
        <span className={styles['text-input__icon-start']}>{iconStart}</span>
      )}
      <input
        className={styles['text-input__field']}
        type={resolvedType}
        disabled={disabled}
        {...rest}
      />
      {iconEnd && (
        <span className={styles['text-input__icon-end']}>{iconEnd}</span>
      )}
      {showPasswordToggle && type === 'password' && (
        <button
          type="button"
          className={styles['text-input__toggle']}
          onClick={() => setShowPassword((prev) => !prev)}
          tabIndex={-1}
          aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          {showPassword ? <HiEyeOff /> : <HiEye />}
        </button>
      )}
    </div>
  );
};
