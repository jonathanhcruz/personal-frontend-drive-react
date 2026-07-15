# Estado del proyecto

_Última actualización: 2026-07-14 (sesión 5)_

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
    MetadataPanel/      🏗️  scaffold vacío — pendiente implementar
    Modal/              ✅  CreateFolderModal · RenameModal · DeleteModal
    SharePanel/         ✅  modal compartir · useShare interno · copiar token · revocar enlaces
    Sidebar/            ✅  NAV_ITEMS en constants/
    Spinner/            ✅  sm/md/lg · primary/muted
    UploadPanel/        ✅  overlay fixed bottom-right · cola múltiple · progreso real Axios
  hooks/
    useAuth.ts          ✅
    useFiles.ts         ✅  upload · delete · download · renameFile · moveFile
    useFolders.ts       ✅  root→FolderDto[] / subfolder→FolderContents · create/rename/move/delete
    useShare.ts         ✅
    useTopbar.ts        ✅
    useUploadQueue.ts   ✅  cola con progreso · distingue raíz vs. subcarpeta para invalidación
    useSharedFiles.ts   ✅  query listAllShares + mutation revokeShare con invalidación
  pages/
    LoginPage/          ✅
    ExplorerPage/       ✅  ModalState completo · fileMenu + folderMenu con rename/move
    SharedPage/         ✅  lista real de shares · copiar enlace · revocar
  services/
    auth.service.ts     ✅
    files.service.ts    ✅  upload · download · delete · renameFile · moveFile + share endpoints
    folders.service.ts  ✅  listRoot (→FolderDto[]) · getFolderContents · renameFolder · moveFolder · deleteFolder
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
- `src/services/folders.service.ts` — `listRoot` (→ `FolderDto[]`) · `getFolderContents` · `getBreadcrumb` · `createFolder` · `renameFolder` · `moveFolder` · `deleteFolder`
- `src/services/share.service.ts` — `getPublicDownloadUrl(token)` → `${VITE_BACKEND_URL}/api/share/${token}`

### Hooks
- `src/hooks/useAuth.ts` — login/logout mutations, token solo en memoria
- `src/hooks/useFolders.ts` — root devuelve `FolderDto[]`; subfolder devuelve `FolderContents`; derivación de `subfolders/files/currentFolder` separada por `folderId`; mutations: create/rename/move/delete + breadcrumb
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
- **Carpeta:** Renombrar → `rename-folder` · Mover a... → `move-folder` · Eliminar → `delete-folder`
- **Archivo:** Renombrar → `rename-file` · Mover a... → `move-file` · Compartir → `share-file` · Descargar → `downloadFile` · Eliminar → `delete-file`

### Componentes globales — SharePanel ✅
- `src/components/SharePanel` — modal compartir · `useShare(fileId)` interno
- Lista enlaces activos + fecha expiración + botón revocar por enlace
- Botón "Crear enlace" → muestra URL copiable con feedback "Copiado" 2s
- `createdUrl` se resetea al cambiar `fileId`

### Componentes globales — UploadPanel ✅
- `src/components/UploadPanel` — overlay fixed bottom-right · BEM `.upload-panel`
- Header dinámico: "Subiendo N…" / "N subidos" / "N subidos · M con error"
- Lista scrolleable (máx 260px) con nombre + barra de progreso real (Axios `onUploadProgress`)
- Botón "×" → `clearCompleted()` — solo cierra si no hay uploads activos

### Páginas
- `src/pages/LoginPage/index.tsx`
- `src/pages/ExplorerPage/index.tsx` — `ModalState`: create-folder · rename-folder · rename-file · move-file · move-folder · delete-folder · delete-file · share-file; `<input multiple>`; `useFiles(folderId)` con param URL
- `src/pages/SharedPage/index.tsx` — `useSharedFiles`; copiar enlace 2s; revocar; estados vacío y loading

---

## Pendiente ⏳

### MetadataPanel ⏳ (scaffold vacío)
- Panel lateral o modal con metadatos de archivo/carpeta
- Campos: nombre, tamaño, fecha creación, tipo MIME, propietario

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
