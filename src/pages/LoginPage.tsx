import { useState } from 'react';
import { HiMail, HiLockClosed } from 'react-icons/hi';
import { Button } from '../components/Button';
import { Logo } from '../components/Logo';
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
      <div className={styles['login-page__brand']}>
        <Logo size="md" />
        <div className={styles['login-page__brand-text']}>
          <h1 className={styles['login-page__title']}>PRIVATE DRIVE</h1>
          <p className={styles['login-page__tagline']}>Tu nube personal</p>
        </div>
      </div>

      <div className={styles['login-page__card']}>
        <form className={styles['login-page__form']} onSubmit={handleSubmit}>
          <div className={styles['login-page__fields']}>
            <div className={styles['login-page__field']}>
              <label className={styles['login-page__label']}>Email</label>
              <TextInput
                type="email"
                placeholder="tu@email.com"
                value={email}
                iconStart={<HiMail />}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError('');
                }}
                onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                error={emailError || undefined}
                fullWidth
              />
            </div>
            <div className={styles['login-page__field']}>
              <label className={styles['login-page__label']}>Contraseña</label>
              <TextInput
                type="password"
                placeholder="••••••••"
                showPasswordToggle
                value={password}
                iconStart={<HiLockClosed />}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                error={passwordError || undefined}
                fullWidth
              />
            </div>
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

          {/* <p className={styles['login-page__forgot']}>
            ¿Olvidaste tu contraseña?{' '}
            <span className={styles['login-page__forgot-link']}>Recupérala</span>
          </p> */}
        </form>
      </div>

      <p className={styles['login-page__footer']}>SISTEMA PERSONAL · ACCESO PRIVADO</p>
    </div>
  );
};

export default LoginPage;
