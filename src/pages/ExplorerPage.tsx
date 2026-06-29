import { useParams } from 'react-router-dom';
import { useFolders } from '../hooks/useFolders';
import { useFiles } from '../hooks/useFiles';
import { useAuth } from '../hooks/useAuth';

const ExplorerPage = (): React.JSX.Element => {
  const { folderId } = useParams<{ folderId?: string }>();
  const { logout } = useAuth();
  const { currentFolder, subfolders, files, breadcrumb, isLoading, error } = useFolders(folderId);
  const { uploadFile, isUploading, deleteFile, isDeletingFile, downloadFile, isDownloading } = useFiles(folderId);

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', color: 'white', background: '#0d1117', minHeight: '100vh' }}>
      <button type="button" onClick={() => logout()}>Cerrar sesión</button>
      <hr />
      <p><strong>Breadcrumb:</strong> {breadcrumb.map(b => b.name).join(' › ') || 'Raíz'}</p>
      <p><strong>Carpeta actual:</strong> {currentFolder?.name ?? 'Raíz'}</p>

      <h3>Subir archivo</h3>
      <input
        type="file"
        disabled={isUploading || !folderId}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />
      {isUploading && <span> Subiendo...</span>}
      {!folderId && <span> (entra a una carpeta para subir)</span>}

      <h3>Subcarpetas ({subfolders.length})</h3>
      <ul>{subfolders.map(f => <li key={f.id}>{f.name}</li>)}</ul>

      <h3>Archivos ({files.length})</h3>
      <ul>
        {files.map(f => (
          <li key={f.id}>
            {f.name}{' '}
            <button
              type="button"
              disabled={isDownloading}
              onClick={() => downloadFile({ id: f.id, name: f.name })}
            >
              Descargar
            </button>
            {' '}
            <button
              type="button"
              disabled={isDeletingFile}
              onClick={() => deleteFile(f.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExplorerPage;
