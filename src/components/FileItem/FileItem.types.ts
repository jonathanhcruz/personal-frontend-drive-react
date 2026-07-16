import type { FolderFile } from '../../types/api.types';

export interface FileItemProps {
  file: FolderFile;
  onOptions: (id: string, position: { x: number; y: number }) => void;
  onPreview?: () => void;
  viewMode?: 'grid' | 'list';
}
