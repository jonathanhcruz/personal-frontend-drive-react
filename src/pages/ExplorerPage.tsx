import { axiosInstance, setAccessToken } from '../lib/axios';
import { useNavigate } from 'react-router-dom';

const ExplorerPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  const handleLogout = async (): Promise<void> => {
    try {
      await axiosInstance.post('/api/auth/logout');
    } finally {
      setAccessToken(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <div>
      <h1>Explorador</h1>
      <button type="button" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default ExplorerPage;
