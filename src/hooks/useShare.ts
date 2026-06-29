import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createShare as createShareService,
  listShares,
  revokeShare as revokeShareService,
} from '../services/files.service';
import type { CreatedShareDto } from '../types/api.types';
import { queryKeys } from '../lib/queryKeys';

export const useShare = (fileId: string) => {
  const queryClient = useQueryClient();

  const sharesKey = queryKeys.shares.list(fileId);

  const { data: shares = [], isLoading: isLoadingShares } = useQuery({
    queryKey: sharesKey,
    queryFn: () => listShares(fileId),
    enabled: !!fileId,
  });

  const {
    mutate: createShare,
    isPending: isCreatingShare,
    data: newShare,
  } = useMutation({
    mutationFn: () => createShareService(fileId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sharesKey }),
  });

  const { mutate: revokeShare, isPending: isRevoking } = useMutation({
    mutationFn: (tokenId: string) => revokeShareService(tokenId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: sharesKey }),
  });

  return {
    shares,
    isLoadingShares,
    createShare,
    isCreatingShare,
    newShare: newShare as CreatedShareDto | undefined,
    revokeShare,
    isRevoking,
  };
};
