import axios from 'axios';

// Access token vive solo en memoria — nunca en localStorage ni sessionStorage
let accessToken: string | null = null;

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

export const getAccessToken = (): string | null => accessToken;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
  withCredentials: true, // envía la cookie httpOnly automáticamente en cada request
});

// Adjunta el accessToken en memoria a cada request
axiosInstance.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// En 401: intenta refresh (cookie se envía sola, sin body) → reintenta el request original
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const { data } = await axiosInstance.post<{ data: { accessToken: string } }>(
          '/api/auth/refresh',
        );
        setAccessToken(data.data.accessToken);
        original.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
        return axiosInstance(original);
      } catch {
        setAccessToken(null);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);
