export const getPublicDownloadUrl = (token: string): string =>
  `${import.meta.env.VITE_BACKEND_URL as string}/api/share/${token}`;
