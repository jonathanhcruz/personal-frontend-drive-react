import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAccessToken } from '../lib/axios';
import { login } from '../services/auth.service';

//componetes
import { Button } from '../components/Button'

const LoginPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const accessToken = await login({ email, password });
      setAccessToken(accessToken);
      navigate('/drive', { replace: true });
    } catch {
      setError('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p>{error}</p>}
        <Button type="submit" disabled={loading} label={loading ? 'Entrando...' : 'Entrar'}/>
      </form>
    </div>
  );
};

export default LoginPage;
