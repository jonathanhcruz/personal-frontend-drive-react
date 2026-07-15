import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteFile as deleteFileService,
  downloadFile as downloadFileService,
  moveFile as moveFileService,
  renameFile as renameFileService,
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

  const { mutate: renameFile, isPending: isRenamingFile } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameFileService(id, { name }),
    onSuccess: invalidateContent,
  });

  const { mutate: moveFile, isPending: isMovingFile } = useMutation({
    mutationFn: ({ id, targetFolderId }: { id: string; targetFolderId: string | null }) =>
      moveFileService(id, { targetFolderId }),
    onSuccess: invalidateContent,
  });

  return {
    uploadFile,
    isUploading,
    uploadError: uploadError as Error | null,
    deleteFile,
    isDeletingFile,
    downloadFile,
    isDownloading,
    renameFile,
    isRenamingFile,
    moveFile,
    isMovingFile,
  };
};
