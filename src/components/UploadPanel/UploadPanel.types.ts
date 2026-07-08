export type UploadStatus = 'uploading' | 'done' | 'error';

export interface UploadItem {
  id: string;
  name: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

export interface UploadPanelProps {
  items: UploadItem[];
  isVisible: boolean;
  onClose: () => void;
}
