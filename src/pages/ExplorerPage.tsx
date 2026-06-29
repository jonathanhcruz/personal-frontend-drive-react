import { useParams } from 'react-router-dom';
import { useFolders } from '../hooks/useFolders';
import { useAuth } from '../hooks/useAuth';

const ExplorerPage = (): React.JSX.Element => {
  const { folderId } = useParams<{ folderId?: string }>();
  const { logout } = useAuth();
  const { currentFolder, subfolders, files, breadcrumb, isLoading, error } = useFolders(folderId);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'white', background: '#0d1117', minHeight: '100vh' }}>
      <button type="button" onClick={() => logout()}>Cerrar sesión</button>
      <hr />
      <p><strong>Breadcrumb:</strong> {breadcrumb.map(b => b.name).join(' › ') || 'Raíz'}</p>
      <p><strong>Carpeta actual:</strong> {currentFolder?.name ?? 'Raíz'}</p>
      <h3>Subcarpetas ({subfolders.length})</h3>
      <ul>{subfolders.map(f => <li key={f.id}>{f.name}</li>)}</ul>
      <h3>Archivos ({files.length})</h3>
      <ul>{files.map(f => <li key={f.id}>{f.name}</li>)}</ul>
    </div>
  );
};

export default ExplorerPage;
