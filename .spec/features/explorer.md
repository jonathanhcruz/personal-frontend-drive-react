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

### `FolderGrid`
- Grilla de items: subcarpetas + archivos de la carpeta actual
- Carpetas primero, luego archivos
- Cada item tiene su menú contextual (tres puntos o click derecho)
- Estado vacío: mensaje "Esta carpeta está vacía" + botón crear carpeta

### `FolderItem`
- Representa una carpeta en la grilla
- Click → navega a `/drive/:id`
- Menú contextual: Renombrar | Eliminar

### `FileItem`
- Representa un archivo en la grilla
- Muestra ícono según mime type, nombre, tamaño formateado
- Click → nada (preview es futuro)
- Menú contextual: Descargar | Compartir | Ver detalles | Eliminar

### `ContextMenu`
- Menú flotante posicionado relativo al item
- Se cierra al hacer click fuera o con Escape
- Items configurables según tipo (carpeta vs archivo)

### `MetadataPanel`
- Modal/drawer que muestra detalles de un archivo
- Solo archivos, no carpetas
- Campos: nombre, tipo (mime), tamaño (formateado), fecha de subida, checksum SHA-256
- Abre desde "Ver detalles" en el ContextMenu del archivo

---

## Hooks globales (`src/hooks/`)

### `useFolderContents(folderId?: string)` — `useQuery`
```
Sin folderId → GET /api/folders          (raíz)
Con folderId → GET /api/folders/:id      (carpeta)
queryKey: ['folder', folderId ?? 'root']
```

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
getRootFolders(): Promise<FolderContents>
getFolderContents(id: string): Promise<FolderContents>
getBreadcrumb(id: string): Promise<BreadcrumbItem[]>
createFolder(name: string, parentId?: string): Promise<Folder>
renameFolder(id: string, name: string): Promise<Folder>
deleteFolder(id: string, recursive?: boolean): Promise<void>
```

### `files.service.ts`
```typescript
getFileMetadata(id: string): Promise<File>
deleteFile(id: string): Promise<void>
downloadFile(id: string): void   // abre GET /api/files/:id/download en nueva pestaña
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
| Renombrar | Abre input inline o modal con el nombre actual |
| Eliminar | Confirm dialog → si tiene contenido, incluye aviso de delete recursivo |

### Archivo
| Acción | Comportamiento |
|---|---|
| Descargar | Llama `files.service.downloadFile(id)` → nueva pestaña con el stream |
| Compartir | Abre `SharePanel` (ver feature share.md) |
| Ver detalles | Abre `MetadataPanel` con datos de `GET /api/files/:id` |
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
| GET | `/api/folders` | Carga raíz |
| GET | `/api/folders/:id` | Carga carpeta |
| GET | `/api/folders/:id/breadcrumb` | Breadcrumb |
| POST | `/api/folders` | Crear carpeta |
| PATCH | `/api/folders/:id` | Renombrar carpeta |
| DELETE | `/api/folders/:id` | Eliminar carpeta |
| GET | `/api/files/:id` | Metadata (MetadataPanel) |
| GET | `/api/files/:id/download` | Descarga |
| DELETE | `/api/files/:id` | Eliminar archivo |
