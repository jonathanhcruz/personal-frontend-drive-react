import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listAllShares, revokeShare as revokeShareService } from '../services/files.service';
import { queryKeys } from '../lib/queryKeys';

export const useSharedFiles = () => {
  const queryClient = useQueryClient();

  const { data: shares = [], isLoading } = useQuery({
    queryKey: queryKeys.shares.all,
    queryFn: listAllShares,
  });

  const { mutate: revokeShare, isPending: isRevoking } = useMutation({
    mutationFn: (tokenId: string) => revokeShareService(tokenId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.shares.all }),
  });

  return { shares, isLoading, revokeShare, isRevoking };
};
