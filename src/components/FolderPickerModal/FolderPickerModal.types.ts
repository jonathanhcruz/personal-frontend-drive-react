export interface FolderPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetId: string | null) => void;
  excludeId?: string;
  isLoading?: boolean;
}
