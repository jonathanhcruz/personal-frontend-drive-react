import type { ViewMode } from '../../types/api.types';

export interface ExplorerTopbarActionsProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onUpload: () => void;
}
