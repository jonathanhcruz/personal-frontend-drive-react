import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { uploadFile as uploadFileService } from '../services/files.service';
import { queryKeys } from '../lib/queryKeys';
import type { UploadItem } from '../components/UploadPanel/UploadPanel.types';

export const useUploadQueue = () => {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<UploadItem[]>([]);

  const updateItem = (id: string, patch: Partial<UploadItem>): void => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  };

  const enqueue = useCallback(
    (files: FileList, actualFolderId: string | undefined, paramFolderId?: string): void => {
      const contentKey = paramFolderId
        ? queryKeys.folders.content(paramFolderId)
        : queryKeys.folders.root;

      const newItems: UploadItem[] = Array.from(files).map((file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        status: 'uploading',
        progress: 0,
      }));

      setItems((prev) => [...prev, ...newItems]);

      newItems.forEach((item, i) => {
        const file = files[i];
        uploadFileService(actualFolderId, file, (percent) => {
          updateItem(item.id, { progress: percent });
        })
          .then(() => {
            updateItem(item.id, { status: 'done', progress: 100 });
            void queryClient.invalidateQueries({ queryKey: contentKey });
          })
          .catch((err: unknown) => {
            const message = err instanceof Error ? err.message : 'Error al subir';
            updateItem(item.id, { status: 'error', error: message });
          });
      });
    },
    [queryClient],
  );

  const clearCompleted = useCallback((): void => {
    setItems((prev) => prev.filter((item) => item.status === 'uploading'));
  }, []);

  return { items, enqueue, clearCompleted };
};
