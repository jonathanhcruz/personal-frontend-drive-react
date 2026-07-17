# Estado del proyecto

_Última actualización: 2026-07-16 (sesión 6)_

## Estructura de carpetas

```
src/
  layouts/
    DashboardLayout/    ✅  DashboardLayout.tsx · TopbarContext.tsx · DashboardLayout.module.scss
  components/
    AppTopbar/          ✅  slots left/right · search fijo · avatar fijo · BEM .app-topbar
    BreadcrumbNav/      ✅  links funcionales · truncación MAX_VISIBLE=4 · BEM .breadcrumb-nav
    Button/             ✅  primary/secondary/ghost/danger · sm/md/lg · loading · icons
    ContextMenu/        ✅  portal · Esc/click fuera · variante danger
    DriveContent/       ✅
    ExplorerTopbarActions/ ✅  view-toggle grid/list · botón Subir · BEM .explorer-topbar-actions
    FileItem/           ✅  EXTENSION_COLORS en constants/
    FolderItem/         ✅
    FolderPickerModal/  ✅  picker de destino · lazy level-by-level · excludeId · BEM .folder-picker
    Input/              ✅  TextInput · password toggle · size variants · error state
    Logo/               ✅  dot animado · sm/md/lg
    FilePreviewModal/   ✅  modal preview · ImageViewer · PdfViewer · MediaViewer · TextViewer
    MetadataPanel/      🏗️  scaffold vacío — pendiente implementar
    Modal/              ✅  CreateFolderModal · RenameModal · DeleteModal
    SharePanel/         ✅  modal compartir · useShare interno · copiar token · revocar enlaces
    Sidebar/            ✅  NAV_ITEMS en constants/
    Spinner/            ✅  sm/md/lg · primary/muted
    UploadPanel/        ✅  overlay fixed bottom-right · cola múltiple · progreso real Axios
  hooks/
    useAuth.ts          ✅
    useFiles.ts         ✅  upload · delete · download · renameFile · moveFile
    useFolders.ts       ✅  root→FolderDto[] / subfolder→FolderContents · create/rename/move/delete/download
    useFileBlob.ts      ✅  query blob por fileId · staleTime 5min · blobUrl via createObjectURL
    useShare.ts         ✅
    useTopbar.ts        ✅
    useUploadQueue.ts   ✅  cola con progreso · distingue raíz vs. subcarpeta para invalidación
    useSharedFiles.ts   ✅  query listAllShares + mutation revokeShare con invalidación
  pages/
    LoginPage/          ✅
    ExplorerPage/       ✅  ModalState completo · fileMenu + folderMenu con rename/move/download · preview-file
    SharedPage/         ✅  lista real de shares · copiar enlace · revocar
  services/
    auth.service.ts     ✅
    files.service.ts    ✅  upload · download · delete · renameFile · moveFile + share endpoints
    folders.service.ts  ✅  listRoot (→FolderDto[]) · getFolderContents · renameFolder · moveFolder · deleteFolder · downloadFolder (→ZIP Blob)
    share.service.ts    ✅  getPublicDownloadUrl helper
  types/
    api.types/          ✅  login · files · folders · index
    ui.types.ts         ✅  ViewMode = 'grid' | 'list'
```

## Layout general

```
┌─────────────┬──────────────────────────────────────────┐
│   Sidebar   │              drive-main                  │
│  ~220px     │                                          │
│  fijo       │  ┌──────────────────────────────────┐   │
│             │  │           AppTopbar               │   │
│  Logo sm +  │  │  left slot · search · avatar JL  │   │
│  PRIVATE    │  ├──────────────────────────────────┤   │
│  DRIVE      │  │         DriveContent              │   │
│             │  │  título · metadata                │   │
│  Mi Drive   │  │  CARPETAS → FolderItem            │   │
│  Compartido │  │  ARCHIVOS → FileItem              │   │
│             │  └──────────────────────────────────┘   │
│  ─────────  │                                          │
│  Storage    │                                          │
└─────────────┴──────────────────────────────────────────┘
```

## BEM blocks

| Componente             | Bloque BEM                   |
|------------------------|------------------------------|
| ExplorerPage           | `.explorer`                  |
| Sidebar                | `.sidebar`                   |
| AppTopbar              | `.app-topbar`                |
| DriveContent           | `.drive-content`             |
| ContextMenu            | `.context-menu`              |
| Modal                  | `.modal`                     |
| SharePanel             | `.share-panel`               |
| FolderPickerModal      | `.folder-picker`             |
| FolderItem             | `.folder-item`               |
| FileItem               | `.file-item`                 |
| BreadcrumbNav          | `.breadcrumb-nav`            |
| ExplorerTopbarActions  | `.explorer-topbar-actions`   |

---

## Completado ✅

### Infraestructura
- `src/styles/` — variables, mixins, reset, global
- `src/lib/axios.ts` — axiosInstance + interceptor de auth + SKIP_REFRESH_URLS
- `src/lib/queryClient.ts` — QueryClient (staleTime 30s, retry 1, no refetchOnWindowFocus)
- `src/lib/queryKeys.ts` — query keys centralizadas
- `src/types/api.types/` — login.ts, files.ts, folders.ts, index.ts
- `src/types/ui.types.ts` — `ViewMode = 'grid' | 'list'`
- `src/routes/router.tsx` — rutas `/login`, `/`, `/drive`, `/drive/:folderId`, `/shared`; layout con `DashboardLayout`
- `src/routes/ProtectedRoute.tsx`

### Servicios
- `src/services/auth.service.ts`
- `src/services/files.service.ts` — upload · list · getById · download · delete · renameFile · moveFile + share endpoints (listShares · createShare · revokeShare); `uploadFile` acepta `onUploadProgress`
- `src/services/folders.service.ts` — `listRoot` (→ `FolderDto[]`) · `getFolderContents` · `getBreadcrumb` · `createFolder` · `renameFolder` · `moveFolder` · `deleteFolder` · `downloadFolder` (ZIP Blob)
- `src/services/share.service.ts` — `getPublicDownloadUrl(token)` → `${VITE_BACKEND_URL}/api/share/${token}`

### Hooks
- `src/hooks/useAuth.ts` — login/logout mutations, token solo en memoria
- `src/hooks/useFolders.ts` — root devuelve `FolderDto[]`; subfolder devuelve `FolderContents`; derivación de `subfolders/files/currentFolder` separada por `folderId`; mutations: create/rename/move/delete/download + breadcrumb
- `src/hooks/useFileBlob.ts` — `useQuery` con `queryKey: ['file-blob', fileId]`; `staleTime: 5min`; retorna `{ blobUrl, isLoading, error }`
- `src/hooks/useFiles.ts` — mutations: upload/delete/download/renameFile/moveFile; invalida queryKeys.folders al mutar
- `src/hooks/useShare.ts` — query listShares + mutations createShare/revokeShare; scoped a `fileId`
- `src/hooks/useTopbar.ts` — inyecta `left`/`right` vía `TopbarContext`; usa `useLayoutEffect`
- `src/hooks/useUploadQueue.ts` — `enqueue(files, actualFolderId, paramFolderId?)` lanza uploads en paralelo con progreso; invalida query correcta raíz vs. subcarpeta; `clearCompleted()`
- `src/hooks/useSharedFiles.ts` — `useQuery` sobre `listAllShares()` + `useMutation` revokeShare

### Componentes base
- `src/components/Button` — variantes primary/secondary/ghost/danger · sm/md/lg · loading · iconStart/iconEnd
- `src/components/Input` — `TextInput` con password toggle · size variants · error state · iconStart/iconEnd
- `src/components/Logo` — dot animado · sm/md/lg
- `src/components/Spinner` — sm/md/lg · primary/muted

### Layout — DashboardLayout
- `src/layouts/DashboardLayout/TopbarContext.tsx` — `TopbarConfig { left, right? }` · `TopbarProvider` · `useTopbarContext`
- `src/layouts/DashboardLayout/DashboardLayout.tsx` — `TopbarProvider` wrappea `LayoutShell`; shell renderiza Sidebar + AppTopbar + Outlet
- `src/components/AppTopbar` — slots `left`/`right` como `ReactNode`; search y avatar fijos; BEM `.app-topbar`

### Dashboard
- `src/components/Sidebar` — Logo sm + brand PRIVATE/DRIVE + NavLinks + storage bar (hardcoded); NAV_ITEMS en `constants/`
- `src/components/DriveContent` — heading con título/meta + "Nueva carpeta" + sección CARPETAS + ARCHIVOS + estado vacío
- `src/components/BreadcrumbNav` — `<Link>` funcionales; truncación MAX_VISIBLE=4; BEM `.breadcrumb-nav`
- `src/components/ExplorerTopbarActions` — view-toggle grid/list + botón Subir; BEM `.explorer-topbar-actions`
- `src/components/FolderItem` — icono HiFolder + nombre truncado + botón dots (hover) · viewMode · `--list`
- `src/components/FileItem` — badge por extensión + nombre + tamaño + fecha + dots · viewMode · `--list`

### Componentes globales — Modal
- `src/components/Modal` — portal + cierre Esc/overlay · BEM `.modal`
- `src/components/Modal/CreateFolderModal` — input controlado + Enter confirma
- `src/components/Modal/RenameModal` — input pre-cargado + deshabilita guardar si sin cambio; usado para carpetas y archivos
- `src/components/Modal/DeleteModal` — confirmación `variant="danger"` · cubre carpeta y archivo

### Componentes globales — FolderPickerModal ✅
- `src/components/FolderPickerModal` — picker de carpeta destino para mover archivos y carpetas
- Navegación lazy nivel por nivel: `listRoot()` al abrir, `getFolderContents(id)` al navegar dentro
- `→` (HiChevronRight) navega a subcarpeta con `hasChildren = true`; `← Atrás` sube un nivel
- "Mi Drive (raíz)" siempre visible como primera opción (destino `null`)
- `excludeId` oculta la carpeta siendo movida (cycle prevention; backend también valida)
- `UNSELECTED` Symbol sentinel distingue "nada" de `null` (raíz); "Mover" habilitado solo al seleccionar

### Componentes globales — ContextMenu
- `src/components/ContextMenu` — portal · Esc/click fuera · BEM `.context-menu` · variante `danger`
- **Carpeta:** Renombrar → `rename-folder` · Mover a... → `move-folder` · Descargar → `downloadFolder` (ZIP directo) · Eliminar → `delete-folder`
- **Archivo:** Renombrar → `rename-file` · Mover a... → `move-file` · Compartir → `share-file` · Descargar → `downloadFile` · Eliminar → `delete-file`

### Componentes globales — SharePanel ✅
- `src/components/SharePanel` — modal compartir · `useShare(fileId)` interno
- Lista enlaces activos + fecha expiración + botón revocar por enlace
- Botón "Crear enlace" → muestra URL copiable con feedback "Copiado" 2s
- `createdUrl` se resetea al cambiar `fileId`

### Componentes globales — FilePreviewModal ✅
- `src/components/FilePreviewModal` — portal · fondo oscuro · header con nombre + Descargar + cerrar · BEM `.file-preview`
- `ImageViewer` — `<img>` centrado con `max-width/max-height`
- `PdfViewer` — `pdfjs-dist` v6 · canvas por página · controles prev/next · escala 1.5x
- `MediaViewer` — `<video controls>` para `video/*` · `<audio controls>` para `audio/*`
- `TextViewer` — `fetch(blobUrl).then(r => r.text())` + `<pre><code>` con scroll · fuente monospace
- `src/utils/fileTypes.ts` — `isTextPreviewable(mimeType, fileName)`: MIME primero, extensión como fallback; soporta `.dart`, `.env`, `.yaml`, `.ts`, `.py`, `.go`, `.rs` y más
- `src/workers/pdf.worker.ts` — wrapper para Vite (`?worker&url`) que bundlea `pdf.worker.min.mjs` como `.js` (fix MIME type Android Chrome)
- `src/lib/pdfjs.ts` — `GlobalWorkerOptions.workerSrc` apunta al worker bundleado vía `?worker&url`
- `vite.config.ts` — `worker: { format: 'es' }` para que Vite emita workers como ES modules
- Modal responsive: `dvh` en lugar de `vh` · full-screen en mobile (≤640px) · `border-radius: 0` en mobile
- `no-select` aplicado en: `FolderItem`, `FileItem`, `BreadcrumbNav`, `Sidebar __nav-item`

### Componentes globales — Folder ZIP Download ✅
- `src/services/folders.service.ts` — `downloadFolder(id, name)` → `GET /api/folders/:id/download` (Blob) → `<a>.click()` → guarda como `<name>.zip`
- `src/hooks/useFolders.ts` — `downloadFolder` mutation expuesta (sin invalidación de caché)
- `ExplorerPage` — opción "Descargar" en `folderMenuItems` antes de "Eliminar"; usa `HiDownload`

### Componentes globales — UploadPanel ✅
- `src/components/UploadPanel` — overlay fixed bottom-right · BEM `.upload-panel`
- Header dinámico: "Subiendo N…" / "N subidos" / "N subidos · M con error"
- Lista scrolleable (máx 260px) con nombre + barra de progreso real (Axios `onUploadProgress`)
- Botón "×" → `clearCompleted()` — solo cierra si no hay uploads activos

### Páginas
- `src/pages/LoginPage/index.tsx`
- `src/pages/ExplorerPage/index.tsx` — `ModalState`: create-folder · rename-folder · rename-file · move-file · move-folder · delete-folder · delete-file · share-file · preview-file; `<input multiple>`; `useFiles(folderId)` con param URL; doble clic en `FileItem` abre preview para imagen/PDF/video/audio/texto
- `src/pages/SharedPage/index.tsx` — `useSharedFiles`; copiar enlace 2s; revocar; estados vacío y loading

---

## Pendiente ⏳

### FilePreviewModal — Fase 5 (Fallback) ⏳
- Tipos no cubiertos por ningún viewer
- Render: icono + "Vista previa no disponible para este tipo de archivo" + botón Descargar
- Componente: `UnsupportedView` dentro de `FilePreviewModal`

### FilePreviewModal — "Vista previa" en ContextMenu de archivo ⏳
- Actualmente solo accesible vía doble clic en `FileItem`
- Pendiente: agregar opción "Vista previa" en `fileMenuItems` en `ExplorerPage`

### MetadataPanel ⏳ (scaffold vacío)
- Modal con metadatos del archivo: nombre, tipo MIME, tamaño, fecha de subida, checksum SHA-256
- Se abre desde "Ver detalles" en el ContextMenu del archivo
- Endpoint: `GET /api/files/:id` (ya existe en `files.service.ts` como `getFileMetadata`)

---

## Bugs corregidos
- **`listRoot` API breaking change** — `GET /api/folders` cambió de `FolderContents` a `FolderDto[]`; actualizado tipo en `folders.service.ts`, derivación en `useFolders`, query en `FolderPickerModal`
- **`currentFolder` nulo en raíz** — `useFolders` ignoraba el `folder` del response; ahora unificado
- **`parentId: null` al crear en raíz** — ExplorerPage deriva `activeFolderId = currentFolder?.id`
- **DeleteModal no cerraba** — `onDelete` no llamaba `closeModal()`
- **Breadcrumb no navegable** — items eran `<span>`; reemplazados por `<Link>` en `BreadcrumbNav`
- **UI no actualizaba tras upload/delete** — mismatch de query keys; corregido con `paramFolderId` en `useUploadQueue`

## Decisiones tomadas
- **Badge, Breadcrumb, FolderGrid:** eliminados — YAGNI
- **Recientes y Papelera:** fuera del sidebar — no disponibles en backend
- **Almacenamiento:** hardcodeado; se conecta cuando backend lo exponga
- **Avatar:** mock "JL"; conectar con datos reales después
- **Búsqueda:** input deshabilitado — funcionalidad futura
- **Streaming:** `downloadFile` usa Blob — deuda técnica para archivos grandes
- **TopbarContext:** scoped al `DashboardLayout`, no global
- **SharePanel URL:** `/api/files/share/${token}` (autenticado) vs. `/api/share/${token}` (público) — endpoints distintos
- **FolderPickerModal raíz:** "Mi Drive (raíz)" siempre visible; `null` como `targetFolderId/targetParentId` mueve a nivel raíz
- **Breadcrumb sin "root":** backend ya no incluye la carpeta "root"; "Mi Drive" es label estático en el frontend
