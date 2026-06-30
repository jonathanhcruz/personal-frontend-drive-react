import type { BreadcrumbItem } from '../../types/api.types';

export type ViewMode = 'grid' | 'list';

export interface DriveTopbarProps {
  breadcrumb: BreadcrumbItem[];
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onUpload: () => void;
}
