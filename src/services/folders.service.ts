import { axiosInstance } from '../lib/axios';
import type {
  ApiResponse,
  BreadcrumbItem,
  CreateFolderDto,
  FolderContents,
  FolderDto,
  RenameFolderDto,
} from '../types/api.types';

export const listRoot = async (): Promise<FolderDto[]> => {
  const { data } = await axiosInstance.get<ApiResponse<FolderDto[]>>('/api/folders');
  return data.data;
};

export const getFolderContents = async (id: string): Promise<FolderContents> => {
  const { data } = await axiosInstance.get<ApiResponse<FolderContents>>(`/api/folders/${id}`);
  return data.data;
};

export const getBreadcrumb = async (id: string): Promise<BreadcrumbItem[]> => {
  const { data } = await axiosInstance.get<ApiResponse<BreadcrumbItem[]>>(`/api/folders/${id}/breadcrumb`);
  return data.data;
};

export const createFolder = async (dto: CreateFolderDto): Promise<FolderDto> => {
  const { data } = await axiosInstance.post<ApiResponse<FolderDto>>('/api/folders', dto);
  return data.data;
};

export const renameFolder = async (id: string, dto: RenameFolderDto): Promise<FolderDto> => {
  const { data } = await axiosInstance.patch<ApiResponse<FolderDto>>(`/api/folders/${id}`, dto);
  return data.data;
};

export const deleteFolder = async (id: string, recursive = false): Promise<void> => {
  await axiosInstance.delete(`/api/folders/${id}`, { params: { recursive } });
};
