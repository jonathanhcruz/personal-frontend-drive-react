import type { FolderDto, FolderFile } from '../../types/api.types';
import type { ViewMode } from '../DriveTopbar';

export interface DriveContentProps {
  folderName: string;
  subfolders: FolderDto[];
  files: FolderFile[];
  viewMode: ViewMode;
  onNewFolder: () => void;
}
