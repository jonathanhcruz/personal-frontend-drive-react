import type { FolderFile } from '../../types/api.types';

export interface FileItemProps {
  file: FolderFile;
  onOptions: (id: string) => void;
}
