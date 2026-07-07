import { useTopbar } from '../../hooks/useTopbar';

const SharedPage = (): React.JSX.Element => {
  useTopbar({ left: <span>Compartidos</span> });

  return (
    <div style={{ padding: '2rem', color: 'var(--text-primary)' }}>
      <p>Contenido de compartidos — próximamente</p>
    </div>
  );
};

export default SharedPage;
