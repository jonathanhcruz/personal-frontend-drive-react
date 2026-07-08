import { axiosInstance } from '../lib/axios';
import type { ApiResponse, CreatedShareDto, FilePublicDto, ShareTokenDto, ShareWithFile } from '../types/api.types';

export const uploadFile = async (
  folderId: string,
  file: File,
  onUploadProgress?: (percent: number) => void,
): Promise<FilePublicDto> => {
  const form = new FormData();
  form.append('file', file);
  const { data } = await axiosInstance.post<ApiResponse<FilePublicDto>>(
    '/api/files/upload',
    form,
    {
      params: { folderId },
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total) onUploadProgress?.(Math.round((e.loaded / e.total) * 100));
      },
    },
  );
  return data.data;
};

export const listByFolder = async (folderId: string): Promise<FilePublicDto[]> => {
  const { data } = await axiosInstance.get<ApiResponse<FilePublicDto[]>>('/api/files', {
    params: { folderId },
  });
  return data.data;
};

export const getFileById = async (id: string): Promise<FilePublicDto> => {
  const { data } = await axiosInstance.get<ApiResponse<FilePublicDto>>(`/api/files/${id}`);
  return data.data;
};

export const downloadFile = async (id: string, name: string): Promise<void> => {
  const response = await axiosInstance.get<Blob>(`/api/files/${id}/download`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(response.data);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
};

export const deleteFile = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/api/files/${id}`);
};

export const listShares = async (fileId: string): Promise<ShareTokenDto[]> => {
  const { data } = await axiosInstance.get<ApiResponse<ShareTokenDto[]>>(`/api/files/${fileId}/share`);
  return data.data;
};

export const createShare = async (fileId: string): Promise<CreatedShareDto> => {
  const { data } = await axiosInstance.post<ApiResponse<CreatedShareDto>>(`/api/files/${fileId}/share`);
  return data.data;
};

export const revokeShare = async (tokenId: string): Promise<void> => {
  await axiosInstance.delete(`/api/files/share/${tokenId}`);
};

export const listAllShares = async (): Promise<ShareWithFile[]> => {
  const { data } = await axiosInstance.get<ApiResponse<ShareWithFile[]>>('/api/files/shares');
  return data.data;
};
