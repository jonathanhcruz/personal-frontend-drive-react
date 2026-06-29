import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFolder as createFolderService,
  deleteFolder as deleteFolderService,
  getBreadcrumb,
  getFolderContents,
  listRoot,
  renameFolder as renameFolderService,
} from '../services/folders.service';
import type {
  BreadcrumbItem,
  CreateFolderDto,
  FolderDto,
  FolderFile,
} from '../types/api.types';
import { queryKeys } from '../lib/queryKeys';

interface FolderState {
  currentFolder: FolderDto | null;
  subfolders: FolderDto[];
  files: FolderFile[];
  isLoading: boolean;
  error: Error | null;
}

interface BreadcrumbState {
  breadcrumb: BreadcrumbItem[];
  isBreadcrumbLoading: boolean;
}

interface FolderMutations {
  createFolder: (dto: CreateFolderDto) => void;
  isCreating: boolean;
  renameFolder: (payload: { id: string; name: string }) => void;
  isRenaming: boolean;
  deleteFolder: (payload: { id: string; recursive?: boolean }) => void;
  isDeleting: boolean;
}

export type UseFoldersReturn = FolderState & BreadcrumbState & FolderMutations;

export const useFolders = (folderId?: string): UseFoldersReturn => {
  const queryClient = useQueryClient();

  const contentKey = folderId
    ? queryKeys.folders.content(folderId)
    : queryKeys.folders.root;

  const { data: contentData, isLoading, error } = useQuery({
    queryKey: contentKey,
    queryFn: folderId
      ? () => getFolderContents(folderId)
      : listRoot,
  });

  const subfolders: FolderDto[] = folderId
    ? ((contentData as { subfolders: FolderDto[] } | undefined)?.subfolders ?? [])
    : ((contentData as FolderDto[] | undefined) ?? []);

  const files: FolderFile[] = folderId
    ? ((contentData as { files: FolderFile[] } | undefined)?.files ?? [])
    : [];

  const currentFolder: FolderDto | null = folderId
    ? ((contentData as { folder: FolderDto } | undefined)?.folder ?? null)
    : null;

  const { data: breadcrumbData, isLoading: isBreadcrumbLoading } = useQuery({
    queryKey: folderId ? queryKeys.folders.breadcrumb(folderId) : ['folders', 'breadcrumb-noop'],
    queryFn: () => getBreadcrumb(folderId!),
    enabled: !!folderId,
  });

  const breadcrumb: BreadcrumbItem[] = breadcrumbData ?? [];

  const invalidateContent = () => queryClient.invalidateQueries({ queryKey: contentKey });

  const { mutate: createFolder, isPending: isCreating } = useMutation({
    mutationFn: (dto: CreateFolderDto) => createFolderService(dto),
    onSuccess: invalidateContent,
  });

  const { mutate: renameFolder, isPending: isRenaming } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      renameFolderService(id, { name }),
    onSuccess: invalidateContent,
  });

  const { mutate: deleteFolder, isPending: isDeleting } = useMutation({
    mutationFn: ({ id, recursive = false }: { id: string; recursive?: boolean }) =>
      deleteFolderService(id, recursive),
    onSuccess: invalidateContent,
  });

  return {
    currentFolder,
    subfolders,
    files,
    isLoading,
    error: error as Error | null,
    breadcrumb,
    isBreadcrumbLoading,
    createFolder,
    isCreating,
    renameFolder,
    isRenaming,
    deleteFolder,
    isDeleting,
  };
};
