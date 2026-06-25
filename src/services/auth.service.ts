import { axiosInstance } from '../lib/axios';
import type { ApiResponse, AuthTokens, LoginRequest } from '../types/api.types';

export const login = async (credentials: LoginRequest): Promise<string> => {
  const { data } = await axiosInstance.post<ApiResponse<AuthTokens>>('/api/auth/login', credentials);
  return data.data.accessToken;
};

export const refresh = async (): Promise<string> => {
  const { data } = await axiosInstance.post<ApiResponse<AuthTokens>>('/api/auth/refresh');
  return data.data.accessToken;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post('/api/auth/logout');
};
