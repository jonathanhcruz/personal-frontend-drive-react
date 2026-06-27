import { useState } from 'react';
import { Button } from '../components/Button';
import { TextInput } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import styles from './LoginPage.module.scss';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = (): React.JSX.Element => {
  const { login, isLoggingIn, loginError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string): string =>
    !value ? 'Campo requerido' : !EMAIL_REGEX.test(value) ? 'Email inválido' : '';

  const validatePassword = (value: string): string =>
    !value ? 'Campo requerido' : '';

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);

    if (eErr || pErr) return;

    login({ email, password });
  };

  const isFormEmpty = !email || !password;
  const hasClientErrors = !!emailError || !!passwordError;

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-page__card']}>
        <div className={styles['login-page__header']}>
          <h1 className={styles['login-page__title']}>PrivateDrive</h1>
          <p className={styles['login-page__subtitle']}>Inicia sesión para continuar</p>
        </div>

        <form className={styles['login-page__form']} onSubmit={handleSubmit}>
          <div className={styles['login-page__fields']}>
            <TextInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              onBlur={(e) => setEmailError(validateEmail(e.target.value))}
              error={emailError || undefined}
              fullWidth
            />
            <TextInput
              type="password"
              placeholder="Contraseña"
              showPasswordToggle
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
              error={passwordError || undefined}
              fullWidth
            />
          </div>

          {loginError && (
            <p className={styles['login-page__error']}>Email o contraseña incorrectos</p>
          )}

          <Button
            type="submit"
            label="Entrar"
            loading={isLoggingIn}
            disabled={isFormEmpty || hasClientErrors}
            fullWidth
          />
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
