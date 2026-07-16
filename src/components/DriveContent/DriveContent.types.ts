import type { FolderDto, FolderFile } from '../../types/api.types';
import type { ViewMode } from '../../types/api.types';

export interface DriveContentProps {
  folderName: string;
  subfolders: FolderDto[];
  files: FolderFile[];
  viewMode: ViewMode;
  onNewFolder: () => void;
  onOptions: (id: string, type: 'folder' | 'file', position: { x: number; y: number }) => void;
  onPreview?: (file: FolderFile) => void;
}
