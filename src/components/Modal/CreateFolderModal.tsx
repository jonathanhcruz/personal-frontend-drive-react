import { useState } from 'react';
import { Button } from '../Button';
import { TextInput } from '../Input';
import { Modal } from './Modal';

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
  isLoading?: boolean;
}

export const CreateFolderModal = ({
  isOpen,
  onClose,
  onCreate,
  isLoading,
}: CreateFolderModalProps): React.JSX.Element => {
  const [name, setName] = useState('');

  const handleConfirm = (): void => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
    onClose();
  };

  const handleClose = (): void => {
    setName('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva carpeta"
      footer={
        <>
          <Button label="Cancelar" variant="ghost" size="sm" onClick={handleClose} />
          <Button
            label="Crear"
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={!name.trim()}
            loading={isLoading}
          />
        </>
      }
    >
      <TextInput
        placeholder="Nombre de la carpeta"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleConfirm();
        }}
        fullWidth
        autoFocus
      />
    </Modal>
  );
};
