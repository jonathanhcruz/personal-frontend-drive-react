import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFileBlob } from '../services/files.service';
import { queryKeys } from '../lib/queryKeys';

interface FileBlobState {
  blobUrl: string | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const useFileBlob = (fileId: string | null): FileBlobState => {
  const [blobUrl, setBlobUrl] = useState<string | undefined>();

  const { data: blob, isLoading, error } = useQuery<Blob>({
    queryKey: fileId ? queryKeys.files.blob(fileId) : ['files', 'blob-noop'],
    queryFn: () => getFileBlob(fileId!),
    enabled: !!fileId,
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    structuralSharing: false,
  });

  useEffect(() => {
    if (!blob) {
      setBlobUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(blob);
    setBlobUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  return { blobUrl, isLoading, error: error as Error | null };
};
