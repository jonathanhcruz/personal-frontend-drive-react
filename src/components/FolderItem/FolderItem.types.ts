import type { FolderDto } from '../../types/api.types';

export interface FolderItemProps {
  folder: FolderDto;
  onClick: (id: string) => void;
  onOptions: (id: string, position: { x: number; y: number }) => void;
  viewMode?: 'grid' | 'list';
}
