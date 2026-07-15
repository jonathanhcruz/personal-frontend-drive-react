export interface FolderDto {
  id: string;
  name: string;
  parentId: string | null;
  hasChildren: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FolderFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export interface FolderContents {
  folder: FolderDto;
  subfolders: FolderDto[];
  files: FolderFile[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface CreateFolderDto {
  name: string;
  parentId: string | null;
}

export interface RenameFolderDto {
  name: string;
}

export interface MoveFolderDto {
  targetParentId: string | null;
}
