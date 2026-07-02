import { useEffect, useState } from 'react';
import { Button } from '../Button';
import { TextInput } from '../Input';
import { Modal } from './Modal';

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onRename: (name: string) => void;
  isLoading?: boolean;
}

export const RenameModal = ({
  isOpen,
  onClose,
  currentName,
  onRename,
  isLoading,
}: RenameModalProps): React.JSX.Element => {
  const [name, setName] = useState(currentName);

  useEffect(() => {
    if (isOpen) setName(currentName);
  }, [isOpen, currentName]);

  const handleConfirm = (): void => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === currentName) return;
    onRename(trimmed);
    onClose();
  };

  const isUnchanged = name.trim() === currentName || !name.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Renombrar"
      footer={
        <>
          <Button label="Cancelar" variant="ghost" size="sm" onClick={onClose} />
          <Button
            label="Guardar"
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            disabled={isUnchanged}
            loading={isLoading}
          />
        </>
      }
    >
      <TextInput
        placeholder="Nuevo nombre"
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
