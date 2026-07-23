import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createFolder as createFolderService,
  deleteFolder as deleteFolderService,
  downloadFolder as downloadFolderService,
  getBreadcrumb,
  getFolderContents,
  listRoot,
  moveFolder as moveFolderService,
  renameFolder as renameFolderService,
  type RootContents,
} from '../services/folders.service';
import type {
  BreadcrumbItem,
  CreateFolderDto,
  FolderContents,
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
  moveFolder: (payload: { id: string; targetParentId: string | null }) => void;
  isMovingFolder: boolean;
  deleteFolder: (payload: { id: string; recursive?: boolean }) => void;
  isDeleting: boolean;
  downloadFolder: (payload: { id: string; name: string }) => void;
}

export type UseFoldersReturn = FolderState & BreadcrumbState & FolderMutations;

export const useFolders = (folderId?: string): UseFoldersReturn => {
  const queryClient = useQueryClient();

  const contentKey = folderId
    ? queryKeys.folders.content(folderId)
    : queryKeys.folders.root;

  const { data: contentData, isLoading, error } = useQuery<FolderContents | RootContents>({
    queryKey: contentKey,
    queryFn: folderId
      ? () => getFolderContents(folderId)
      : listRoot,
    staleTime: 0,
  });

  const subfolders: FolderDto[] = (contentData as FolderContents | RootContents | undefined)?.subfolders ?? [];

  const files: FolderFile[] = (contentData as FolderContents | RootContents | undefined)?.files ?? [];

  const currentFolder: FolderDto | null = folderId
    ? ((contentData as FolderContents | undefined)?.folder ?? null)
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

  const { mutate: moveFolder, isPending: isMovingFolder } = useMutation({
    mutationFn: ({ id, targetParentId }: { id: string; targetParentId: string | null }) =>
      moveFolderService(id, { targetParentId }),
    onSuccess: invalidateContent,
  });

  const { mutate: deleteFolder, isPending: isDeleting } = useMutation({
    mutationFn: ({ id, recursive = false }: { id: string; recursive?: boolean }) =>
      deleteFolderService(id, recursive),
    onSuccess: invalidateContent,
  });

  const { mutate: downloadFolder } = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      downloadFolderService(id, name),
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
    moveFolder,
    isMovingFolder,
    deleteFolder,
    isDeleting,
    downloadFolder,
  };
};
