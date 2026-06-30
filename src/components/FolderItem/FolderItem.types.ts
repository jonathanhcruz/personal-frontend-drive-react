import type { FolderDto } from '../../types/api.types';

export interface FolderItemProps {
  folder: FolderDto;
  onClick: (id: string) => void;
  onOptions: (id: string) => void;
}
