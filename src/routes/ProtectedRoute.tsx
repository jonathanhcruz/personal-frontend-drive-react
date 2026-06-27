import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { setAccessToken } from '../lib/axios';
import { refresh } from '../services/auth.service';
import { Spinner } from '../components/Spinner';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

const ProtectedRoute = (): React.JSX.Element => {
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    refresh()
      .then((accessToken) => {
        setAccessToken(accessToken);
        setStatus('authenticated');
      })
      .catch(() => {
        setAccessToken(null);
        setStatus('unauthenticated');
      });
  }, []);

  if (status === 'checking') return <Spinner size="lg" />;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
