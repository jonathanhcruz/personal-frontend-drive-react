# Feature — Explorer

## Páginas y rutas

| Ruta | Estado inicial |
|---|---|
| `/drive` | Carga carpetas raíz del usuario |
| `/drive/:folderId` | Carga contenido de la carpeta específica |

Ambas rutas usan el mismo componente `ExplorerPage`. La diferencia es si hay `folderId` en los params o no.

---

## Componentes

### `ExplorerPage`
- Contenedor principal
- Lee `folderId` de los params (si existe)
- Orquesta Breadcrumb + FolderGrid + UploadPanel

### `Breadcrumb`
- Muestra la ruta jerárquica desde raíz hasta carpeta actual
- Cada item es clickeable → navega a esa carpeta
- Raíz siempre visible como primer item
- Datos: `GET /api/folders/:id/breadcrumb`
- Sin selección de texto (`@include no-select`)

### `FolderGrid`
- Grilla de items: subcarpetas + archivos de la carpeta actual
- Carpetas primero, luego archivos
- Cada item tiene su menú contextual (tres puntos o click derecho)
- Estado vacío: mensaje "Esta carpeta está vacía" + botón crear carpeta

### `FolderItem`
- Representa una carpeta en la grilla
- Click → navega a `/drive/:id`
- Menú contextual: Renombrar | Mover a... | Descargar | Eliminar
- Sin selección de texto (`@include no-select`)

### `FileItem`
- Representa un archivo en la grilla
- Muestra ícono según mime type, nombre, tamaño formateado
- Doble click → abre `FilePreviewModal` si el tipo es soportado (imagen, PDF, video, audio, texto/código)
- Cursor `zoom-in` cuando `onPreview` está disponible (`--previewable` modifier)
- Menú contextual: Renombrar | Mover a... | Compartir | Descargar | Eliminar
- Sin selección de texto (`@include no-select`)

### `ContextMenu`
- Menú flotante posicionado relativo al item
- Se cierra al hacer click fuera o con Escape
- Items configurables según tipo (carpeta vs archivo)

### `FolderPickerModal`
- Picker de carpeta destino para mover archivos y carpetas
- Navegación lazy nivel por nivel: `listRoot()` al abrir, `getFolderContents(id)` al navegar
- `→` navega a subcarpeta con `hasChildren = true`; `← Atrás` sube un nivel
- "Mi Drive (raíz)" siempre visible como primera opción (destino `null`) — válido tanto para carpetas como para archivos
- `excludeId` oculta la carpeta siendo movida (cycle prevention)
- Botón "Mover" habilitado solo tras seleccionar destino

### `MetadataPanel`
- Modal/drawer que muestra detalles de un archivo
- Solo archivos, no carpetas
- Campos: nombre, tipo (mime), tamaño (formateado), fecha de subida, checksum SHA-256
- Abre desde "Ver detalles" en el ContextMenu del archivo

---

## Hooks globales (`src/hooks/`)

### `useFolderContents(folderId?: string)` — `useQuery`
```
Sin folderId → GET /api/folders           (subfolders + files raíz en una sola llamada)
Con folderId → GET /api/folders/:id       (subcarpetas + archivos de la carpeta)
queryKey: ['folder', folderId ?? 'root']
```
En raíz se hace **una sola llamada**: `GET /api/folders` devuelve `{ subfolders, files }` directamente.

### `useBreadcrumb(folderId: string)` — `useQuery`
```
GET /api/folders/:id/breadcrumb
queryKey: ['breadcrumb', folderId]
```

### `useCreateFolder()` — `useMutation`
```
POST /api/folders
body: { name, parentId }
onSuccess: invalidateQueries(['folder', parentId ?? 'root'])
```

### `useRenameFolder()` — `useMutation`
```
PATCH /api/folders/:id
body: { name }
onSuccess: invalidateQueries(['folder', parentId])
```

### `useDeleteFolder()` — `useMutation`
```
DELETE /api/folders/:id?recursive=true
onSuccess: invalidateQueries(['folder', parentId])
```

### `useDeleteFile()` — `useMutation`
```
DELETE /api/files/:id
onSuccess: invalidateQueries(['folder', folderId])
```

### `useFileMetadata(fileId: string)` — `useQuery`
```
GET /api/files/:id
queryKey: ['file', fileId]
Solo se activa cuando MetadataPanel está abierto
```

---

## Services

### `folders.service.ts`
```typescript
listRoot(): Promise<{ subfolders: FolderDto[]; files: FolderFile[] }>  // GET /api/folders
getFolderContents(id: string): Promise<FolderContents>
getBreadcrumb(id: string): Promise<BreadcrumbItem[]>
createFolder(dto: CreateFolderDto): Promise<FolderDto>
renameFolder(id: string, dto: RenameFolderDto): Promise<FolderDto>
moveFolder(id: string, dto: MoveFolderDto): Promise<FolderDto>   // targetParentId: null → raíz
deleteFolder(id: string, recursive?: boolean): Promise<void>
downloadFolder(id: string, name: string): Promise<void>  // GET /api/folders/:id/download — Blob ZIP
```

### `files.service.ts`
```typescript
getFileMetadata(id: string): Promise<FilePublicDto>
deleteFile(id: string): Promise<void>
downloadFile(id: string, name: string): Promise<void>   // Blob download
renameFile(id: string, dto: RenameFileDto): Promise<FilePublicDto>
moveFile(id: string, dto: MoveFileDto): Promise<FilePublicDto>   // targetFolderId: uuid | null — null mueve el archivo a raíz
```

---

## Flujo de navegación

```
/drive
  → useFolderContents() sin id
    → GET /api/folders (raíz)
      → FolderGrid muestra carpetas raíz

Click carpeta "Proyectos"
  → navega a /drive/uuid-proyectos
    → useFolderContents('uuid-proyectos')
      → GET /api/folders/uuid-proyectos
        → FolderGrid muestra contenido
          → useBreadcrumb('uuid-proyectos')
            → Breadcrumb: Raíz > Proyectos
```

---

## Acciones del ContextMenu

### Carpeta
| Acción | Comportamiento |
|---|---|
| Renombrar | Abre `RenameModal` con el nombre actual |
| Mover a... | Abre `FolderPickerModal`; carpeta origen excluida con `excludeId` |
| Descargar | `downloadFolder(id, name)` → Blob ZIP download, sin modal |
| Eliminar | Confirm dialog → delete recursivo |

### Archivo
| Acción | Comportamiento |
|---|---|
| Renombrar | Abre `RenameModal` con el nombre actual |
| Mover a... | Abre `FolderPickerModal` |
| Compartir | Abre `SharePanel` (ver feature share.md) |
| Descargar | `downloadFile(id, name)` → Blob download |
| Eliminar | Confirm dialog → DELETE /api/files/:id → refresca grilla |

---

## Errores a manejar

| Código backend | Situación | UI |
|---|---|---|
| `FOLDER_NOT_FOUND` | folderId en URL no existe | Redirect a /drive con toast de error |
| `CONFLICT` | Nombre duplicado al crear/renombrar | Mensaje inline en el input |
| `FORBIDDEN` | Recurso no pertenece al usuario | Toast error |

---

## Endpoints usados

| Método | Ruta | Cuándo |
|---|---|---|
| GET | `/api/folders` | Carga raíz → `{ subfolders: FolderDto[], files: FolderFile[] }` |
| GET | `/api/folders/:id` | Carga carpeta → `FolderContents` |
| GET | `/api/folders/:id/breadcrumb` | Breadcrumb |
| POST | `/api/folders` | Crear carpeta |
| PATCH | `/api/folders/:id` | Renombrar carpeta |
| PATCH | `/api/folders/:id/move` | Mover carpeta |
| DELETE | `/api/folders/:id` | Eliminar carpeta |
| GET | `/api/folders/:id/download` | Descargar carpeta como ZIP |
| GET | `/api/files/:id` | Metadata (MetadataPanel) |
| GET | `/api/files/:id/download` | Descarga |
| PATCH | `/api/files/:id` | Renombrar archivo |
| PATCH | `/api/files/:id/move` | Mover archivo |
| DELETE | `/api/files/:id` | Eliminar archivo |
