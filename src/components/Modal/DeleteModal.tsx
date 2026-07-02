import { Button } from '../Button';
import { Modal } from './Modal';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  type: 'folder' | 'file';
  onDelete: () => void;
  isLoading?: boolean;
}

export const DeleteModal = ({
  isOpen,
  onClose,
  name,
  type,
  onDelete,
  isLoading,
}: DeleteModalProps): React.JSX.Element => {
  const label = type === 'folder' ? 'carpeta' : 'archivo';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Eliminar ${label}`}
      footer={
        <>
          <Button label="Cancelar" variant="ghost" size="sm" onClick={onClose} />
          <Button
            label="Eliminar"
            variant="danger"
            size="sm"
            onClick={onDelete}
            loading={isLoading}
          />
        </>
      }
    >
      <p>
        ¿Eliminar <strong>{name}</strong>?{' '}
        {type === 'folder' && 'Se eliminará todo su contenido. '}
        Esta acción no se puede deshacer.
      </p>
    </Modal>
  );
};
