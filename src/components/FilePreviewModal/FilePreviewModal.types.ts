import type { FolderFile } from '../../types/api.types';

export interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: FolderFile | null;
  onDownload: () => void;
}
