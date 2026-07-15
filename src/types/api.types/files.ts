export interface FilePublicDto {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  checksum: string;
  folderId: string | null;
  uploadedBy: string;
  deletedAt: string | null;
  createdAt: string;
}

export interface ShareTokenDto {
  id: string;
  expiresAt: string;
  createdAt: string;
}

export interface CreatedShareDto {
  token: string;
  expiresAt: string;
}

export interface ShareWithFile {
  id: string;
  fileName: string;
  expiresAt: string;
  createdAt?: string;
}

export interface RenameFileDto {
  name: string;
}

export interface MoveFileDto {
  targetFolderId: string;
}
