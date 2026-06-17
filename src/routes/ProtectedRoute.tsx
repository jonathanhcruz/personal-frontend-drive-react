import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { axiosInstance, setAccessToken } from '../lib/axios';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

const ProtectedRoute = (): React.JSX.Element => {
  const [status, setStatus] = useState<AuthStatus>('checking');

  useEffect(() => {
    // Cookie httpOnly se envía automáticamente — no hace falta body
    axiosInstance
      .post<{ data: { accessToken: string } }>('/api/auth/refresh')
      .then(({ data }) => {
        setAccessToken(data.data.accessToken);
        setStatus('authenticated');
      })
      .catch(() => {
        setAccessToken(null);
        setStatus('unauthenticated');
      });
  }, []);

  if (status === 'checking') return <div>Cargando...</div>;
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
