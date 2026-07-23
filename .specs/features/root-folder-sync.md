# Feature — Sync con Root Folder Backend

## Contexto

El backend implementó carpetas raíz explícitas por usuario. El endpoint `GET /api/folders` cambió su response shape. Este spec documenta los ajustes necesarios en el frontend.

---

## Cambios necesarios

### 1. `src/services/folders.service.ts` — `listRoot()`

**Antes:**
```typescript
export const listRoot = async (): Promise<FolderDto[]> => {
  const { data } = await axiosInstance.get<ApiResponse<FolderDto[]>>('/api/folders');
  return data.data;  // FolderDto[]
};
```

**Después:**
```typescript
export const listRoot = async (): Promise<{ subfolders: FolderDto[]; files: FolderFile[] }> => {
  const { data } = await axiosInstance.get<ApiResponse<{ subfolders: FolderDto[]; files: FolderFile[] }>>('/api/folders');
  return data.data;  // { subfolders, files }
};
```

---

### 2. `src/hooks/useFolders.ts` — root ahora tiene archivos

Actualmente cuando no hay `folderId`:
- `listRoot()` devuelve `FolderDto[]` → se usa como `subfolders`
- `files` se queda en `[]` — los archivos de root **no se muestran**

Después del cambio, `listRoot()` devuelve `{ subfolders, files }`. El hook debe consumirlos:

```typescript
// ANTES:
const { data: contentData } = useQuery<FolderContents | FolderDto[]>({
  queryFn: folderId ? () => getFolderContents(folderId) : listRoot,
});

const subfolders: FolderDto[] = folderId
  ? ((contentData as FolderContents)?.subfolders ?? [])
  : ((contentData as FolderDto[]) ?? []);       // ← trata como array directo

const files: FolderFile[] = folderId
  ? ((contentData as FolderContents)?.files ?? [])
  : [];                                          // ← root nunca tiene archivos hoy

// DESPUÉS:
type RootContents = { subfolders: FolderDto[]; files: FolderFile[] };

const { data: contentData } = useQuery<FolderContents | RootContents>({
  queryFn: folderId ? () => getFolderContents(folderId) : listRoot,
});

const subfolders: FolderDto[] = folderId
  ? ((contentData as FolderContents)?.subfolders ?? [])
  : ((contentData as RootContents)?.subfolders ?? []);   // ← desestructurar

const files: FolderFile[] = folderId
  ? ((contentData as FolderContents)?.files ?? [])
  : ((contentData as RootContents)?.files ?? []);         // ← root ahora sí tiene archivos
```

**Efecto visible:** por primera vez los archivos subidos a root aparecen en el explorer.

---

### 3. `src/components/FolderPickerModal/FolderPickerModal.tsx` — `rootData` cambia de tipo

El picker usa `listRoot()` para obtener las carpetas del nivel raíz:

```typescript
// ANTES:
const { data: rootData } = useQuery<FolderDto[]>({
  queryFn: listRoot,
});

const rawSubfolders: FolderDto[] = (currentFolderId === null
  ? rootData          // ← FolderDto[] directo
  : folderData?.subfolders) ?? [];

// DESPUÉS:
const { data: rootData } = useQuery<{ subfolders: FolderDto[]; files: FolderFile[] }>({
  queryFn: listRoot,
});

const rawSubfolders: FolderDto[] = (currentFolderId === null
  ? rootData?.subfolders   // ← desestructurar
  : folderData?.subfolders) ?? [];
```

---

## Lo que NO cambia

| Elemento | Por qué no cambia |
|----------|------------------|
| `GET /api/folders/:id` | Sigue devolviendo `{ folder, subfolders, files }` |
| Upload sin `folderId` | Backend resuelve a root — mismo comportamiento |
| `parentId: null` al crear carpeta | Sigue siendo válido — va a root |
| `targetParentId: null` al mover carpeta | Sigue siendo válido — "Mi Drive (raíz)" en el picker |
| `targetFolderId: null` al mover archivo | Sigue siendo válido |
| Breadcrumb | Mismo comportamiento visual — root nunca apareció |
| Descarga de archivos individuales | Sin cambio |

---

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/services/folders.service.ts` | Tipo de retorno y mapeo de `listRoot()` |
| `src/hooks/useFolders.ts` | Consumir `subfolders` y `files` del nuevo shape; root ahora muestra archivos |
| `src/components/FolderPickerModal/FolderPickerModal.tsx` | Usar `rootData?.subfolders` en lugar de `rootData` |

---

## Endpoint afectado

| Método | Ruta | Antes | Después |
|--------|------|-------|---------|
| GET | `/api/folders` | `{ data: FolderDto[] }` | `{ data: { subfolders: FolderDto[], files: FolderFile[] } }` |
