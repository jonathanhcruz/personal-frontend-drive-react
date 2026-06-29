import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteFile as deleteFileService,
  downloadFile as downloadFileService,
  uploadFile as uploadFileService,
} from '../services/files.service';
import { queryKeys } from '../lib/queryKeys';

export const useFiles = (folderId?: string) => {
  const queryClient = useQueryClient();

  const contentKey = folderId
    ? queryKeys.folders.content(folderId)
    : queryKeys.folders.root;

  const invalidateContent = () => queryClient.invalidateQueries({ queryKey: contentKey });

  const { mutate: uploadFile, isPending: isUploading, error: uploadError } = useMutation({
    mutationFn: (file: File) => uploadFileService(folderId!, file),
    onSuccess: invalidateContent,
  });

  const { mutate: deleteFile, isPending: isDeletingFile } = useMutation({
    mutationFn: (fileId: string) => deleteFileService(fileId),
    onSuccess: invalidateContent,
  });

  const { mutate: downloadFile, isPending: isDownloading } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      downloadFileService(id, name),
  });

  return {
    uploadFile,
    isUploading,
    uploadError: uploadError as Error | null,
    deleteFile,
    isDeletingFile,
    downloadFile,
    isDownloading,
  };
};
